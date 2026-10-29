"use client";
import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Heading from "./Heading";
import Button from "./Button";
import Reveal from "./Reveal";
import { getLiveFaqs } from "@/lib/api";

const faqs = [
  {
    q: "What services does DEZORYN Technology provide?",
    a: "DEZORYN Technology designs and builds ready-to-deploy software products, bespoke enterprise software, AI and workflow automation tools, and responsive web and mobile applications tailored to help organizations streamline operations.",
  },
  {
    q: "Can you build custom software for our business?",
    a: "Yes. In addition to our core SaaS platforms, we build custom business software platforms tailored around your unique organizational workflows, administrative approval hierarchies, and specific data requirements.",
  },
  {
    q: "Which industries do you serve?",
    a: "We develop solutions across education, healthcare, real estate, residential communities, manufacturing, and retail sectors, addressing domain-specific operational challenges in each area.",
  },
  {
    q: "Can you integrate with existing systems?",
    a: "Yes. Our applications can connect with your existing databases, third-party software tools, payment providers, and communication channels using standard REST APIs, webhooks, and secure authentication mechanisms.",
  },
  {
    q: "How can we discuss a project or request a demo?",
    a: "You can submit a project inquiry through our Contact page or schedule an interactive walkthrough on our Demo page. Our team will review your requirements and arrange a discussion.",
  },
  {
    q: "What ongoing maintenance, updates, and SLAs does DEZORYN provide?",
    a: "All DEZORYN deployments include guaranteed 99.99% uptime SLAs, automated daily cloud backups, continuous security updates, and 24/7 priority technical support with dedicated engineers.",
  },
];

export default function HomeFAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const [items, setItems] = useState(faqs);

  useEffect(() => {
    let active = true;
    getLiveFaqs()
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res) ? res : res?.data || [];
        if (list.length > 0) {
          const mapped = list.map((item) => ({
            q: item.question || item.q,
            a: item.answer || item.a,
          }));
          setItems(mapped);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section className="section border-t border-line bg-midnight/50 relative">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          {/* Left Column: Heading & Help Callout */}
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-mono text-[#93c5fd]">
              <HelpCircle size={13} aria-hidden="true" className="text-electric" />
              <span>HELP &amp; INQUIRIES</span>
            </div>
            <Heading className="h-section">
              Frequently Asked Questions
            </Heading>
            <Reveal delay={0.1}>
              <p className="lead mt-4">
                Common questions about our software offerings, custom development, integrations, and how to get started.
              </p>
            </Reveal>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="secondary" arrow>
                Contact Our Team
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Accordion */}
          <div className="space-y-3">
            {items.map((f, i) => {
              const isOpen = openIdx === i;
              return (
                <Reveal key={f.q} delay={i * 0.05}>
                  <div
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-electric/50 bg-[#070e22] shadow-[0_8px_25px_rgba(47,107,255,0.15)]"
                        : "border-white/10 bg-[#050a18]/70 hover:border-white/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold text-white transition-colors"
                    >
                      <span className="leading-snug">{f.q}</span>
                      <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className={`text-electric shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-white/5 px-5 pb-5 pt-3">
                        <p className="text-xs sm:text-sm text-cool leading-relaxed">
                          {f.a}
                        </p>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
