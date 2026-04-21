import React, { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

function isMobileDevice() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth < 768
  );
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '15%',
  scaleEndPosition = '5%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete,
}) => {
  const scrollerRef      = useRef<HTMLDivElement>(null);
  const rafIdRef         = useRef<number | null>(null);
  const lenisRef         = useRef<Lenis | null>(null);
  const cardsRef         = useRef<HTMLElement[]>([]);
  const cardBaseTopRef   = useRef<number[]>([]);
  const endBaseTopRef    = useRef<number>(0);
  const lastTransformRef = useRef<Array<{ translateY: number; scale: number }>>([]);

  /* Throttle: 1 RAF pendiente máximo */
  const rafPendingRef  = useRef(false);
  /* Última posición leída en evento (no en RAF, evita layout thrash) */
  const lastScrollYRef = useRef(0);

  /* ─── Medir posiciones una sola vez ─── */
  const measurePositions = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    cards.forEach(card => { card.style.transform = 'translateZ(0)'; });

    // Forzar reflow una sola vez para leer posiciones limpias
    void document.body.offsetHeight;

    cardBaseTopRef.current = cards.map(
      card => card.getBoundingClientRect().top + window.scrollY
    );

    const endEl = document.querySelector('.scroll-stack-end') as HTMLElement | null;
    endBaseTopRef.current = endEl
      ? endEl.getBoundingClientRect().top + window.scrollY
      : 0;

    lastTransformRef.current = cards.map(() => ({ translateY: 0, scale: 1 }));
  }, []);

  /* ─── Aplicar transforms — SOLO matemáticas, cero lecturas del DOM ─── */
  const applyTransforms = useCallback((scrollTop: number) => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const containerHeight = window.innerHeight;
    const stackPx         = (parseFloat(stackPosition) / 100) * containerHeight;
    const pinEnd          = endBaseTopRef.current - containerHeight / 1.5;

    for (let i = 0; i < cards.length; i++) {
      const card         = cards[i];
      const cardBaseTop  = cardBaseTopRef.current[i];
      const triggerStart = cardBaseTop - stackPx - itemStackDistance * i;

      /* Pinning */
      let translateY = 0;
      if (scrollTop >= triggerStart) {
        translateY = scrollTop - triggerStart;
        const maxPin = pinEnd - triggerStart;
        if (translateY > maxPin) translateY = maxPin;
        if (translateY < 0) translateY = 0;
      }

      /* Escala */
      let scale = 1;
      let blur  = 0;
      const nextBaseTop = cardBaseTopRef.current[i + 1];
      if (nextBaseTop !== undefined) {
        const nextTrigger = nextBaseTop - stackPx - itemStackDistance * (i + 1);
        const raw         = (scrollTop - nextTrigger) / 500;
        const progress    = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        scale = 1 - progress * (1 - (baseScale + i * itemScale));
        blur  = progress * blurAmount;
      }

      /* Escribir al DOM solo si cambió (evita composite innecesario) */
      const last     = lastTransformRef.current[i];
      const tChanged = (translateY - last.translateY) > 0.1 || (last.translateY - translateY) > 0.1;
      const sChanged = (scale - last.scale) > 0.001 || (last.scale - scale) > 0.001;

      if (tChanged || sChanged) {
        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        last.translateY = translateY;
        last.scale      = scale;
      }

      if (blurAmount > 0) {
        const newFilter = blur > 0.05 ? `blur(${blur}px)` : 'none';
        if (card.style.filter !== newFilter) card.style.filter = newFilter;
      }
    }
  }, [baseScale, blurAmount, itemScale, itemStackDistance, stackPosition]);

  /* ─── Setup ─── */
  useLayoutEffect(() => {
    const cards = Array.from(
      document.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      card.style.willChange         = 'transform';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform          = 'translateZ(0)'; /* GPU layer propio */
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
    });

    measurePositions();

    const mobile = isMobileDevice();

    if (!mobile) {
      /* ══ DESKTOP: Lenis ══ */
      const lenis = new Lenis({
        duration: 1.1,
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        applyTransforms(scroll);
      });

      function raf(time: number) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }
      rafIdRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;

      return () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        lenis.destroy();
      };

    } else {
      /* ══ MOBILE / ANDROID: scroll nativo + RAF throttle estricto ══
       *
       * Por qué funciona:
       * - El evento 'scroll' es PASIVO → nunca bloquea el thread de scroll.
       * - Solo guardamos window.scrollY en una ref (costo ≈ 0).
       * - Un único RAF pendiente consume esa ref y aplica transforms.
       *   Si LiquidEther/WebGL ya tiene un frame en vuelo, esperamos
       *   al siguiente — nunca compiten dos RAFs nuestros en el mismo frame.
       ══ */
      const onScroll = () => {
        lastScrollYRef.current = window.scrollY;
        if (rafPendingRef.current) return;
        rafPendingRef.current = true;

        rafIdRef.current = requestAnimationFrame(() => {
          applyTransforms(lastScrollYRef.current);
          rafPendingRef.current = false;
        });
      };

      // Aplicar estado inicial
      applyTransforms(window.scrollY);

      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', onScroll);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafPendingRef.current = false;
      };
    }
  }, [itemDistance, measurePositions, applyTransforms]);

  /* ─── Re-medir en resize / orientación ─── */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        measurePositions();
        applyTransforms(window.scrollY);
      }, 200);
    };
    window.addEventListener('resize',            onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize',            onResize);
      window.removeEventListener('orientationchange', onResize);
      clearTimeout(timer);
    };
  }, [measurePositions, applyTransforms]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" style={{ height: '50vh' }} />
      </div>
    </div>
  );
};

export default ScrollStack;