import { useEffect, useState, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Hook for pinned step-scroll behavior (Apple-style stepper)
 * @param {Object} options
 * @param {number} options.stepsCount - Total number of steps
 * @param {React.RefObject} options.sectionRef - Ref to the section container
 * @returns {{ activeStep: number, progress: number }}
 */
export const usePinnedStepScroll = ({ stepsCount, sectionRef }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const tickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    // Get section's position relative to document
    const sectionTop = scrollY + rect.top;
    const sectionHeight = section.offsetHeight;
    
    // Calculate how far we've scrolled into the section
    const scrollIntoSection = scrollY - sectionTop;
    
    // Total scrollable distance (section height minus viewport)
    const scrollableDistance = Math.max(0, sectionHeight - viewportHeight);
    
    if (scrollIntoSection < 0) {
      // Before section
      setActiveStep(0);
      setProgress(0);
      return;
    }
    
    if (scrollIntoSection >= scrollableDistance) {
      // After section
      setActiveStep(stepsCount - 1);
      setProgress(1);
      return;
    }
    
    // Within section - calculate progress
    const rawProgress = scrollableDistance > 0 
      ? scrollIntoSection / scrollableDistance 
      : 0;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    
    // Map progress to step (each step gets equal scroll space)
    const stepProgress = clampedProgress * stepsCount;
    const newActiveStep = Math.min(
      Math.floor(stepProgress),
      stepsCount - 1
    );

    setProgress(clampedProgress);
    setActiveStep(newActiveStep);
  }, [stepsCount, sectionRef, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Show all steps normally
      setActiveStep(stepsCount - 1);
      setProgress(1);
      return;
    }

    // Throttled scroll handler with rAF
    const onScroll = () => {
      if (!tickingRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          handleScroll();
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    // Handle resize
    const onResize = () => {
      handleScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial calculation with delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      handleScroll();
    }, 150);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      tickingRef.current = false;
    };
  }, [handleScroll, stepsCount, prefersReducedMotion]);

  return { activeStep, progress };
};
