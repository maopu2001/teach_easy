import { CheckCircle } from "lucide-react";
import Link from "next/link";
import EmailSignup from "./EmailSignup";
import SectionWrapper from "../../components/SectionWrapper";
import SectionHeader from "../../components/SectionHeader";

export default function CTASection() {
  return (
    <SectionWrapper variant="white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <SectionHeader
          title="Ready to Transform Your Teaching?"
          description="Join thousands of educators who trust Teach Easy for their classroom needs."
        />
        <div className="max-w-md mx-auto space-y-4">
          <EmailSignup />
          <p className="text-xs text-muted-foreground">
            Get exclusive access to new resources and special offers.{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Free resources included</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Expert support</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
