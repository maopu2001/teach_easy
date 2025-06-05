"use client";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import React from "react";

const ThemeChanger = () => {
  const [theme, changeTheme] = useTheme();

  const handleClick = () => changeTheme();

  return (
    <Button
      onClick={handleClick}
      className="size-8 p-0 rounded-full cursor-pointer"
    >
      {theme === "light" ? <Sun id="sun" /> : <Moon id="moon" />}
    </Button>
  );
};

export default ThemeChanger;
