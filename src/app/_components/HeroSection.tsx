import { Button } from "@/components/ui/button";
import getPublicUrl from "@/lib/getPublicUrl";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="px-4 py-8 lg:py-24">
      <div className="container max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="bg-primary/20 text-primary w-fit mx-auto lg:mx-0 px-3 py-1 rounded-full text-sm font-medium">
              Trusted by 10,000+ Educators
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Make Teaching{" "}
              <span className="text-primary dark:text-primary-70">Easy</span>{" "}
              with Quality Educational Resources
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto lg:mx-0">
              Discover thousands of high-quality educational materials, lesson
              plans, and teaching tools designed to engage students and simplify
              your classroom preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/70 text-white"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9/5 rating</span>
              </div>
              <span className="hidden sm:block">•</span>
              <span>Free shipping over $50</span>
              <span className="hidden sm:block">•</span>
              <span>30-day guarantee</span>
            </div>
          </div>
          <HeroImage />
        </div>
      </div>
    </section>
  );
}

const HeroImage = () => (
  <div className="hidden lg:flex justify-center">
    <Image
      src={getPublicUrl("/95443.png")}
      width={600}
      height={400}
      alt="Educational materials"
      className="w-full max-w-lg rounded-xl shadow-2xl"
    />
  </div>
);
