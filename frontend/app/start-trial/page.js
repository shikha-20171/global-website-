import StartTrialClient from "./StartTrialClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Start Free 14-Day Enterprise Trial | DEZORYN",
  description: "Provision a private sandbox instance of DEZORYN cloud SaaS platforms.",
  path: "/start-trial",
  robots: {
    index: false,
    follow: false,
  },
});

export default function StartTrialPage() {
  return <StartTrialClient />;
}
