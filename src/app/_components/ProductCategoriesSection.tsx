import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SectionWrapper from "./shared/SectionWrapper";
import SectionHeader from "./shared/SectionHeader";

const categories = [
  {
    title: "Mathematics",
    desc: "Worksheets, manipulatives, and interactive math activities",
    category: "Mathematics",
  },
  {
    title: "Science",
    desc: "Lab equipment, experiments, and STEM learning materials",
    category: "Science",
  },
  {
    title: "Language Arts",
    desc: "Reading comprehension, writing tools, and literacy resources",
    category: "Language Arts",
  },
  {
    title: "Social Studies",
    desc: "History timelines, geography maps, and cultural studies",
    category: "Social Studies",
  },
];

export default function ProductCategoriesSection() {
  return (
    <SectionWrapper id="products" variant="gray">
      <SectionHeader
        title="Shop by Category"
        description="Find the perfect educational resources for your subject and grade level."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Card key={index} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="text-center space-y-4">
              <Image
                src="/95443.png"
                width={300}
                height={200}
                alt={category.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <CardTitle className="group-hover:text-primary dark:group-hover:text-red-400 transition-colors">
                {category.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {category.desc}
              </CardDescription>
              <Link href={`/products?category=${category.category}`}>
                <Button variant="outline" className="mt-4">
                  Shop {category.title}
                </Button>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
