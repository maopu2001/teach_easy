import SectionWrapper from "@/components/SectionWrapper";
import SectionHeader from "@/components/SectionHeader";

export default function AboutStory() {
  return (
    <SectionWrapper>
      <SectionHeader
        title="Our Story"
        description="From classroom challenges to educational solutions"
      />

      <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          TeachEasy was founded in 2018 by a team of experienced educators who
          recognized the daily challenges teachers face in finding and creating
          quality educational materials. After years of spending countless hours
          searching for resources that truly engage students, we decided to
          create a solution.
        </p>
        <p>
          What started as a small collection of lesson plans shared among
          colleagues has grown into a comprehensive platform serving over 10,000
          educators worldwide. Our team combines decades of classroom experience
          with cutting-edge educational research to create resources that work
          in real classrooms.
        </p>
        <p>
          Today, we continue to be guided by our original mission: making
          teaching easier and learning more effective through thoughtfully
          designed educational resources.
        </p>
      </div>
    </SectionWrapper>
  );
}
