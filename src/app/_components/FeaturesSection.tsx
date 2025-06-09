import { Lightbulb, Target, Users } from "lucide-react";
import SectionWrapper from "../../components/SectionWrapper";
import SectionHeader from "../../components/SectionHeader";
import FeatureCard from "../../components/FeatureCard";

const features = [
  {
    icon: Lightbulb,
    title: "Creative Lesson Plans",
    description:
      "Engaging, standards-aligned lesson plans that make learning fun and effective for all grade levels.",
  },
  {
    icon: Target,
    title: "Assessment Tools",
    description:
      "Comprehensive assessment materials including quizzes, rubrics, and progress tracking tools.",
  },
  {
    icon: Users,
    title: "Classroom Management",
    description:
      "Proven strategies and tools to create a positive, productive learning environment.",
  },
];

export default function FeaturesSection() {
  return (
    <SectionWrapper variant="white">
      <SectionHeader
        badge="Why Choose Teach Easy"
        title="Everything You Need to Teach Successfully"
        description="From lesson plans to interactive activities, we provide comprehensive educational resources that save you time and enhance student learning."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
