import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "DEZORYN TECHNOLOGY — Enterprise SaaS & Cloud Platforms";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.1) 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "80px",
          color: "white",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #2f6bff 0%, #7c5cff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
            }}
          >
            <span style={{ fontSize: "40px", fontWeight: "900", color: "#ffffff" }}>D</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "0.08em" }}>
              DEZORYN
            </span>
            <span
              style={{
                fontSize: "15px",
                fontWeight: "600",
                letterSpacing: "0.3em",
                color: "#94a3b8",
              }}
            >
              TECHNOLOGY
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "1000px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              color: "#60a5fa",
              fontSize: "18px",
              fontWeight: "600",
              width: "fit-content",
            }}
          >
            Enterprise Cloud Architecture &amp; AI Automation
          </div>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "900",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              background: "linear-gradient(to right, #ffffff, #cbd5e1)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
            }}
          >
            Intelligent Software Platforms Built for Scale.
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#94a3b8",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Multi-tenant SaaS, enterprise ERP, and automated intelligence engineering.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", color: "#cbd5e1", fontSize: "20px", fontWeight: "500" }}>
            <span>✓ Multi-Tenant SaaS</span>
            <span>✓ 99.99% Uptime</span>
            <span>✓ Enterprise Security</span>
          </div>
          <span style={{ fontSize: "22px", color: "#60a5fa", fontWeight: "600" }}>
            www.dezoryn.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
