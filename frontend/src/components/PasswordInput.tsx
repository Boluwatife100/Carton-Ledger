import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}

export default function PasswordInput({ id, value, onChange, autoComplete }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        className="input pr-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-mute hover:bg-milk-200"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
