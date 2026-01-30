import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CallGuard logo mark – simple "C" (call) with a dot (one call, guarded).
 * Geometric, thick stroke, single colour. Works at small sizes.
 */
const LogoMark = ({ size }) => {
  const isSm = size === 'sm';
  const w = isSm ? 28 : 34;
  const h = isSm ? 28 : 34;
  const stroke = isSm ? 2.5 : 3;
  const r = isSm ? 2.5 : 3;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 text-white"
      aria-hidden
    >
      {/* C – open on the right, thick rounded stroke */}
      <path
        d="M26 9 C12 9 8 17 8 17 C8 17 12 25 26 25"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot in the opening – one call, guarded */}
      <circle cx="24" cy="17" r={r} fill="currentColor" />
    </svg>
  );
};

/**
 * Premium logo lockup: mark + CallGuard wordmark.
 * No button styling by default; subtle hover polish.
 */
const Logo = ({ size = 'md', asLink = true }) => {
  const isSm = size === 'sm';
  const gapClass = isSm ? 'gap-2' : 'gap-2.5 md:gap-3';
  const wordmarkClass = isSm
    ? 'text-base font-semibold tracking-[0.02em]'
    : 'text-lg md:text-xl font-semibold tracking-[0.03em]';
  const wordmarkHoverClass =
    'motion-safe:transition-colors motion-safe:duration-200 border-b border-transparent group-hover:border-white/40 group-focus-within:border-white/40';

  const content = (
    <>
      <LogoMark size={size} />
      <span className={`${wordmarkClass} ${wordmarkHoverClass} text-white whitespace-nowrap`}>
        CallGuard
      </span>
    </>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        aria-label="CallGuard home"
        className={`group inline-flex items-center ${gapClass} no-underline outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={`group inline-flex items-center ${gapClass}`}>
      {content}
    </span>
  );
};

export default Logo;
export { LogoMark };
