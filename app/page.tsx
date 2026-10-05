// src/app/page.tsx
import { prisma } from "@/lib/prisma";


export default async function Home() {
  const [destinations, packages, events] = await Promise.all([
    prisma.destination.findMany({ where: { featured: true } }),
    prisma.tourPackage.findMany({ where: { featured: true } }),
    prisma.event.findMany({ where: { featured: true }, orderBy: { startDate: "asc" } }),
  ]);

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 p-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold">🇰🇪 NTSP — Magical Kenya</h1>
         
        </div>

        {/* Featured Destinations */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Destinations</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {destinations.map((d) => (
              <div key={d.id} className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                <h3 className="font-bold text-lg">{d.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{d.county} County</p>
                <p className="mt-2 text-sm">{d.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Packages */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Safari Packages</h2>
          <div className="space-y-3">
            {packages.map((p) => (
              <div key={p.id} className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {p.durationDays} day{p.durationDays > 1 ? "s" : ""} · {p.summary}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold whitespace-nowrap">
                    KES {p.priceKes.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                <h3 className="font-bold">{e.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {e.startDate.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                  {e.endDate ? ` – ${e.endDate.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}` : ""}
                  {" · "}{e.location}
                </p>
                <p className="mt-2 text-sm">{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}