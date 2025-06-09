import SectionWrapper from "../../components/SectionWrapper";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { from: 0, to: 10000, suffix: "+", label: "Happy Teachers" },
  { from: 0, to: 50000, suffix: "+", label: "Products Sold" },
  { from: 0, to: 1000000, suffix: "+", label: "Students Impacted" },
  { from: 0, to: 4.9, suffix: "/5", label: "Average Rating" },
];

export default function StatsSection() {
  return (
    <SectionWrapper variant="dark">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <AnimatedCounter
              from={stat.from}
              to={stat.to}
              suffix={stat.suffix}
            />
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
