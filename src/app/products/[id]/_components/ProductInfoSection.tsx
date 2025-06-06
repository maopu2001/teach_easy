import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function ProductInfoSection() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Easy return policy",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      iconColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "100% protected",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className={`group relative overflow-hidden rounded-xl border ${feature.borderColor} ${feature.bgColor} p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3">
              <div
                className={`flex-shrink-0 p-2 rounded-lg ${feature.bgColor} border ${feature.borderColor}`}
              >
                <Icon
                  className={`w-5 h-5 ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        );
      })}
    </div>
  );
}
