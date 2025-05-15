"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

const ThemeChanger = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleClick = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button
      onClick={handleClick}
      className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 size-8 p-0 rounded-full cursor-pointer"
    >
      {theme === "light" ? <Sun id="sun" /> : <Moon id="moon" />}
    </Button>
  );
};

export default ThemeChanger;
