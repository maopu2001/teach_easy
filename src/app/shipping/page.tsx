import { Truck, Clock, MapPin, Package } from "lucide-react";
import SectionWrapper from "../_components/shared/SectionWrapper";
import SectionHeader from "../_components/shared/SectionHeader";

export default function ShippingInfoPage() {
  return (
    <SectionWrapper>
      <SectionHeader
        title="Shipping Information"
        description="Everything you need to know about our shipping policies and delivery options"
      />

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Free Shipping</h3>
            </div>
            <p className="text-muted-foreground">
              Enjoy free standard shipping on all orders over $50. Orders under
              $50 have a flat shipping rate of $5.99.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Processing Time</h3>
            </div>
            <p className="text-muted-foreground">
              Orders are typically processed within 1-2 business days.
              You&apos;ll receive a tracking number once your order ships.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Delivery Areas</h3>
            </div>
            <p className="text-muted-foreground">
              We ship to all 50 states in the US, Canada, and select
              international destinations. See full list below.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Packaging</h3>
            </div>
            <p className="text-muted-foreground">
              All products are carefully packaged to ensure they arrive in
              perfect condition. We use eco-friendly materials when possible.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">Shipping Options</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-3 text-left">
                      Shipping Method
                    </th>
                    <th className="border border-border p-3 text-left">
                      Delivery Time
                    </th>
                    <th className="border border-border p-3 text-left">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3">
                      Standard Shipping
                    </td>
                    <td className="border border-border p-3">
                      5-7 business days
                    </td>
                    <td className="border border-border p-3">
                      Free on orders $50+, otherwise $5.99
                    </td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border p-3">
                      Express Shipping
                    </td>
                    <td className="border border-border p-3">
                      2-3 business days
                    </td>
                    <td className="border border-border p-3">$12.99</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3">
                      Next Day Delivery
                    </td>
                    <td className="border border-border p-3">1 business day</td>
                    <td className="border border-border p-3">$24.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              International Shipping
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We ship to the following international destinations:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Canada - 7-10 business days, starting at $12.99</li>
              <li>United Kingdom - 10-14 business days, starting at $19.99</li>
              <li>Australia - 12-18 business days, starting at $24.99</li>
              <li>European Union - 10-16 business days, starting at $22.99</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              International customers are responsible for any customs duties,
              taxes, or fees imposed by their country.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Order Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Once your order ships, you&apos;ll receive a tracking number via
              email. You can track your package using this number on our website
              or the carrier&apos;s website. If you have any issues with
              tracking, please contact our customer service team.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">
              Shipping Restrictions
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Please note the following shipping restrictions:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>
                We do not ship to P.O. Boxes for express or next-day delivery
              </li>
              <li>Some remote areas may require additional delivery time</li>
              <li>Holiday seasons may extend delivery times</li>
              <li>Weather conditions may cause delays</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about shipping or need to make changes
              to your order, please contact us at shipping@teacheasy.com or call
              1-800-TEACH-EASY.
            </p>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
}
