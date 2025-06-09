import SectionHeader from "../../components/SectionHeader";
import SectionWrapper from "../../components/SectionWrapper";

export default function PrivacyPolicyPage() {
  return (
    <SectionWrapper>
      <SectionHeader
        title="Privacy Policy"
        description="We respect your privacy and are committed to protecting your personal data"
      />

      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">
              1. Information We Collect
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect information you provide directly to us, such as when
              you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Create or modify your account</li>
              <li>Request customer support</li>
              <li>Purchase products or services</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in surveys or promotions</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              2. How We Use Your Information
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              3. Information Sharing
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy. We may share your information with
              trusted third parties who assist us in operating our website and
              conducting our business.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">4. Data Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              5. Cookies and Tracking
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity
              on our service and hold certain information. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">6. Your Rights</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify or update your personal data</li>
              <li>Delete your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              7. Children&apos;s Privacy
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our service does not address anyone under the age of 13. We do not
              knowingly collect personally identifiable information from
              children under 13.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              8. Changes to Privacy Policy
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;effective date.&quot;
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">9. Contact Us</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at privacy@teacheasy.com or by mail at our address.
            </p>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
}
