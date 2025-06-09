"use client";
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  from,
  to,
  duration = 2000,
  suffix = "",
  className = "text-2xl sm:text-3xl md:text-4xl font-bold text-primary",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${from}-${to}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [from, to]);

  useEffect(() => {
    if (!isVisible) return;

    const increment = (to - from) / (duration / 16);
    const timer = setInterval(() => {
      setCount((prevCount) => {
        const nextCount = prevCount + increment;
        if (nextCount >= to) {
          clearInterval(timer);
          return to;
        }
        return nextCount;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, from, to, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "k";
    }
    return Math.floor(num).toString();
  };

  return (
    <h3 id={`counter-${from}-${to}`} className={className}>
      {formatNumber(count)}
      {suffix}
    </h3>
  );
}
