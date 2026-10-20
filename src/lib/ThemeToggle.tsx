import { Moon, Sun } from "lucide-react";
export interface ThemeToggleProps {
  dark: boolean;
  onChange: (dark: boolean) => void;
  disabled?: boolean;
}
/** A single action for the next appearance; system preference belongs in full settings. */
export function ThemeToggle({ dark, onChange, disabled }: ThemeToggleProps) {
  const label = dark ? "切换为浅色" : "切换为深色";
  return <button type="button" className="fp-theme-toggle" aria-label={label} title={label} disabled={disabled} onClick={() => onChange(!dark)}>
    {dark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
  </button>;
}
