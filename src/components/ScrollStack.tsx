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

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE STICKY STACK — CSS puro, 60fps nativo, cero JS durante el scroll
───────────────────────────────────────────────────────────────────────────── */
export const MobileStickyStack: React.FC<{ children: ReactNode; itemStackDistance?: number }> = ({
  children,
  itemStackDistance = 18,
}) => {
  const cards = React.Children.toArray(children);
  return (
    <div style={{ position: 'relative' }}>
      {cards.map((child, i) => (
        <div
          key={i}
          style={{
            position: 'sticky',
            top: 60 + i * itemStackDistance,
            zIndex: i + 1,
            marginBottom: i < cards.length - 1 ? '24px' : '0',
            borderRadius: 36,
            overflow: 'hidden',
            transform: `scale(${1 - i * 0.018})`,
            transformOrigin: 'top center',
          }}
        >
          {child}
        </div>
      ))}
      <div style={{ height: '30vh' }} />
    </div>
  );
};

export function getIsMobile() {
  if (typeof window === 'undefined') return false;
  return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 768;
}

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, any>());

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller?.scrollTop || 0,
        containerHeight: scroller?.clientHeight || 0,
      };
    }
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    
    const stackPos = (parseFloat(stackPosition) / 100) * containerHeight;
    const scaleEndPos = (parseFloat(scaleEndPosition) / 100) * containerHeight;

    const endElement = document.querySelector('.scroll-stack-end') as HTMLElement;
    const endElementTop = endElement ? (endElement.getBoundingClientRect().top + window.scrollY) : 0;

    cardsRef.current.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top + window.scrollY - (lastTransformsRef.current.get(i)?.translateY || 0);
      
      const triggerStart = cardTop - stackPos - (itemStackDistance * i);
      const pinEnd = endElementTop - containerHeight / 1.5;

      let translateY = 0;
      if (scrollTop >= triggerStart) {
        translateY = Math.max(0, scrollTop - triggerStart);
        if (scrollTop > pinEnd) {
          translateY = pinEnd - triggerStart;
        }
      }

      let scale = 1;
      let blur = 0;
      
      const nextCard = cardsRef.current[i + 1];
      if (nextCard) {
        const nextRect = nextCard.getBoundingClientRect();
        const nextTop = nextRect.top + window.scrollY - (lastTransformsRef.current.get(i+1)?.translateY || 0);
        const nextTrigger = nextTop - stackPos - (itemStackDistance * (i + 1));
        
        const progress = Math.min(1, Math.max(0, (scrollTop - nextTrigger) / 500));
        scale = 1 - (progress * (1 - (baseScale + i * itemScale)));
        blur = progress * blurAmount;
      }

      const transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      const filter = blur > 0 ? `blur(${blur}px)` : 'none';

      if (card.style.transform !== transform) {
        card.style.transform = transform;
      }
      if (card.style.filter !== filter) {
        card.style.filter = filter;
      }

      lastTransformsRef.current.set(i, { translateY, scale });
    });
  }, [baseScale, blurAmount, getScrollData, itemScale, itemStackDistance, scaleEndPosition, stackPosition]);

  useLayoutEffect(() => {
    const cards = Array.from(document.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;

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

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform';
    });

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lenis.destroy();
    };
  }, [itemDistance, updateCardTransforms]);

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