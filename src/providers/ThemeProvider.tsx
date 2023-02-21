import React from "react";

export const ColorThemeContext = React.createContext<{
  themeType: "dark" | "light";
  toggleTheme: () => void;
  isMobile: boolean;
}>({
  themeType: "dark",
  toggleTheme: () => {},
  isMobile: document.documentElement.clientWidth <= 768,
});
