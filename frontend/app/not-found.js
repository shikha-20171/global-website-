import Button from "@/components/Button";
export const metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-5 text-center">
      <div>
        <div className="text-gradient text-8xl font-semibold tracking-tight">404</div>
        <h1 className="h-section mt-4">Looks like this page took a different route.</h1>
        <p className="lead mt-3">The page you want may have moved. Head back and try again.</p>
        <div className="mt-8"><Button href="/" arrow>Back to Home</Button></div>
      </div>
    </section>
  );
}
