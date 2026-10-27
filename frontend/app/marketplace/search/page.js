import MarketplaceSearchClient from "./MarketplaceSearchClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Search SaaS Marketplace Platforms | DEZORYN",
  description: "Search and filter verified cloud SaaS applications across industry categories.",
  path: "/marketplace/search",
  robots: {
    index: false,
    follow: false,
  },
});

export default function MarketplaceSearchPage() {
  return <MarketplaceSearchClient />;
}
