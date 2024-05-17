import { useEffect, useState } from "react";

export const useElementInViewPort = (element: HTMLElement | null) => {
  const [isInViewPort, setIsInViewPort] = useState(false);
  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!isInViewPort) {
          setIsInViewPort(true);
        }
      } else {
        if (isInViewPort) {
          setIsInViewPort(false);
        }
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, isInViewPort]);

  return { isInViewPort };
};
