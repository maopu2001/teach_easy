import SectionWrapper from "@/components/SectionWrapper";
import SectionHeader from "@/components/SectionHeader";
import { Target, Heart } from "lucide-react";
import Image from "next/image";
import getPublicUrl from "@/lib/getPublicUrl";

export default function AboutMission() {
  return (
    <SectionWrapper variant="gray">
      <SectionHeader
        title="Our Mission"
        description="Transforming education through innovative resources and tools"
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Our Purpose</h3>
              <p className="text-muted-foreground leading-relaxed">
                To bridge the gap between innovative educational content and
                classroom implementation, making quality teaching resources
                accessible to educators worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Our Values</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe in the power of education to transform lives and
                communities. Every resource we create is designed with care,
                expertise, and the student&apos;s success in mind.
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Image
            src={getPublicUrl("/95443.png")}
            width={500}
            height={400}
            alt="Educational mission"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
