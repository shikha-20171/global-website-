"use client";
export default function Error({ reset }) {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-5 text-center">
      <div>
        <h1 className="h-section">Something went wrong.</h1>
        <p className="lead mt-3">An unexpected error occurred. Reload the page to continue.</p>
        <button onClick={reset} className="btn btn-primary mt-8">Try Again</button>
      </div>
    </section>
  );
}
