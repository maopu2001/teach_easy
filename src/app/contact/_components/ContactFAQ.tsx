import SectionWrapper from "@/components/SectionWrapper";
import SectionHeader from "@/components/SectionHeader";

export default function ContactFAQ() {
  return (
    <SectionWrapper>
      <SectionHeader
        title="Frequently Asked Questions"
        description="Quick answers to common questions"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">
            How quickly will I receive my digital resources?
          </h3>
          <p className="text-muted-foreground">
            Digital resources are available for immediate download after
            purchase. You&apos;ll receive an email with download links within
            minutes of completing your order.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">
            Do you offer bulk discounts for schools?
          </h3>
          <p className="text-muted-foreground">
            Yes! We offer special pricing for schools and districts. Contact our
            sales team at sales@teacheasy.com for a custom quote based on your
            needs.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">
            Can I request custom educational content?
          </h3>
          <p className="text-muted-foreground">
            Absolutely! We offer custom content creation services. Reach out to
            discuss your specific curriculum needs and we&apos;ll provide a
            proposal for custom materials.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">
            What grades and subjects do you cover?
          </h3>
          <p className="text-muted-foreground">
            We create content for K-12 across all major subjects including Math,
            Science, English Language Arts, Social Studies, and more. Browse our
            products page to see our full catalog.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
