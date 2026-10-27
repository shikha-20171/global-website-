/**
 * Procedural dashboard & technology artwork used as product/resource/project imagery.
 * Supports image passthrough with cinematic ambient overlay and 7 distinct procedural tech visuals.
 */
export default function ProductArt({
  hue = 215,
  className = "",
  variant = 0,
  compact = false,
  image = null,
  title = "",
}) {
  if (image) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border border-white/10 bg-[#0a0f1b] ${className}`}
      >
        <img
          src={image}
          alt={title || "DEZORYN Technology Artwork"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040a1a]/95 via-[#040a1a]/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,107,255,0.18),transparent_60%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    );
  }

  const primary = `hsl(${hue} 90% 60%)`;
  const secondary = `hsl(${(hue + 45) % 360} 85% 65%)`;
  const v = Math.abs(variant) % 7;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/10 bg-[#070b16] ${className}`}
      style={{
        background: `radial-gradient(130% 100% at 85% 10%, hsl(${hue} 80% 28% / 0.4), transparent 65%), #060a16`,
      }}
      aria-hidden="true"
    >
      {/* Visual variant 0: Distributed Systems Node Network */}
      {v === 0 && (
        <div className="relative flex h-full w-full items-center justify-center p-4">
          <svg className="h-full w-full max-h-40" viewBox="0 0 240 120" fill="none">
            {/* Connecting lines */}
            <path d="M 40 60 L 90 30 L 150 40 L 200 60 L 150 90 L 90 80 Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 90 30 L 150 90 M 90 80 L 150 40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="40" y1="60" x2="120" y2="60" stroke={primary} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="120" y1="60" x2="200" y2="60" stroke={secondary} strokeWidth="1.5" strokeOpacity="0.5" />
            {/* Nodes */}
            <circle cx="40" cy="60" r="8" fill="#040a1a" stroke={primary} strokeWidth="2" />
            <circle cx="90" cy="30" r="6" fill="#040a1a" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <circle cx="90" cy="80" r="6" fill="#040a1a" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <circle cx="120" cy="60" r="14" fill="#070e24" stroke={primary} strokeWidth="2.5" />
            <circle cx="120" cy="60" r="5" fill={primary} className="animate-pulse" />
            <circle cx="150" cy="40" r="6" fill="#040a1a" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <circle cx="150" cy="90" r="6" fill="#040a1a" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <circle cx="200" cy="60" r="8" fill="#040a1a" stroke={secondary} strokeWidth="2" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cool/70 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mesh Active · 100% Synced
          </div>
        </div>
      )}

      {/* Visual variant 1: AI Neural Flow & Synaptic Core */}
      {v === 1 && (
        <div className="relative flex h-full w-full items-center justify-center p-4">
          <svg className="h-full w-full max-h-40" viewBox="0 0 240 120" fill="none">
            <circle cx="120" cy="60" r="44" stroke={primary} strokeWidth="1" strokeDasharray="4 6" opacity="0.3" className="animate-spin-slow origin-center" />
            <circle cx="120" cy="60" r="30" stroke={secondary} strokeWidth="1.5" opacity="0.4" />
            <circle cx="120" cy="60" r="16" fill="hsl(260 70% 20% / 0.8)" stroke={primary} strokeWidth="2" />
            <circle cx="120" cy="60" r="7" fill={secondary} />
            {/* Synaptic satellites */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = 120 + Math.cos(rad) * 44;
              const y = 60 + Math.sin(rad) * 44;
              return (
                <g key={i}>
                  <line x1="120" y1="60" x2={x} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <circle cx={x} cy={y} r="3.5" fill="#040a1a" stroke={i % 2 === 0 ? primary : secondary} strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cool/70 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Neural Engine Inference
          </div>
        </div>
      )}

      {/* Visual variant 2: Code Terminal / OpenAPI Inspector */}
      {v === 2 && (
        <div className="flex h-full w-full flex-col justify-between p-3.5 font-mono text-[10px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500/80" />
              <span className="h-2 w-2 rounded-full bg-amber-500/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-cool/60 text-[9px]">v1/gateway.ts</span>
            </div>
            <span className="rounded bg-electric/20 px-1.5 py-0.5 text-[9px] text-[#9db8ff]">REST 200 OK</span>
          </div>
          <div className="space-y-1.5 py-2 text-cool/90 leading-relaxed">
            <div><span className="text-violet-400">async function</span> <span className="text-electric">routeTenant</span>(req) &#123;</div>
            <div className="pl-3"><span className="text-cool/60">const</span> token = <span className="text-emerald-400">verifyBearer</span>(req);</div>
            <div className="pl-3"><span className="text-cool/60">await</span> shard.<span className="text-amber-300">isolateContext</span>(token);</div>
            <div>&#125;</div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-cool/50 border-t border-white/5 pt-1.5">
            <span>Latency: 14ms</span>
            <span className="text-emerald-400">Zero-Leak Guarded</span>
          </div>
        </div>
      )}

      {/* Visual variant 3: Telemetry Spline Waveform */}
      {v === 3 && (
        <div className="relative flex h-full w-full flex-col justify-between p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cool/70">Real-Time Throughput</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">+48.2%</span>
          </div>
          <div className="my-auto">
            <svg className="w-full h-20" viewBox="0 0 240 80" fill="none">
              <defs>
                <linearGradient id={`grad-${hue}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primary} stopOpacity="0.45" />
                  <stop offset="100%" stopColor={secondary} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 65 Q 40 70 60 45 T 120 35 T 180 15 T 240 25 L 240 80 L 0 80 Z"
                fill={`url(#grad-${hue})`}
              />
              <path
                d="M 0 65 Q 40 70 60 45 T 120 35 T 180 15 T 240 25"
                stroke={primary}
                strokeWidth="2.5"
                fill="none"
              />
              <circle cx="180" cy="15" r="4" fill="#fff" stroke={primary} strokeWidth="2" className="animate-pulse" />
            </svg>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-cool/50">
            <span>P99: 18.4ms</span>
            <span>Uptime: 99.99%</span>
          </div>
        </div>
      )}

      {/* Visual variant 4: Cybersecurity Shield & Key Vault */}
      {v === 4 && (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <svg className="h-full w-full max-h-36" viewBox="0 0 200 120" fill="none">
            {/* Outer shield boundary */}
            <path
              d="M 100 15 L 145 32 C 145 75, 120 100, 100 110 C 80 100, 55 75, 55 32 Z"
              fill="hsl(215 80% 12% / 0.6)"
              stroke={primary}
              strokeWidth="2"
            />
            {/* Inner shield */}
            <path
              d="M 100 25 L 135 38 C 135 70, 115 90, 100 98 C 85 90, 65 70, 65 38 Z"
              stroke={secondary}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            {/* Lock / Vault Icon */}
            <circle cx="100" cy="55" r="10" stroke="#fff" strokeWidth="2" fill="none" />
            <rect x="91" y="55" width="18" height="18" rx="3" fill={primary} />
            <circle cx="100" cy="64" r="2" fill="#040a1a" />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cool/70 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Zero-Trust Vault · TLS 1.3
          </div>
        </div>
      )}

      {/* Visual variant 5: Multi-Tenant Database Shards */}
      {v === 5 && (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <div className="flex items-center gap-4">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="h-14 w-12 rounded-lg border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.02] p-1.5 flex flex-col justify-between"
                  style={{
                    borderColor: idx === 1 ? primary : "rgba(255,255,255,0.15)",
                    boxShadow: idx === 1 ? `0 0 16px -4px ${primary}` : "none",
                  }}
                >
                  <div className="h-1.5 w-full rounded bg-white/20" />
                  <div className="space-y-1">
                    <div className="h-1 w-3/4 rounded bg-white/10" />
                    <div className="h-1 w-full rounded bg-white/10" />
                  </div>
                  <div
                    className="h-2 w-full rounded text-[8px] font-mono flex items-center justify-center text-white"
                    style={{ background: idx === 1 ? primary : "rgba(255,255,255,0.15)" }}
                  >
                    T{idx + 1}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-cool/60">Shard 0{idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 right-3 text-[9px] font-mono text-emerald-400">
            Partition: Isolated
          </div>
        </div>
      )}

      {/* Visual variant 6: Balanced Metric Equalizer Bars */}
      {v === 6 && (
        <div className="flex h-full w-full flex-col justify-between p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-cool/70">
            <span>Core Telemetry</span>
            <span className="text-electric">Balanced</span>
          </div>
          <div className="flex items-end gap-2 h-20 pt-2">
            {[45, 75, 52, 90, 68, 84, 96, 60].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end h-full">
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, ${primary}, ${secondary})`,
                    opacity: 0.4 + (i % 3) * 0.25,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono text-cool/50 border-t border-white/5 pt-1.5">
            <span>Cluster CPU: 38%</span>
            <span>RAM: 4.2 GB</span>
          </div>
        </div>
      )}
    </div>
  );
}
