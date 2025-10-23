

type WindowHours = 1 | 6 | 24 | 72;
const OPTIONS: WindowHours[] = [1, 6, 24, 72];

export default function TimeFilter({
  value,
  onChange
}: {
  value: WindowHours;
  onChange: (v: WindowHours) => void;
}) {
  return (
    <div className="chip-group" role="toolbar" aria-label="Time window">
      {OPTIONS.map((h) => {
        const isActive = value === h;
        return (
          <button
            key={h}
            type="button"
            className={`chip ${isActive ? 'chip--active' : ''}`}
            onClick={() => onChange(h)}
            aria-pressed={isActive}
            title={`Show incidents from the last ${h} hours`}
          >
            Last {h}h
          </button>
        );
      })}
    </div>
  );
}
