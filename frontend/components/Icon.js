import { GraduationCap, Building2, Home, HeartPulse, Factory, ShoppingBag, Landmark, ConciergeBell, Truck, Briefcase, Cloud, Sparkles, Smartphone, Globe2, Layers, Zap, ShieldCheck, Target, Eye, Gem, Circle } from "lucide-react";

// Explicit map keeps the bundle small (no full-library import). Add icons here as needed.
const MAP = { GraduationCap, Building2, Home, HeartPulse, Factory, ShoppingBag, Landmark, ConciergeBell, Truck, Briefcase, Cloud, Sparkles, Smartphone, Globe2, Layers, Zap, ShieldCheck, Target, Eye, Gem };

export default function Icon({ name, ...props }) {
  const C = MAP[name] || Circle;
  return <C aria-hidden="true" {...props} />;
}
