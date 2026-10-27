import LoginClient from "./LoginClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign In — Enterprise SaaS Workspace | DEZORYN",
  description: "Secure login for DEZORYN SaaS platforms and customer portals.",
  path: "/login",
  robots: {
    index: false,
    follow: false,
  },
});

export default function LoginPage() {
  return <LoginClient />;
}
