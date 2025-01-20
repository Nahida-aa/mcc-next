'use client'
import { useEffect, useRef, type RefObject } from 'react';

interface UseScrollToBottomProps {
}
interface UseScrollToBottomReturn<T extends HTMLElement> {
  containerRef: RefObject<T>;
  endRef: RefObject<T>;
}
export function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    console.log('useScrollToBottom::useEffect');
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        end.scrollIntoView({ behavior: 'instant', block: 'end' });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
