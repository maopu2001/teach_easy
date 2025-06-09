import SectionWrapper from "@/components/SectionWrapper";
import SectionHeader from "@/components/SectionHeader";
import { BookOpen, Users, Lightbulb } from "lucide-react";

export default function AboutValues() {
  return (
    <SectionWrapper variant="gray">
      <SectionHeader
        title="What Drives Us"
        description="The principles that guide everything we do"
      />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Quality First</h3>
          <p className="text-muted-foreground">
            Every resource is carefully crafted, reviewed, and tested to ensure
            it meets the highest educational standards.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Teacher-Centered</h3>
          <p className="text-muted-foreground">
            Our resources are created by teachers, for teachers, with practical
            classroom application as the top priority.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Innovation</h3>
          <p className="text-muted-foreground">
            We stay at the forefront of educational research and technology to
            bring you the most effective teaching methods.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
