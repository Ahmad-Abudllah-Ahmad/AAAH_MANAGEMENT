// Isolated chrome light/dark control. Calls existing toggleTheme(); does not
// touch canvas sheet-invert (darkMode / opentakeoff_dark).
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getTheme, toggleTheme, onThemeChange } from "../lib/theme.js";

export default function ThemeToggle({ className }) {
  const [theme, setTheme] = useState(getTheme);
  useEffect(() => onThemeChange(setTheme), []);
  const dark = theme === "dark";
  const cls = className || "canvas-circle-btn";
  const inToolbar = cls.includes("mode-circle-btn");
  if (!inToolbar) return null;
  return (
    <button
      type="button"
      className={cls}
      onClick={() => toggleTheme()}
      data-tip={dark ? "Light mode" : "Dark mode"}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
    >
      {dark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
    </button>
  );
}
