"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Product } from "./ProductClientWrapper";


export default function ProductTabs({
  product,
  keyFeatures,
}: {
  product: Product;
  keyFeatures: string[];
}) {
  return (
    <div className="mt-12">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full h-12 bg-muted border rounded-lg p-1">
          <TabsTrigger
            value="description"
            className="flex-1 h-10 text-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="materials"
            className="flex-1 h-10 text-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Materials
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 h-10 text-lg font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="bg-card border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Product Description</h3>
            <p className="mb-6 text-lg text-foreground">
              {product.description}
            </p>
            <div>
              <h4 className="font-bold mb-2">What&apos;s Included:</h4>
              <ul className="space-y-2">
                {keyFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-green-600 dark:text-green-400 text-lg"
                  >
                    <span>✓</span> <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <div className="bg-card border rounded-xl p-8 text-lg text-muted-foreground">
            <p>Materials information coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="bg-card border rounded-xl p-8 text-lg text-muted-foreground">
            <p>Reviews coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
