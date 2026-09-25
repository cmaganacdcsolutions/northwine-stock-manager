import styles from './WordmarkLogo.module.css';

export interface WordmarkLogoProps {
  className?: string;
}

/**
 * Line-art globe mark shared with the landing page (`landing-page/src/components/atoms/WordmarkLogo`)
 * — a hemisphere with meridian lines, ported here so the Stock Manager login/sidebar carry the same
 * brand lockup instead of a plain text-only wordmark. Kept as inline SVG (no raster asset) so it
 * inherits `currentColor` and stays crisp at any size.
 */
export function WordmarkLogo({ className }: WordmarkLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="North Wine Company"
      className={`${styles.mark} ${className ?? ''}`.trim()}
    >
      <path d="M18,50 A32,32 0 1,0 82,50 A32,32 0 1,0 18,50" />
      <path d="M50,18 C34,30 34,70 50,82" />
      <path d="M50,18 C66,30 66,70 50,82" />
      <path d="M18,50 H82" />
      <path d="M24,34 H76" />
      <path d="M24,66 H76" />
    </svg>
  );
}
