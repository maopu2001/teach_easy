interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  variant?: "white" | "gray" | "dark";
}

const variantClasses = {
  white: "bg-background",
  gray: "bg-muted/30",
  dark: "bg-foreground text-background dark:bg-background dark:text-foreground",
};

export default function SectionWrapper({
  children,
  id,
  variant = "white",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`px-4 py-16 lg:py-24 ${variantClasses[variant]}`}
    >
      <div className="container max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
