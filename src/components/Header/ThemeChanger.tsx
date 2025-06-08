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
        className="flex bg-accent items-center gap-2 w-fit px-3 py-2 text-base font-medium text-foreground rounded-md transition-colors"
        onClick={changeTheme}
      >
        <span className="">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
        <span>{theme === "dark" ? <Sun id="sun" /> : <Moon id="moon" />}</span>
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
