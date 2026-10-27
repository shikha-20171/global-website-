import "./globals.css";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  metadataBase: new URL("https://admin.dezoryn.com"),
  title: {
    template: "%s | DEZORYN Admin Console",
    default: "DEZORYN TECHNOLOGY — Control Plane & Operations",
  },
  description: "Enterprise CMS, SaaS Marketplace, and Platform Operations Console for DEZORYN TECHNOLOGY.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const viewport = {
  themeColor: "#020510",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootAdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
