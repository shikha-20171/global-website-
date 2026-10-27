"use client";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import Button from "./Button";
import Heading from "./Heading";
import Reveal from "./Reveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedRail({ items }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const amount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="section bg-midnight/60 overflow-hidden">
      <div className="container-x">
        {/* Header with Title and Nav Controls */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-mono text-[#93c5fd]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
              <span>FEATURED PRODUCTS</span>
            </div>
            <Heading className="h-section max-w-2xl">
              Featured Products
            </Heading>
            <Reveal delay={0.1}>
              <p className="mt-3 text-base sm:text-lg text-cool max-w-2xl leading-relaxed">
                Explore our specialized software platforms built to simplify operations and workflows across education, healthcare, real estate, and residential communities.
              </p>
            </Reveal>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-graphite/80 text-cool hover:text-white hover:border-white/20 transition"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-graphite/80 text-cool hover:text-white hover:border-white/20 transition"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
            <Button href="/marketplace" variant="secondary" arrow>
              Explore All Products
            </Button>
          </div>
        </div>

        {/* Smooth Horizontal Carousel Rail without Viewport Hijacking */}
        <div
          ref={scrollRef}
          className="mt-10 flex gap-5 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] snap-x snap-mandatory"
        >
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="w-[85vw] max-w-[360px] shrink-0 snap-start"
            >
              <Reveal delay={i * 0.05} random>
                <ProductCard product={p} compare={false} index={i} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
