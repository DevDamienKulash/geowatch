

export default function StatusBadge({ loading, error }: { loading: boolean; error?: string | null }) {
  return (
    <div className="status-badge" aria-live="polite">
      <span className={`dot ${error ? 'dot--err' : loading ? '' : 'dot--ok'}`} />
      {error ? `Error: ${error}` : loading ? 'Loading incidents…' : 'Live USGS feed'}
    </div>
  );
}
