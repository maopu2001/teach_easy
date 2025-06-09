import SectionWrapper from "@/components/SectionWrapper";

export default function ContactHero() {
  return (
    <SectionWrapper>
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Have questions about our educational resources? Need help with your
          order? We&apos;re here to help and would love to hear from you.
        </p>
      </div>
    </SectionWrapper>
  );
}
