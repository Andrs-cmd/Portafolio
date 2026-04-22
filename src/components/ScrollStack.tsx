import React, { useLayoutEffect, useRef, useCallback } from 'react';
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
  onStackComplete
}) => {
  const scrollerRef      = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef         = useRef<Lenis | null>(null);
  const cardsRef         = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, any>());

  // ── NUEVO: posiciones estáticas cacheadas (solo mobile) ──
  const cardBaseTopRef   = useRef<number[]>([]);
  const endBaseTopRef    = useRef<number>(0);
  const rafPendingRef    = useRef(false);
  const lastScrollYRef   = useRef(0);

  const isMobile = useRef(
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth < 768
  );

  // ── Lógica original intacta para desktop ──
  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    } else {
      const scroller = scrollerRef.current;
      return { scrollTop: scroller?.scrollTop || 0, containerHeight: scroller?.clientHeight || 0 };
    }
  }, [useWindowScroll]);

  // ── updateCardTransforms original — usado en desktop con Lenis ──
  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPos    = (parseFloat(stackPosition) / 100) * containerHeight;
    const scaleEndPos = (parseFloat(scaleEndPosition) / 100) * containerHeight;

    const endElement    = document.querySelector('.scroll-stack-end') as HTMLElement;
    const endElementTop = endElement ? (endElement.getBoundingClientRect().top + window.scrollY) : 0;

    cardsRef.current.forEach((card, i) => {
      const rect    = card.getBoundingClientRect();
      const cardTop = rect.top + window.scrollY - (lastTransformsRef.current.get(i)?.translateY || 0);

      const triggerStart = cardTop - stackPos - (itemStackDistance * i);
      const pinEnd       = endElementTop - containerHeight / 1.5;

      let translateY = 0;
      if (scrollTop >= triggerStart) {
        translateY = Math.max(0, scrollTop - triggerStart);
        if (scrollTop > pinEnd) translateY = pinEnd - triggerStart;
      }

      let scale = 1;
      let blur  = 0;
      const nextCard = cardsRef.current[i + 1];
      if (nextCard) {
        const nextRect    = nextCard.getBoundingClientRect();
        const nextTop     = nextRect.top + window.scrollY - (lastTransformsRef.current.get(i + 1)?.translateY || 0);
        const nextTrigger = nextTop - stackPos - (itemStackDistance * (i + 1));
        const progress    = Math.min(1, Math.max(0, (scrollTop - nextTrigger) / 500));
        scale = 1 - (progress * (1 - (baseScale + i * itemScale)));
        blur  = progress * blurAmount;
      }

      const transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      const filter    = blur > 0 ? `blur(${blur}px)` : 'none';
      if (card.style.transform !== transform) card.style.transform = transform;
      if (card.style.filter    !== filter)    card.style.filter    = filter;

      lastTransformsRef.current.set(i, { translateY, scale });
    });
  }, [baseScale, blurAmount, getScrollData, itemScale, itemStackDistance, scaleEndPosition, stackPosition]);

  // ── NUEVO: versión mobile — sin getBoundingClientRect en el loop ──
  const updateCardTransformsMobile = useCallback((scrollTop: number) => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const containerHeight = window.innerHeight;
    const stackPx         = (parseFloat(stackPosition) / 100) * containerHeight;
    const pinEnd          = endBaseTopRef.current - containerHeight / 1.5;

    for (let i = 0; i < cards.length; i++) {
      const card         = cards[i];
      const cardBaseTop  = cardBaseTopRef.current[i];
      const triggerStart = cardBaseTop - stackPx - itemStackDistance * i;

      let translateY = 0;
      if (scrollTop >= triggerStart) {
        translateY = scrollTop - triggerStart;
        const maxPin = pinEnd - triggerStart;
        if (translateY > maxPin) translateY = maxPin;
        if (translateY < 0)     translateY = 0;
      }

      let scale = 1;
      let blur  = 0;
      const nextBase = cardBaseTopRef.current[i + 1];
      if (nextBase !== undefined) {
        const nextTrigger = nextBase - stackPx - itemStackDistance * (i + 1);
        const raw         = (scrollTop - nextTrigger) / 500;
        const progress    = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        scale = 1 - progress * (1 - (baseScale + i * itemScale));
        blur  = progress * blurAmount;
      }

      const last     = lastTransformsRef.current.get(i) || { translateY: 0, scale: 1 };
      const tChanged = Math.abs(translateY - last.translateY) > 0.1;
      const sChanged = Math.abs(scale      - last.scale)      > 0.001;

      if (tChanged || sChanged) {
        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        lastTransformsRef.current.set(i, { translateY, scale });
      }

      if (blurAmount > 0) {
        const f = blur > 0.05 ? `blur(${blur}px)` : 'none';
        if (card.style.filter !== f) card.style.filter = f;
      }
    }
  }, [baseScale, blurAmount, itemScale, itemStackDistance, stackPosition]);

  useLayoutEffect(() => {
    const cards = Array.from(document.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange         = 'transform';
      card.style.backfaceVisibility = 'hidden';
    });

    if (!isMobile.current) {
      // ══ DESKTOP — lógica original con Lenis ══
      const lenis = new Lenis({
        duration: 1,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      lenis.on('scroll', updateCardTransforms);

      function raf(time: number) {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      }
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        lenis.destroy();
      };

    } else {
      // ══ MOBILE — scroll nativo + posiciones cacheadas + RAF throttle ══

      // 1. Resetear transforms para leer posición natural
      cards.forEach(card => { card.style.transform = 'translateZ(0)'; });

      // 2. Leer posiciones UNA sola vez
      cardBaseTopRef.current = cards.map(
        c => c.getBoundingClientRect().top + window.scrollY
      );
      const endEl = document.querySelector('.scroll-stack-end') as HTMLElement | null;
      endBaseTopRef.current = endEl ? endEl.getBoundingClientRect().top + window.scrollY : 0;

      // 3. Estado inicial
      updateCardTransformsMobile(window.scrollY);

      // 4. Listener pasivo con throttle estricto de 1 RAF
      const onScroll = () => {
        lastScrollYRef.current = window.scrollY;
        if (rafPendingRef.current) return;
        rafPendingRef.current = true;
        animationFrameRef.current = requestAnimationFrame(() => {
          updateCardTransformsMobile(lastScrollYRef.current);
          rafPendingRef.current = false;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', onScroll);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        rafPendingRef.current = false;
      };
    }
  }, [itemDistance, updateCardTransforms, updateCardTransformsMobile]);

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