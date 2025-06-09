import { RotateCcw, Shield, Clock, DollarSign } from "lucide-react";
import SectionWrapper from "../../components/SectionWrapper";
import SectionHeader from "../../components/SectionHeader";

export default function ReturnsPage() {
  return (
    <SectionWrapper>
      <SectionHeader
        title="Returns & Exchanges"
        description="We want you to be completely satisfied with your purchase"
      />

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">30-Day Guarantee</h3>
            </div>
            <p className="text-muted-foreground">
              We offer a 30-day money-back guarantee on all purchases. If
              you&apos;re not satisfied, we&apos;ll make it right.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Easy Returns</h3>
            </div>
            <p className="text-muted-foreground">
              Return process is simple and hassle-free. Just contact us and
              we&apos;ll guide you through the process.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Quick Processing</h3>
            </div>
            <p className="text-muted-foreground">
              Refunds are processed within 3-5 business days after we receive
              your returned item.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Free Return Shipping</h3>
            </div>
            <p className="text-muted-foreground">
              We provide prepaid return labels for all eligible returns within
              the United States.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">Return Policy</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We accept returns within 30 days of purchase for a full refund or
              exchange. Items must be in their original condition and packaging.
            </p>
            <h4 className="font-semibold mb-2">Eligible for Return:</h4>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
              <li>Unused items in original packaging</li>
              <li>Items with all original tags and labels</li>
              <li>Books and materials in pristine condition</li>
              <li>Digital downloads within 7 days (if not accessed)</li>
            </ul>
            <h4 className="font-semibold mb-2">Not Eligible for Return:</h4>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Digital products that have been downloaded or accessed</li>
              <li>Personalized or customized items</li>
              <li>Items damaged by misuse or normal wear</li>
              <li>Returns requested after 30 days</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              How to Return an Item
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Step 1: Contact Us</h4>
                <p className="text-muted-foreground">
                  Email us at returns@teacheasy.com or call 1-800-TEACH-EASY
                  with your order number and reason for return.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">
                  Step 2: Receive Return Authorization
                </h4>
                <p className="text-muted-foreground">
                  We&apos;ll provide you with a Return Merchandise Authorization
                  (RMA) number and prepaid shipping label.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Step 3: Package and Ship</h4>
                <p className="text-muted-foreground">
                  Pack the item securely in its original packaging, attach the
                  return label, and drop off at any authorized shipping
                  location.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-2">Step 4: Receive Refund</h4>
                <p className="text-muted-foreground">
                  Once we receive and inspect your return, we&apos;ll process
                  your refund within 3-5 business days.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Exchanges</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We&apos;re happy to exchange items for a different size, color, or
              product of equal value. Follow the same return process and specify
              that you&apos;d like an exchange instead of a refund.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If the exchange item costs more than the original, you&apos;ll
              need to pay the difference. If it costs less, we&apos;ll refund
              the difference.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Damaged or Defective Items
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you receive a damaged or defective item, please contact us
              immediately. We&apos;ll provide a replacement or full refund at no
              cost to you.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Please include photos of the damaged item when contacting us to
              help expedite the process.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Refund Methods</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Refunds will be issued to the original payment method:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Credit/Debit Cards: 3-5 business days</li>
              <li>PayPal: 1-2 business days</li>
              <li>Bank Transfer: 5-7 business days</li>
              <li>Store Credit: Immediately available</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              International Returns
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              International customers are responsible for return shipping costs
              unless the item was damaged or defective. Please contact us before
              returning any international orders to ensure proper processing.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Questions?</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our return policy or need
              assistance with a return, please contact our customer service team
              at returns@teacheasy.com or call 1-800-TEACH-EASY. We&apos;re here
              to help!
            </p>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
}
