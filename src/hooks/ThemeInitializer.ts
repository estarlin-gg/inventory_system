import { useEffect } from "react";
import { useThemeMode } from "flowbite-react";

export const ThemeInitializer = () => {
  const { computedMode } = useThemeMode();

  useEffect(() => {
    const root = document.documentElement;
    if (computedMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [computedMode]);

  return null; 
};
