import SectionWrapper from "@/components/SectionWrapper";
import SectionHeader from "@/components/SectionHeader";

export default function AboutImpact() {
  return (
    <SectionWrapper variant="gray">
      <SectionHeader
        title="Our Impact"
        description="Making a difference in classrooms around the world"
      />

      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">10,000+</div>
          <p className="text-muted-foreground">Educators Served</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">500,000+</div>
          <p className="text-muted-foreground">Students Reached</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">2,500+</div>
          <p className="text-muted-foreground">Resources Created</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">45+</div>
          <p className="text-muted-foreground">Countries</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
