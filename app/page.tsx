export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Classroom Observation Tracker
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Class Companion
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            A quick, classroom-friendly way to record positive behaviors,
            redirections, and student observations.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Current Class
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Sample Class
              </h2>
            </div>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
              Today
            </span>
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-lg font-medium">
              Class Companion is running!
            </p>

            <p className="mt-2 text-slate-500">
              Next, we&apos;ll add students and the two-tap behavior recorder.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}