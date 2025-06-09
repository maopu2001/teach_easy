import SectionWrapper from "@/components/SectionWrapper";
import SectionHeader from "@/components/SectionHeader";

export default function AboutTeam() {
  return (
    <SectionWrapper>
      <SectionHeader
        title="Meet Our Team"
        description="Passionate educators and innovators working to support your success"
      />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
          <div>
            <h3 className="text-lg font-semibold">Sarah Johnson</h3>
            <p className="text-primary font-medium">Founder & CEO</p>
            <p className="text-sm text-muted-foreground mt-2">
              Former high school teacher with 15 years of classroom experience.
              Passionate about making quality education accessible to all.
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
          <div>
            <h3 className="text-lg font-semibold">Michael Chen</h3>
            <p className="text-primary font-medium">Head of Content</p>
            <p className="text-sm text-muted-foreground mt-2">
              Curriculum specialist with expertise in STEM education and
              innovative teaching methodologies.
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
          <div>
            <h3 className="text-lg font-semibold">Dr. Emily Rodriguez</h3>
            <p className="text-primary font-medium">
              Educational Research Director
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Ph.D. in Educational Psychology, ensuring all our resources are
              grounded in the latest research.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
