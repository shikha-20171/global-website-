"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import CTASection from "@/components/CTASection";
import Button from "@/components/Button";
import api from "@/lib/axios";
import { Code2, Terminal, Copy, Check, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export default function ApiDeveloperPage() {
  const [lang, setLang] = useState("bash");
  const [copied, setCopied] = useState(false);
  const [endpoints, setEndpoints] = useState([
    { method: "GET", path: "/v1/workspaces/:id", desc: "Retrieve active workspace details and operational telemetry", scope: "workspace:read" },
    { method: "POST", path: "/v1/auth/tokens", desc: "Issue scoped bearer JWT tokens using client credentials", scope: "Public" },
    { method: "GET", path: "/v1/ledgers/invoices", desc: "Query student tuition dues or monthly society maintenance ledger", scope: "ledgers:read" },
    { method: "PUT", path: "/v1/webhooks/subscriptions", desc: "Register or update webhook callback URLs with secret signing keys", scope: "webhooks:write" },
  ]);

  useEffect(() => {
    let active = true;
    // Direct Axios API call inside ApiClient
    api.get("/api/v1/resources/api-specs")
      .then((response) => {
        if (!active) return;
        const res = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        const list = Array.isArray(res) ? res : res?.data || [];
        if (list.length > 0) {
          const mapped = list.map((item) => ({
            method: item.method || "GET",
            path: item.endpoint?.replace("https://api.dezoryn.com", "") || item.endpoint || "/v1/resource",
            desc: item.description || item.title,
            scope: item.authType || "Bearer JWT",
          }));
          setEndpoints(mapped);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const codeSnippets = {
    bash: `curl -X POST https://api.dezoryn.cloud/v1/auth/tokens \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "dz_live_849204192",
    "client_secret": "sec_098234098234098",
    "scope": "workspace:read students:manage ledgers:read"
  }'`,
    javascript: `import { DezorynClient } from "@dezoryn/sdk";

const client = new DezorynClient({
  apiKey: process.env.DEZORYN_API_KEY,
  environment: "production"
});

// Fetch active multi-tenant workspace telemetry
const workspace = await client.workspaces.get("ws_academy_global");
console.log("Active users:", workspace.activeSessions);`,
    python: `from dezoryn import Dezoryn

client = Dezoryn(
    api_key="dz_live_849204192",
    timeout=10.0
)

# Stream real-time student attendance telemetry
events = client.telemetry.list_events(limit=50)
for event in events:
    print(f"Timestamp: {event.timestamp} | Status: {event.status}")`,
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(codeSnippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 border-b border-line">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[500px] rounded-full bg-electric/15 blur-[120px]" />

        <div className="container-x relative">
          <Breadcrumb
            items={[
              { label: "Resources", href: "/resources" },
              { label: "API & Developer Hub" },
            ]}
          />

          <div className="max-w-5xl mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3.5 py-1 text-xs font-mono text-electric mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              <span>DEVELOPER PORTAL &amp; REST APIS</span>
            </div>

            <h1 className="h-display text-4xl sm:text-6xl text-white">
              DEZORYN Developer API
            </h1>

            <p className="lead mt-4 text-base sm:text-lg text-cool leading-relaxed">
              Programmatic RESTful APIs, Webhook events, and client SDKs designed for building high-scale integrations into DEZORYN platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Code Interactive Playground */}
      <section className="section bg-midnight/40 border-b border-line">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-electric uppercase tracking-wider">
                Authentication &amp; SDKs
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Quickstart Integration
              </h2>
              <p className="text-xs sm:text-sm text-cool leading-relaxed">
                Connect your backend systems with TLS 1.3 encryption, scoped OAuth 2.0 tokens, and sub-50ms API responses.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-white">
                  <ShieldCheck size={16} className="text-electric" />
                  <span>Granular Bearer Token Scopes</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white">
                  <Zap size={16} className="text-electric" />
                  <span>Rate Limiting: 10,000 req/min per tenant</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white">
                  <Terminal size={16} className="text-electric" />
                  <span>Webhook Signatures via HMAC-SHA256</span>
                </div>
              </div>

              <div className="pt-4">
                <Button href="/start-trial" arrow>
                  Get Developer Sandbox Keys
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-white/10 bg-[#070b16] overflow-hidden shadow-2xl">
                {/* Code Tabs */}
                <div className="flex items-center justify-between border-b border-line bg-midnight/80 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {["bash", "javascript", "python"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`rounded px-2.5 py-1 text-xs font-mono transition ${
                          lang === l
                            ? "bg-electric/20 text-electric font-bold border border-electric/40"
                            : "text-cool hover:text-white"
                        }`}
                      >
                        {l === "bash" ? "cURL" : l === "javascript" ? "Node.js" : "Python"}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-mono text-cool hover:text-white transition"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Preformatted Code Block */}
                <div className="p-4 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed bg-[#04060d]">
                  <pre>
                    <code>{codeSnippets[lang]}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints Table */}
      <section className="section bg-midnight/20 border-b border-line">
        <div className="container-x">
          <div className="max-w-4xl mb-8">
            <span className="text-xs font-mono text-electric uppercase tracking-wider">
              Core Endpoints
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Standard RESTful Resource Routing
            </h2>
          </div>

          <div className="card overflow-hidden border-white/10 bg-[#070b16]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line bg-white/[0.02] text-cool font-mono">
                    <th className="p-4">Method</th>
                    <th className="p-4">Path</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Scope Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40 font-mono">
                  {endpoints.map((ep, idx) => {
                    const methodColor =
                      ep.method === "POST"
                        ? "text-blue-400"
                        : ep.method === "PUT" || ep.method === "PATCH"
                        ? "text-amber-400"
                        : ep.method === "DELETE"
                        ? "text-rose-400"
                        : "text-emerald-400";
                    return (
                      <tr key={idx}>
                        <td className={`p-4 font-bold ${methodColor}`}>{ep.method}</td>
                        <td className="p-4 text-white">{ep.path}</td>
                        <td className="p-4 text-cool font-sans">{ep.desc}</td>
                        <td className="p-4 text-electric">{ep.scope}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Build Against DEZORYN APIs?"
        text="Request developer sandbox credentials, download official client SDKs, or consult with our API integration specialists."
        primary={["Get Developer Sandbox Keys", "/start-trial"]}
        secondary={["Read Platform Documentation", "/resources/docs"]}
      />
    </>
  );
}
