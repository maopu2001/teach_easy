import SectionHeader from "../_components/shared/SectionHeader";
import SectionWrapper from "../_components/shared/SectionWrapper";

export default function TermsOfServicePage() {
  return (
    <SectionWrapper>
      <SectionHeader
        title="Terms of Service"
        description="Please read these terms and conditions carefully before using our service"
      />

      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">
              1. Acceptance of Terms
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using TeachEasy&apos;s website and services, you
              accept and agree to be bound by the terms and provision of this
              agreement. These Terms of Service apply to all visitors, users,
              and others who access or use the service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              2. Description of Service
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              TeachEasy provides educational resources, lesson plans, and
              teaching materials for educators. Our platform offers both free
              and premium content designed to enhance classroom instruction and
              student engagement.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">3. User Accounts</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. You are
              responsible for safeguarding the password and for all activities
              that occur under your account.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              4. Intellectual Property Rights
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              The service and its original content, features, and functionality
              are and will remain the exclusive property of TeachEasy and its
              licensors. The service is protected by copyright, trademark, and
              other laws.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">5. User Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our service may allow you to post, link, store, share and
              otherwise make available certain information, text, graphics,
              videos, or other material. You are responsible for the content
              that you post to the service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">6. Prohibited Uses</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                For any unlawful purpose or to solicit others to perform
                unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li>To submit false or misleading information</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">7. Termination</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">8. Changes to Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              9. Contact Information
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us at legal@teacheasy.com.
            </p>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
}
