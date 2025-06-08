"use client";
import { useEffect, useState } from "react";

const useTheme = (initialValue?: string) => {
  const [theme, setTheme] = useState(initialValue || "light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
    // else {
    //   if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    //     setTheme("dark");
    // }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const changeTheme = () => {
    setTheme((p) => (p === "light" ? "dark" : "light"));
  };

  return [theme, changeTheme] as const;
};
export default useTheme;
