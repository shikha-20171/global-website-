export default function manifest() {
  return {
    name: "DEZORYN TECHNOLOGY — Enterprise SaaS & Cloud Platforms",
    short_name: "DEZORYN",
    description:
      "Enterprise SaaS platforms, multi-tenant cloud software, and AI automation systems built for business scalability worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
