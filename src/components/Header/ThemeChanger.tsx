"use client";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import React from "react";

interface ThemeChangerProps {
  variant?: "text";
}

const ThemeChanger = ({ variant }: ThemeChangerProps = {}) => {
  const [theme, changeTheme] = useTheme();

  if (variant === "text") {
    return (
      <Button
        variant="outline"
        className="flex bg-accent items-center gap-2 w-full px-3 py-2 text-base font-medium text-foreground rounded-md transition-colors"
        onClick={changeTheme}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
        {theme === "dark" ? <Sun id="sun" /> : <Moon id="moon" />}
      </Button>
    );
  }

  return (
    <Button
      onClick={changeTheme}
      className="size-8 p-0 rounded-full cursor-pointer"
    >
      {theme === "dark" ? <Sun id="sun" /> : <Moon id="moon" />}
    </Button>
  );
};

export default ThemeChanger;
