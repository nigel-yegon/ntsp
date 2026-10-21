// prisma/parts/bookings.ts
import type { SeedContext } from "./types";

export async function seedBookings(ctx: SeedContext) {
  const daysAgo = (n: number) => new Date(Date.now() - n * 864e5);
  const daysFromNow = (n: number) => new Date(Date.now() + n * 864e5);

  const c1 = ctx.users.customers[0];
  const c2 = ctx.users.customers[1];
  const c3 = ctx.users.customers[2];
  const c4 = ctx.users.customers[3];
  const c5 = ctx.users.customers[4];
  const c6 = ctx.users.customers[5];

  const maraSerena = ctx.listings.accommodations["mara-serena"];
  const dianiSea   = ctx.listings.accommodations["diani-sea-resort"];
  const majlis     = ctx.listings.accommodations["majlis-lamu"];
  const giraffe    = ctx.listings.accommodations["giraffe-manor"];
  const medina     = ctx.listings.accommodations["medina-palms"];

  const bushBeach  = ctx.listings.packages["10-day-bush-and-beach"];
  const watamuPkg  = ctx.listings.packages["5-day-watamu"];
  const samburuPkg = ctx.listings.packages["5-day-samburu-laikipia"];
  const kenya7day  = ctx.listings.packages["7-day-kenya-highlights"];
  const nairobiPkg = ctx.listings.packages["2-day-nairobi-park-city"];

  // ── Bookings (customer ↔ owner of the referenced listing) ──
  const bookings = [
    { customerId: c1.id, listing: maraSerena, checkIn: daysFromNow(14), checkOut: daysFromNow(17), guests: 2, notes: "Room with a view if possible.", status: "REQUESTED", createdAt: daysAgo(3) },
    { customerId: c2.id, listing: dianiSea,   checkIn: daysFromNow(30), checkOut: daysFromNow(35), guests: 4, notes: "Family trip, two adults two children.", status: "CONFIRMED", respondedAt: daysAgo(0), responseNote: "Confirmed. Sea-facing family suite reserved.", createdAt: daysAgo(4) },
    { customerId: c3.id, listing: bushBeach,  checkIn: daysFromNow(45), checkOut: daysFromNow(55), guests: 2, notes: "Honeymoon trip.", status: "REQUESTED", createdAt: daysAgo(2) },
    { customerId: c4.id, listing: medina,     checkIn: daysFromNow(21), checkOut: daysFromNow(26), guests: 3, notes: "Anniversary. Late check-in expected.", status: "REQUESTED", createdAt: daysAgo(5) },
    { customerId: c5.id, listing: watamuPkg,  checkIn: daysFromNow(60), checkOut: daysFromNow(65), guests: 2, notes: "Interested in diving add-on.", status: "CONFIRMED", respondedAt: daysAgo(1), responseNote: "Confirmed with dive package.", createdAt: daysAgo(3) },
    { customerId: c6.id, listing: samburuPkg, checkIn: daysFromNow(90), checkOut: daysFromNow(95), guests: 2, notes: "Would like a walking safari.", status: "REQUESTED", createdAt: daysAgo(1) },
    { customerId: c1.id, listing: kenya7day,  checkIn: daysFromNow(120), checkOut: daysFromNow(127), guests: 2, notes: "Bucket-list trip.", status: "DECLINED", respondedAt: daysAgo(2), responseNote: "Fully booked on these dates. Please try late October.", createdAt: daysAgo(6) },
    { customerId: c2.id, listing: majlis,     checkIn: daysFromNow(50), checkOut: daysFromNow(54), guests: 2, notes: "Honeymoon — dhow cruise please.", status: "CONFIRMED", respondedAt: daysAgo(0), responseNote: "Confirmed with sunset dhow included.", createdAt: daysAgo(3) },
    { customerId: c3.id, listing: nairobiPkg, checkIn: daysFromNow(10), checkOut: daysFromNow(12), guests: 2, notes: "Nairobi layover trip.", status: "COMPLETED", respondedAt: daysAgo(15), responseNote: "Completed successfully.", createdAt: daysAgo(20) },
    { customerId: c4.id, listing: giraffe,    checkIn: daysFromNow(365), checkOut: daysFromNow(368), guests: 2, notes: "Booked 12 months ahead for giraffe room.", status: "REQUESTED", createdAt: daysAgo(0) },
  ] as const;

  for (const b of bookings) {
    if (!b.listing) continue;
    const isPackage = b.listing.ownerId !== b.listing.ownerId && false; // no-op
    // Determine whether the listing is a package by checking the ID map.
    const isAccommodation = Object.values(ctx.listings.accommodations).some((x) => x.id === b.listing.id);
    const isTourPackage = Object.values(ctx.listings.packages).some((x) => x.id === b.listing.id);

    await ctx.prisma.booking.create({
      data: {
        customerId: b.customerId,
        businessId: b.listing.ownerId,
        accommodationId: isAccommodation ? b.listing.id : null,
        tourPackageId: isTourPackage ? b.listing.id : null,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        guests: b.guests,
        notes: b.notes,
        status: b.status as any,
        respondedAt: "respondedAt" in b ? b.respondedAt : null,
        responseNote: "responseNote" in b ? b.responseNote : null,
        createdAt: b.createdAt,
      },
    });
  }

  // ── Message threads (customer ↔ owner of the referenced listing) ──
  type ThreadSeed = {
    customerId: string;
    listing: { id: number; ownerId: string } | undefined;
    subject: "ACCOMMODATION" | "TOUR_PACKAGE";
    label: string;
    createdAt: Date;
    updatedAt: Date;
    messages: { authorId: string; body: string; createdAt: Date; readByCustomer: boolean; readByBusiness: boolean }[];
  };

  const threads: ThreadSeed[] = [];

  if (maraSerena) {
    threads.push({
      customerId: c1.id,
      listing: maraSerena,
      subject: "ACCOMMODATION",
      label: "Mara Serena Safari Lodge",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(2),
      messages: [
        { authorId: c1.id, body: "Hi, I'm interested in a 3-night stay in early August. Do you have availability for two adults?", createdAt: daysAgo(3), readByCustomer: true, readByBusiness: true },
        { authorId: maraSerena.ownerId, body: "Hello Amina, we have availability 5–8 August. Full board is included.", createdAt: daysAgo(2), readByCustomer: false, readByBusiness: true },
      ],
    });
  }

  if (dianiSea) {
    threads.push({
      customerId: c2.id,
      listing: dianiSea,
      subject: "ACCOMMODATION",
      label: "Diani Sea Resort",
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      messages: [
        { authorId: c2.id, body: "Do you offer airport transfers from Moi International?", createdAt: daysAgo(1), readByCustomer: true, readByBusiness: false },
      ],
    });
  }

  if (bushBeach) {
    threads.push({
      customerId: c3.id,
      listing: bushBeach,
      subject: "TOUR_PACKAGE",
      label: "10-Day Bush & Beach",
      createdAt: daysAgo(4),
      updatedAt: daysAgo(1),
      messages: [
        { authorId: c3.id, body: "Hello Savannah Tours — I'm interested in the 10-day bush & beach for two in October. Can you confirm availability?", createdAt: daysAgo(4), readByCustomer: true, readByBusiness: true },
        { authorId: bushBeach.ownerId, body: "Hi Sophie — October is open. Airport pickup from JKIA is included. I'll send a detailed quote today.", createdAt: daysAgo(3), readByCustomer: false, readByBusiness: true },
        { authorId: c3.id, body: "Sounds great. Can we extend by two nights at Diani?", createdAt: daysAgo(1), readByCustomer: true, readByBusiness: false },
      ],
    });
  }

  if (watamuPkg) {
    threads.push({
      customerId: c4.id,
      listing: watamuPkg,
      subject: "TOUR_PACKAGE",
      label: "5-Day Watamu Beach & Marine Park",
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
      messages: [
        { authorId: c4.id, body: "Hi Wild Trail — my family of 4 is looking at the Watamu package. Is there a child rate?", createdAt: daysAgo(2), readByCustomer: true, readByBusiness: false },
      ],
    });
  }

  if (samburuPkg) {
    threads.push({
      customerId: c5.id,
      listing: samburuPkg,
      subject: "TOUR_PACKAGE",
      label: "5-Day Samburu & Laikipia",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
      messages: [
        { authorId: c5.id, body: "Could we add a walking safari to the Samburu portion?", createdAt: daysAgo(3), readByCustomer: true, readByBusiness: true },
        { authorId: samburuPkg.ownerId, body: "Yes — bush walks can be included with advance notice.", createdAt: daysAgo(1), readByCustomer: false, readByBusiness: true },
      ],
    });
  }

  for (const t of threads) {
    if (!t.listing) continue;
    await ctx.prisma.messageThread.create({
      data: {
        customerId: t.customerId,
        businessId: t.listing.ownerId,
        subject: t.subject,
        accommodationId: t.subject === "ACCOMMODATION" ? t.listing.id : null,
        tourPackageId: t.subject === "TOUR_PACKAGE" ? t.listing.id : null,
        subjectLabel: t.label,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        messages: {
          create: t.messages,
        },
      },
    });
  }

  console.log(`✔ Bookings & threads: ${bookings.length} bookings, ${threads.length} threads (all matched to real owners)`);
}