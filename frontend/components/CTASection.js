import Button from "./Button";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function CTASection({
  title = "Have a Project in Mind?",
  text = "Tell us what you want to build. Our team can help you explore the right technology approach for your business.",
  primary = ["Discuss Your Project", "/contact"],
  secondary = null,
}) {
  return (
    <section className="section pt-0">
      <div className="container-x">
        <Reveal>
          <div className="glow-border noise relative overflow-hidden rounded-2xl bg-[#07102a] p-8 text-center sm:p-20">
            <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 animate-aurora1 rounded-full bg-electric/30 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 animate-aurora2 rounded-full bg-violet/30 blur-[90px]" />
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
            <h2 className="h-section relative mx-auto max-w-2xl text-white">
              {(() => {
                if (typeof title !== "string") return title;
                const words = title.trim().split(/\s+/);
                const highlightCount = words.length >= 5 ? 2 : 1;
                const splitIndex = Math.max(1, words.length - highlightCount);
                return (
                  <>
                    <span>{words.slice(0, splitIndex).join(" ")} </span>
                    <span className="text-gradient-blue font-extrabold">
                      {words.slice(splitIndex).join(" ")}
                    </span>
                  </>
                );
              })()}
            </h2>
            <p className="lead relative mx-auto mt-4 max-w-xl">{text}</p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              {primary && <Magnetic><Button href={primary[1]} arrow>{primary[0]}</Button></Magnetic>}
              {secondary && <Magnetic><Button href={secondary[1]} variant="secondary">{secondary[0]}</Button></Magnetic>}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
