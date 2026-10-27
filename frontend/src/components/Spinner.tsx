import { Loader2 } from "lucide-react";

export default function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-mute" role="status">
      <Loader2 size={18} className="animate-spin" />
      {label}
    </div>
  );
}
