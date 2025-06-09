import SectionWrapper from "@/components/SectionWrapper";

export default function AboutHero() {
  return (
    <SectionWrapper>
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          About <span className="text-primary">TeachEasy</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We&apos;re passionate about empowering educators with high-quality
          resources that make teaching more effective and learning more
          engaging.
        </p>
      </div>
    </SectionWrapper>
  );
}
