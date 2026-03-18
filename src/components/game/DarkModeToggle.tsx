import { Moon, Sun } from "lucide-react";

interface DarkModeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

const DarkModeToggle = ({ dark, onToggle }: DarkModeToggleProps) => (
  <button
    onClick={onToggle}
    aria-label="Toggle dark mode"
    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
  >
    {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);

export default DarkModeToggle;
