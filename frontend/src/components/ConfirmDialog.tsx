import { Loader2 } from "lucide-react";
import Modal from "./Modal";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel, busy, onConfirm, onClose }: Props) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-ink-soft">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose} disabled={busy}>
          Keep it
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
