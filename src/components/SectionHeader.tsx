interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({
  badge,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="text-center space-y-4 mb-12">
      {badge && (
        <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium w-fit mx-auto">
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
