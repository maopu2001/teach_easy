import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import SectionWrapper from "../../components/SectionWrapper";
import SectionHeader from "../../components/SectionHeader";

const testimonials = [
  {
    quote:
      "The lesson plans from Teach Easy have transformed my classroom. My students are more engaged than ever, and I save hours of prep time each week.",
    name: "Sarah Johnson",
    role: "3rd Grade Teacher",
  },
  {
    quote:
      "Outstanding quality and variety. The science experiments are particularly well-designed and my students love the hands-on activities.",
    name: "Michael Chen",
    role: "High School Science",
  },
  {
    quote:
      "As a new teacher, Teach Easy has been a lifesaver. The resources are professional, curriculum-aligned, and actually work in the classroom.",
    name: "Emily Rodriguez",
    role: "1st Grade Teacher",
  },
];

export default function TestimonialsSection() {
  return (
    <SectionWrapper id="testimonials" variant="white">
      <SectionHeader
        title="Loved by Educators Everywhere"
        description="See what teachers are saying about Teach Easy resources."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader className="space-y-4">
              <div className="flex justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <CardDescription>&quot;{testimonial.quote}&quot;</CardDescription>
              <div className="flex items-center gap-3">
                <Image
                  src="/95443.png"
                  width={40}
                  height={40}
                  alt="Teacher"
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
