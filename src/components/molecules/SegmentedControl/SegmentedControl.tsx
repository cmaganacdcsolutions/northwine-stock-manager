import styles from './SegmentedControl.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedControlProps<T extends string> {
  segments: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

/**
 * Tabs-as-buttons segmented control. Per STOCK_MANAGER_SPEC.md §5 the active
 * segment uses `--nw-wine` (not the generic `--nw-accent`) so the "colección
 * de reserva" screen reads as a distinct, branded moment inside an otherwise
 * neutral operative UI. Collapses to a horizontally scrollable chip row on
 * narrow viewports instead of wrapping.
 */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div className={styles.wrap} role="tablist" aria-label={ariaLabel}>
      {segments.map((segment) => (
        <button
          key={segment.value}
          type="button"
          role="tab"
          aria-selected={segment.value === value}
          className={`${styles.segment} ${segment.value === value ? styles.active : ''}`}
          onClick={() => onChange(segment.value)}
        >
          {segment.label}
          {typeof segment.count === 'number' ? (
            <span className={styles.count}>{segment.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
