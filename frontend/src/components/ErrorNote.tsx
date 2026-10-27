export default function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex items-center justify-between gap-4 border-stamp-500/30 bg-stamp-50 p-4 text-sm text-stamp-600">
      <span>{message}</span>
      {onRetry && (
        <button className="btn-ghost shrink-0" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
