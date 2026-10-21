// prisma/parts/posts.ts
import type { SeedContext } from "./types";

function img(photoId: string, width = 1600, height = 900): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

function para(...paragraphs: [string, string, string]): string {
  return paragraphs.join("\n\n");
}

type PostSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  published: boolean;
  publishedAt: Date;
};

const POSTS: PostSeed[] = [
  {
    title: "The Best Time to Visit the Maasai Mara",
    slug: "best-time-to-visit-maasai-mara",
    excerpt: "Migration season vs. green season — what each offers, and when to book for the best rates and wildlife viewing.",
    content: para(
      "The Maasai Mara is spectacular year-round, but the experience varies dramatically by season. Peak season runs from July to October, coinciding with the Great Wildebeest Migration, when over 1.5 million wildebeest and zebras cross the Mara River from the Serengeti. Expect premium rates, packed lodges, and spectacular river crossings — but also the best wildlife viewing of the year.",
      "The green season (November to May) is quieter and much cheaper. Rates can drop 40 to 60 percent compared to peak. The landscape is lush after the short rains, birdlife is abundant, and you often have sightings almost to yourself. The trade-off is that some camps close, and roads can be muddy after heavy rain.",
      "If you want to see the migration without the crowds, consider late June or early November — shoulder seasons with reasonable rates and good viewing. Book at least six months ahead for the July to October window, and confirm whether your lodge sits inside the reserve or in a private conservancy, since conservancy rates are often lower and game drives are less restricted."
    ),
    coverImage: img("photo-1516426122078-c23e76319801"),
    tags: "Featured,Safari,Wildlife,Planning",
    published: true,
    publishedAt: new Date("2026-09-12"),
  },
  {
    title: "A First-Timer's Guide to Diani Beach",
    slug: "diani-beach-guide",
    excerpt: "Where to stay, what to eat, and how to get the most out of Kenya's award-winning coastline.",
    content: para(
      "Diani Beach stretches for 17 kilometres along the Indian Ocean, south of Mombasa in Kwale County. It is consistently ranked among Africa's best beaches, and for good reason — powder-white sand, warm turquoise water, and a coral reef that shelters the shoreline from the open ocean swell.",
      "Getting there is straightforward. Fly into Moi International Airport in Mombasa, then take a 45-minute taxi or the Likoni Ferry. Alternatively, fly directly into Ukunda airstrip, which sits right next to Diani. The northern end near the Kongo River is quieter, with boutique hotels and private villas, while the southern stretch has larger resorts with full amenities — pools, spas, and dive centres.",
      "Don't miss snorkelling or diving at Kisite-Mpunguti Marine Park, a sunset dhow cruise, and a day trip to the Shimba Hills for the rare sable antelope. For food, try the fresh seafood at one of the beachfront restaurants — the crab and prawns are exceptional. Best time to visit is December to March (dry, sunny) or July to October (cooler, fewer crowds). Avoid April and May, when the long rains hit."
    ),
    coverImage: img("photo-1507525428034-b723cf961d3e"),
    tags: "Featured,Beach,Coast,Planning",
    published: true,
    publishedAt: new Date("2026-08-28"),
  },
  {
    title: "Kenya Visa & Entry Guide for 2026",
    slug: "kenya-visa-guide-2026",
    excerpt: "Everything you need to know about the eTA, vaccinations, and what to have ready at the border.",
    content: para(
      "Kenya introduced the Electronic Travel Authorisation (eTA) in early 2024, replacing traditional visas for most visitors. Apply online at etakenya.go.ke before you travel. Processing typically takes three working days, but apply at least a week ahead in case of delays. The fee is USD 30 for most nationalities, and the eTA is valid for 90 days from approval.",
      "You will need a passport valid for at least six months beyond your arrival date, a recent passport-style photo, your flight itinerary, and accommodation details for the first night. Yellow fever vaccination is required if you are arriving from a yellow-fever-endemic country; otherwise it is recommended but not mandatory. Check with your travel clinic about malaria prophylaxis if you are heading to the coast or safari areas.",
      "At the border, you may be asked for proof of onward travel and sufficient funds. Have your return ticket and a bank statement or credit card ready. If you are travelling with children, confirm the current requirements for birth certificates and parental consent letters, as these rules have tightened in recent years."
    ),
    coverImage: img("photo-1488646953014-85cb44e25828"),
    tags: "Featured,Planning,Visa",
    published: true,
    publishedAt: new Date("2026-08-05"),
  },
  {
    title: "Packing for a Kenyan Safari: The Complete List",
    slug: "safari-packing-list",
    excerpt: "What to bring, what to leave behind, and why neutral colours matter on game drives.",
    content: para(
      "Packing for a safari is different from packing for a beach holiday. Neutral colours — khaki, olive, beige, brown — are essential. Avoid bright blue and black, which attract tsetse flies in some regions. Layers are key: mornings are cool, midday is hot, and evenings cool down again. A light fleece or jacket for dawn game drives will be your most-used item.",
      "Footwear: comfortable closed shoes for game drives, sandals for around camp. Skip the hiking boots unless you are trekking. Gear: binoculars (one pair per person), a camera with a zoom lens of at least 200mm, spare batteries, and plenty of memory cards. A wide-brimmed hat, sunscreen, and insect repellent are non-negotiable.",
      "Documents: passport, eTA confirmation, travel insurance, and vaccination certificate. Bring a small daypack for game drives, a reusable water bottle, and a headlamp for navigating camp at night. Most lodges provide laundry service, so you can pack lighter than you think — three or four outfits for a week-long trip is usually enough."
    ),
    coverImage: img("photo-1502920917128-1aa500764cbd"),
    tags: "Featured,Safari,Planning",
    published: true,
    publishedAt: new Date("2026-07-22"),
  },
  {
    title: "The Great Migration: A Month-by-Month Guide",
    slug: "great-migration-month-by-month",
    excerpt: "Follow the wildebeest from the Serengeti to the Mara and back — and know exactly when to book.",
    content: para(
      "The Great Migration is a year-round cycle. Understanding it lets you pick the right month and location. From January to March, the herds are calving in the southern Serengeti. Predator action is intense; this is a photographer's dream. April to May sees the herds move north through the central Serengeti, and many camps close in Kenya during the long rains.",
      "June marks the first wildebeest crossings of the Grumeti River in Tanzania, and Kenya's Mara camps begin to fill. July to August is the famous Mara River crossing season — the spectacular, crowded, expensive peak. September to October sees the herds spread across the Mara plains with excellent viewing still available at slightly lower rates.",
      "November brings the herds moving south again; some Mara camps close and rates drop significantly. By December the herds are back in the Serengeti, and the cycle begins again. If you want to see the migration with fewer vehicles around you, aim for the shoulder weeks in late June or early November and stay in a private conservancy where off-road game viewing is permitted."
    ),
    coverImage: img("photo-1534177616072-ef7dc120449d"),
    tags: "Featured,Wildlife,Safari,Planning",
    published: true,
    publishedAt: new Date("2026-07-10"),
  },
  {
    title: "Kenya's Big Five (and Where to See Them)",
    slug: "kenyas-big-five",
    excerpt: "Lion, leopard, elephant, buffalo, rhino — where to go for each, and how to spot them.",
    content: para(
      "The Big Five — lion, leopard, elephant, buffalo, and rhino — were originally named for the difficulty of hunting them. Today they are the bucket-list animals for most safari-goers. Lion are most reliable in the Maasai Mara and Amboseli, where the open plains make them easy to spot from a distance.",
      "Leopards are solitary and elusive, but the Mara's riverine forest along the Mara River is one of the best places in Africa to see them. Elephants are guaranteed in Amboseli for the big tuskers against Kilimanjaro; Samburu for the Samburu Special Five including the distinctive long-tusked elephants of the north. Buffalo are found in any major park — huge herds are common in the Mara and Tsavo.",
      "Rhinos are the hardest of the five. Lake Nakuru and Nairobi National Park are the most reliable, both with fenced sanctuaries where black and white rhino can be viewed safely. If seeing all five is a priority, plan a multi-park trip of at least ten days: Mara for lion and leopard, Amboseli for elephant, and Nakuru for rhino."
    ),
    coverImage: img("photo-1564760055775-d63b17a55c44"),
    tags: "Featured,Wildlife,Safari",
    published: true,
    publishedAt: new Date("2026-05-11"),
  },
  {
    title: "Diani vs. Watamu: Which Kenyan Beach?",
    slug: "diani-vs-watamu",
    excerpt: "Two of Kenya's best coast destinations compared — crowds, reefs, vibes, and who each suits best.",
    content: para(
      "Both are spectacular. But they are different experiences. Diani is the more developed of the two — larger resorts, more restaurants, better infrastructure. It sits south of Mombasa, is easy to reach, and offers easy access to Kisite-Mpunguti Marine Park for snorkelling and dolphin sightings.",
      "Watamu is quieter, smaller, and more Italian-influenced, a legacy of decades of Italian tourism. Its marine park is right offshore — you can snorkel from the beach at low tide. Turtles nest on Watamu's beaches, and the nearby Gedi ruins add a cultural dimension that Diani lacks.",
      "Choose Diani if you want options, amenities, and a range of accommodation from budget to luxury. Choose Watamu if you want a slower pace, easy reef access, and a more intimate scale. Both are excellent in December to March; avoid April and May on either coast because of the long rains."
    ),
    coverImage: img("photo-1544551763-46a013bb70d5"),
    tags: "Featured,Beach,Coast",
    published: true,
    publishedAt: new Date("2026-05-28"),
  },
  {
    title: "The Samburu Special Five",
    slug: "samburu-special-five",
    excerpt: "Five species you won't see anywhere else in Kenya — and why Samburu is worth the extra drive.",
    content: para(
      "Samburu National Reserve, 350 kilometres north of Nairobi, is home to five species that are unique or nearly unique to northern Kenya. Together they are called the Samburu Special Five — a bucket-list within a bucket-list for serious safari-goers. The reserve is more arid than the Mara, and its wildlife has adapted to survive on less water.",
      "Grevy's zebra is the largest zebra species, with narrow stripes and a white belly; fewer than 3,000 remain in the wild. The reticulated giraffe has a sharp, geometric pattern rather than the softer patches of other giraffes — considered a distinct species since 2016. The Beisa oryx has long, straight horns and is adapted to desert conditions. The gerenuk is a long-necked antelope that stands on its hind legs to reach higher branches, nicknamed the 'giraffe gazelle'.",
      "The Somali ostrich is the fifth — a distinct species with blue-grey legs and neck on males, or brown feathers on females. Combine a Samburu visit with a stay in one of the community conservancies like Westgate, where walking safaris and cultural visits to Samburu villages are part of the experience. It is a long drive from Nairobi, but worth every hour."
    ),
    coverImage: img("photo-1547471080-7cc2caa01a7e"),
    tags: "Featured,Wildlife,Safari",
    published: true,
    publishedAt: new Date("2026-03-01"),
  },
  {
    title: "Nairobi in 48 Hours",
    slug: "nairobi-48-hours",
    excerpt: "The perfect weekend itinerary for Kenya's capital — wildlife, culture, coffee, and food.",
    content: para(
      "Most travellers pass through Nairobi on the way to a safari. Don't. The city deserves two full days. Start Day 1 with Nairobi National Park at dawn — yes, you can see lions, rhinos, and buffalo with the skyline in the background. Book ahead for the 11am elephant feeding at the David Sheldrick Wildlife Trust. In the afternoon, feed Rothschild giraffes at the Giraffe Centre in Langata.",
      "Day 2 is culture. Morning at the Karen Blixen Museum, seeing the house from Out of Africa. Midday at the Maasai Market, which rotates locations by day of the week — check before you go. Afternoon at either the Nairobi Railway Museum or the Nairobi National Museum. Evening sundowners on the rooftop of the Sarova Stanley, then dinner at Fogo Gaucho (Brazilian) or About Thyme (modern European with local twists).",
      "Getting around: Uber and Bolt both work well in Nairobi; agree on a fare before entering a taxi. Stay in Westlands, Karen, or Gigiri for safety and convenience. Traffic is notorious — plan to be out of the CBD by 4:30pm. Carry small change for tips and parking. Two days is enough to feel the city; three is enough to love it."
    ),
    coverImage: img("photo-1611348586804-61bf6c080437"),
    tags: "Featured,Nairobi,Culture,Planning",
    published: true,
    publishedAt: new Date("2026-06-14"),
  },
  {
    title: "Ethical Wildlife Tourism in Kenya",
    slug: "ethical-wildlife-tourism",
    excerpt: "How to travel in a way that supports conservation and respects wildlife — not exploits it.",
    content: para(
      "Kenya's wildlife is under pressure from poaching, habitat loss, and climate change. Ethical tourism can be part of the solution — or part of the problem. Choose operators that are members of the Kenya Association of Tour Operators or that partner with conservancies. Many are actively involved in anti-poaching and community work, and their fees fund ranger salaries, vehicle patrols, and wildlife monitoring.",
      "Avoid elephant rides, lion walks, and any 'sanctuary' that allows cub-petting. These are exploitative operations dressed up as conservation, and they often source animals from the wild. Instead, visit legitimate rehabilitation centres like the Sheldrick Wildlife Trust or the Giraffe Centre, where the primary mission is rescue and release rather than entertainment.",
      "Support community conservancies like Lewa, Ol Pejeta, and Mara North. These pay local landowners, employ local staff, and protect wildlife corridors that national parks alone cannot. When you are on safari, never pressure your guide to move off-road for a better photo — it damages habitat and stresses animals. If a sighting is causing a crowd, ask your guide to leave."
    ),
    coverImage: img("photo-1560055775-d63b17a55c44"),
    tags: "Featured,Wildlife,Conservation,Ethics",
    published: true,
    publishedAt: new Date("2025-10-30"),
  },

  // ── Non-featured ──
  { title: "Kenyan Coffee: A Traveler's Guide", slug: "kenyan-coffee-guide", excerpt: "From the slopes of Mount Kenya to your morning cup — where to taste the real thing.", content: para("Kenyan coffee is among the finest in the world. If you are visiting, here is how to taste it properly. The growing regions — Nyeri, Kirinyaga, Murang'a, and the slopes of Mount Kenya — produce the most prized beans. The high altitude, volcanic soil, and equatorial sun create a bright, fruity, blackcurrant-forward profile that is unmistakable in the cup.", "Where to taste in Nairobi: Spring Valley Coffee, The Boston Coffee House, and Connect Coffee Roasters all roast locally and offer cupping sessions. In Nyeri, visit a coffee estate and see the full process — picking, pulping, drying, roasting — usually for a modest fee that goes directly to the cooperative.", "What to buy: single-origin AA beans, roasted within the last two weeks. Ask for the roast date. Avoid anything pre-ground — coffee loses aroma within hours of grinding. If you are buying for gifts, vacuum-sealed whole beans travel well and make a better souvenir than anything from a tourist shop."), coverImage: img("photo-1447933601403-0c6688de566e"), tags: "Culture,Nairobi,Food", published: true, publishedAt: new Date("2026-06-30") },
  { title: "A Guide to the Swahili Coast", slug: "swahili-coast-guide", excerpt: "Lamu, Mombasa, Malindi — the history, culture, and food of Kenya's Indian Ocean.", content: para("Kenya's coast is not just beaches. It is one of the oldest continuous cultural regions in the world — a thousand years of Swahili civilization shaped by Arab, Persian, Indian, and African influence. The Swahili language itself is a fusion of Bantu and Arabic, and coastal architecture reflects the same layering of cultures.", "Lamu is the most intact historic town in East Africa. Cars are almost nonexistent; donkeys and dhows are the transport. The architecture is coral stone and mangrove timber, with carved wooden doors that are works of art in themselves. Mombasa is the largest coastal city — Fort Jesus, a UNESCO World Heritage Site, tells the story of Portuguese, Omani, and British rule. Old Town's narrow streets and markets are worth a half day.", "Malindi has a distinctive Italian character from decades of Italian tourism, but beneath it lies a Swahili town with ancient ruins nearby — Gedi, a medieval city abandoned in the 17th century. Food along the coast blends Indian, Arabic, and African influences: biryani, pilau, coconut curries, and grilled seafood are all staples. December to March is the best time to visit."), coverImage: img("photo-1571407970349-bc81e7e96d47"), tags: "Coast,Culture,Beach", published: true, publishedAt: new Date("2026-04-22") },
  { title: "Safety Tips for Traveling in Kenya", slug: "safety-tips-kenya", excerpt: "How to stay safe and avoid the common pitfalls — from Nairobi streets to safari camps.", content: para("Kenya is generally safe for tourists who take reasonable precautions. In cities, avoid walking alone at night and use hotel-arranged transport after dark. Keep valuables out of sight, and do not walk with your phone out. In Nairobi specifically, the Central Business District is busy and generally safe during the day; avoid the areas around River Road at night.", "On safari, follow your guide's instructions without question. Do not leave your tent at night unless you are escorted, and never walk between vehicles on a game drive. In coastal areas, Diani, Watamu, and Lamu are safe for tourists; Mombasa is generally fine but stick to populated areas.", "Transport: use Uber or Bolt in Nairobi and Mombasa. For intercity travel, use reputable coaches like Easy Coach or modern shuttle services. Emergency numbers: police 999 or 112; tourist police hotline +254 20 341 4955. Register your trip with your embassy before departure and keep digital and physical copies of your passport and travel insurance."), coverImage: img("photo-1488646953014-85cb44e25828"), tags: "Planning,Safety", published: true, publishedAt: new Date("2026-04-05") },
  { title: "Wildlife Photography in Kenya: A Beginner's Guide", slug: "wildlife-photography-guide", excerpt: "Gear, settings, and etiquette for capturing Kenya's wildlife on camera.", content: para("Kenya is one of the best wildlife photography destinations on earth. Here is how to make the most of it. The single most important piece of gear is a zoom lens — a 100-400mm or 200-500mm is ideal. Bring more reach than you think you need; you will use it, and a 70-200mm on a full-frame body will feel short in the field.", "Camera settings for wildlife: shutter priority at 1/1000s or faster for moving animals. Continuous autofocus with animal eye detection (available on most modern bodies). High-speed burst mode. Shoot RAW. Golden hour is everything — most photographers shoot from 6–9am and again from 4–6:30pm. Midday light is harsh and flat.", "Ethics: never ask your guide to move off-road for a photo. Do not crowd wildlife at a sighting — if there are more than three vehicles, your guide should give the animal space. Turn off flash. Do not use drones in national parks; it is illegal. Keep noise low and your movements inside the vehicle slow. Patience is more important than gear."), coverImage: img("photo-1516728778615-2d590ea1855e"), tags: "Wildlife,Photography,Safari", published: true, publishedAt: new Date("2026-03-18") },
  { title: "Kenya's Best Safari Lodges for a Splurge", slug: "kenya-splurge-lodges", excerpt: "Where to spend when you want the trip of a lifetime — luxury camps and lodges worth every shilling.", content: para("Some trips deserve the top tier. Here are Kenya's standout splurge properties. Angama Mara (Maasai Mara) is suspended on the edge of the Rift Valley with views over the Mara Triangle. Suites are canvas and glass; the service is faultless, and the balloon safari is a signature add-on.", "Giraffe Manor (Nairobi) is the most photographed hotel in Kenya — waking up to a Rothschild giraffe at your window is the whole point. Book at least a year ahead. Tortilis Camp (Amboseli) is an intimate tented camp on the edge of Amboseli, with Kilimanjaro framed by every view. Elephant Bedroom Camp (Samburu) sees elephants regularly walk through camp.", "The Majlis (Lamu) is a beachfront resort on Manda Island with views across the channel to Lamu Old Town. Each of these properties commands rates from USD 800 to over 2,000 per person per night, all-inclusive of meals, drinks, and game drives. Consider combining two — for example three nights in the Mara and three on the coast — for a trip that feels complete."), coverImage: img("photo-1566073771259-6a8506099945"), tags: "Safari,Planning,Stay", published: true, publishedAt: new Date("2026-02-12") },
  { title: "Traveling Kenya on a Budget", slug: "kenyas-budget-travel", excerpt: "How to see the best of Kenya without spending a fortune — camps, matatus, and local food.", content: para("Kenya can be expensive. It can also be surprisingly affordable. Budget camping safaris with shared game drives and basic tents run from KES 15,000 to 25,000 per day. They are not luxury, but they are real safaris — you see the same animals and visit the same parks as the luxury camps.", "Accommodation: hostels in Nairobi start around KES 2,000 per night. Airbnb and guesthouses in Diani can be under KES 5,000. Mid-range lodges in most parks run KES 10,000 to 20,000. Book direct rather than through booking sites — Kenyan lodges often offer better rates and free upgrades for direct bookings.", "Transport: matatus connect every major town cheaply. A Nairobi-to-Mombasa bus is around KES 1,500, and the standard-gauge railway is even cheaper. Food: eat where locals eat. A plate of nyama choma at a local grill is KES 300 to 500. Ugali and sukuma wiki at a roadside hotel is KES 150. With care, a two-week trip including one camping safari can be done for under USD 1,500 per person."), coverImage: img("photo-1488646953014-85cb44e25828"), tags: "Planning,Budget", published: true, publishedAt: new Date("2026-01-25") },
  { title: "A Guide to Nyama Choma", slug: "nyama-choma-guide", excerpt: "Kenya's national dish — where to eat it, how to order it, and what to expect.", content: para("Nyama choma means 'roasted meat' in Swahili. It is Kenya's unofficial national dish, and eating it is a cultural experience as much as a meal. The meat is goat, beef, or chicken, roasted over charcoal until the outside is crisp and the inside is tender. It is served with ugali (maize meal), kachumbari (tomato and onion salad), and sometimes sukuma wiki (collard greens).", "Where to eat it: the best nyama choma is at local joints, not tourist restaurants. In Nairobi, try the areas around Kikuyu, Ngong Road, and the famous 'Nyama Choma Trail' along Langata Road. In Mombasa, the coastal version often includes coconut rice and grilled fish alongside the meat.", "How to order: you point at the cut of meat you want — a 'quarter' or 'half' of a goat is common. The butcher roasts it to order, and it arrives on a wooden board with a knife. You eat with your hands, using ugali to scoop the meat and kachumbari. Wash it down with a cold Tusker or a fresh passion fruit juice."), coverImage: img("photo-1414235077428-338989a2e8c0"), tags: "Culture,Food,Nairobi", published: true, publishedAt: new Date("2026-01-14") },
  { title: "Lake Naivasha: The Weekend Escape", slug: "lake-naivasha-weekend", excerpt: "Boat safaris, hippos, and Crescent Island — the perfect weekend from Nairobi.", content: para("Lake Naivasha is 90 minutes from Nairobi and one of the easiest weekend escapes in Kenya. It is a freshwater lake in the Rift Valley, home to hippos, over 400 bird species, and a thriving flower-farming industry that supplies European supermarkets. The lakeside is dotted with boutique lodges, camps, and private houses.", "Crescent Island is a private island in the lake where you can walk among giraffes, zebras, and wildebeest — no fences, no vehicles. It is one of the few places in Kenya where you can walk freely among large mammals. Boat safaris take you past hippos up close (from a safe distance), fish eagles, and the lake's resident pelicans.", "Where to stay: Lake Naivasha Sopa Resort, Enashipai, or one of the many boutique lodges on the shore. Combine with a visit to Hell's Gate National Park for cycling among wildlife, or an afternoon at Elsamere, the former home of Joy Adamson of Born Free fame. Book ahead for weekends — Nairobi empties into Naivasha on Friday nights."), coverImage: img("photo-1544551763-46a013bb70d5"), tags: "Nakuru,Weekend,Wildlife", published: true, publishedAt: new Date("2025-12-20") },
  { title: "The Truth About Kenyan Roads", slug: "kenyan-roads-truth", excerpt: "What to expect when driving in Kenya — road conditions, driving culture, and why most visitors shouldn't self-drive.", content: para("Kenya drives on the left, uses a mix of tarmac and rough gravel, and has one of the more chaotic driving cultures in East Africa. Main highways — Mombasa Road, the Nairobi-Nakuru highway, and the Thika Superhighway — are in good condition. Speed bumps are frequent and often unmarked, especially near schools and markets.", "Rural roads vary. The road to the Mara is five to six hours from Nairobi, mostly tarmac with some rough sections near the park. The road to Amboseli is four hours, mostly tarmac. If you are heading to Samburu or Laikipia, expect longer drives on rougher roads.", "Traffic: Nairobi traffic is notorious. Avoid driving during rush hour (7–9am, 5–7pm) if you can. Better option: hire a driver-guide. They know the roads, the shortcuts, and the parks. The cost is worth every shilling, and it lets you actually look out the window. If you must self-drive, get an international driving permit and check your insurance carefully — many policies exclude off-tarmac driving."), coverImage: img("photo-1449965408869-eaa3f722e40d"), tags: "Planning,Transport", published: true, publishedAt: new Date("2025-12-03") },
  { title: "Kenya's Best Time to Visit for Birdwatching", slug: "kenyas-birdwatching", excerpt: "Over 1,100 species, two rainy seasons, and the migratory window — here's when to go.", content: para("Kenya has over 1,100 recorded bird species — one of the richest avifaunas in Africa. Resident species are common year-round. The Rift Valley lakes, Kakamega Forest, and the coastal forests have the highest diversity. If you are building a birding trip, plan at least two weeks to cover the main habitats.", "Palearctic migrants arrive from Europe and Asia from October to March. The Rift Valley lakes are the single best place to see them — Nakuru, Naivasha, Baringo, and Bogoria each attract different species. Intra-African migrants arrive with the rains; April to May and November are the peak periods for these.", "Best overall months: November to March for migratory species and pleasant weather. The Rift Valley lake circuit is at its best. Bring a good pair of binoculars (8x42 or 10x42), a regional field guide (Birds of East Africa by Stevenson and Fanshawe is standard), and patience. Early morning is by far the best time — most species are active from 6 to 9am."), coverImage: img("photo-1444464666168-49d633b86797"), tags: "Wildlife,Birdwatching,Planning", published: true, publishedAt: new Date("2025-11-18") },
  { title: "The Best Time to Visit Kenya Overall", slug: "best-time-to-visit-kenya-overall", excerpt: "Wildlife, weather, crowds, and cost — a season-by-season guide to planning your trip.", content: para("Kenya has two rainy seasons and two dry seasons, and the best time to visit depends on what you want. The long dry season runs from January to March, and the short dry season runs from July to October. Both are excellent for wildlife viewing, though the July–October window is also peak migration season and commands the highest prices.", "The long rains arrive in April and May, and the short rains in November. Both bring lush landscapes, abundant birdlife, and much lower prices, but some roads become impassable and many camps close. Coastal areas are affected less by the rains, though April and May on the coast can still be wet.", "For most travellers, the sweet spot is either January to March (dry, sunny, good for both safari and beach) or late June to early July (before the migration crowds arrive). Book six to nine months ahead for peak season. If budget is a priority, May and November offer excellent value if you can tolerate some rain."), coverImage: img("photo-1516426122078-c23e76319801"), tags: "Planning,Weather", published: true, publishedAt: new Date("2025-11-02") },
  { title: "Mount Kenya: A Climber's Guide", slug: "mount-kenya-climbers-guide", excerpt: "Routes, permits, and what to expect from Africa's second-highest mountain.", content: para("Mount Kenya is Africa's second-highest mountain and a serious alpine objective. There are three main routes: Sirimon (the easiest and most popular), Chogoria (scenic, with a longer approach), and Naro Moru (the shortest but steepest). Most trekkers summit Point Lenana (4,985m) in four to six days, acclimatizing along the way.", "Permits are required, and you must be accompanied by a licensed guide and porters. Book through a Kenya Association of Tour Operators member for safety and to ensure your fees support the park. Basic gear can be rented in Nanyuki; bring your own boots, sleeping bag, and warm layers. The summit is cold year-round.", "The best time to climb is January to February and August to September, when the weather is most stable. Avoid the long rains (April–May) and short rains (November) when routes become dangerous. Altitude sickness is real — ascend slowly, drink water, and do not push through symptoms. Point Lenana is non-technical, but Batian and Nelion peaks require technical climbing experience."), coverImage: img("photo-1519681393784-d120267933ba"), tags: "Adventure,Mountain,Trekking", published: true, publishedAt: new Date("2025-10-20") },
  { title: "Exploring Lamu Old Town", slug: "exploring-lamu-old-town", excerpt: "A walking guide to the UNESCO-listed Swahili settlement — mosques, markets, and dhow rides.", content: para("Lamu Old Town is the oldest and best-preserved Swahili settlement in East Africa. It is a UNESCO World Heritage Site, and it feels like stepping into a different century — narrow streets, donkeys carrying goods, carved wooden doors, and the constant sound of the Indian Ocean just a block away. There are no cars on Lamu, and that alone makes it worth the visit.", "The walking tour: start at the Lamu Museum (the former residence of a colonial district commissioner) for context on Swahili culture. Then wander through the old town to the Swahili House Museum, the Lamu Fort, and the Donkey Sanctuary. The market area is lively in the mornings; the waterfront comes alive at sunset.", "Dhow rides: a sunset dhow from Lamu to Shela beach is a highlight. Negotiate the price in advance (around KES 3,000 for a two-hour trip) and bring snacks and water. Where to stay: The Majlis on Manda Island, Peponi Hotel on Shela beach, or a restored Swahili guesthouse in the old town itself. Book ahead in December and during the Lamu Cultural Festival in November."), coverImage: img("photo-1571407970349-bc81e7e96d47"), tags: "Coast,Culture,Heritage", published: true, publishedAt: new Date("2025-10-08") },
  { title: "The Nairobi Restaurant Scene", slug: "nairobi-restaurant-scene", excerpt: "Where to eat in Kenya's capital — from street food to fine dining.", content: para("Nairobi's restaurant scene has exploded in the last decade. There is something for every budget and every cuisine, from street-side nyama choma to Michelin-calibre tasting menus. The city's food reflects its history — Indian, Swahili, Italian, Ethiopian, and modern Kenyan influences all collide here.", "For fine dining: Talisman (Karen) for modern African cuisine, Hemingways (Karen) for European classics, and About Thyme (Westlands) for a rotating seasonal menu. For mid-range: Mama Oliech (for tilapia), Nyama Mama (for a modern take on Kenyan comfort food), and Fogo Gaucho (Brazilian, all-you-can-eat meat).", "For street food: go to the Ngara or Gikomba markets for grilled corn and samosas. For an authentic nyama choma experience, try the joints along Langata Road or in Kikuyu. Book ahead for weekend dinners at the popular spots — Nairobi eats early, so 7pm bookings are standard."), coverImage: img("photo-1414235077428-338989a2e8c0"), tags: "Nairobi,Food,Culture", published: true, publishedAt: new Date("2025-09-25") },
  { title: "Amboseli: Kenya's Elephant Country", slug: "amboseli-elephant-country", excerpt: "Why Amboseli is the best place in Africa to see elephants up close.", content: para("Amboseli National Park is small as Kenyan parks go — just 392 square kilometres — but it has one of the highest concentrations of elephants in Africa. The herds are relaxed around vehicles because they have been studied and protected for decades. You can drive within 20 metres of a family group without them seeming to notice.", "The backdrop is what makes Amboseli iconic: Mount Kilimanjaro rising behind the elephants, snow-capped for most of the year. The best time to see the mountain is at sunrise or sunset, when the clouds typically clear. Observation Hill is the classic viewpoint.", "Where to stay: Amboseli Serena Safari Lodge, Tortilis Camp, or Ol Tukai Lodge. Book at least three nights — the park rewards slow safari. Combine with a visit to the Amboseli Elephant Research Camp, where you can learn about the longest-running elephant study in the world. Best time to visit: June to October and January to February."), coverImage: img("photo-1547970810-dc1eac37d174"), tags: "Wildlife,Safari,Amboseli", published: true, publishedAt: new Date("2025-09-10") },
  { title: "The Rift Valley Lakes: A Complete Guide", slug: "rift-valley-lakes-guide", excerpt: "Naivasha, Nakuru, Baringo, Bogoria, Elementaita, Magadi — which to visit and why.", content: para("The Rift Valley lakes are a chain of eight lakes running through western Kenya, each with its own character. Lake Naivasha is freshwater and popular for hippos and boat safaris. Lake Nakuru is alkaline and famous for its flamingos and rhino sanctuary. Lake Baringo is freshwater and excellent for birdwatching.", "Lake Bogoria is alkaline with dramatic hot springs and geysers, and huge seasonal flocks of flamingos. Lake Elementaita is smaller and quieter. Lake Magadi is the most unusual — a soda lake where salt has been harvested for decades, with a lunar-like landscape.", "Combine three or four lakes on a week-long driving circuit from Nairobi. Naivasha and Nakuru are the most accessible; Baringo and Bogoria are further north but reward the drive. Best time to visit: December to March when birdlife is at its peak and the roads are driest. Bring binoculars and a camera with a zoom lens."), coverImage: img("photo-1518709268805-4e9042af9f23"), tags: "Rift Valley,Lakes,Wildlife", published: true, publishedAt: new Date("2025-08-28") },
  { title: "A Guide to Kenya's National Parks", slug: "guide-kenya-national-parks", excerpt: "The 23 parks, 28 reserves, and 5 sanctuaries — which are worth your time and which to skip.", content: para("Kenya has 23 national parks, 28 national reserves, and 5 sanctuaries — an impressive network covering about 8 percent of the country. The most visited are the Maasai Mara (technically a reserve, not a park), Amboseli, Tsavo East and West, Lake Nakuru, and Nairobi National Park. Each offers a different landscape and set of animals.", "Underrated: Samburu in the north, Meru in the centre, and Ol Pejeta Conservancy in Laikipia. These receive fewer visitors but offer excellent wildlife viewing and a more intimate experience. The coastal parks — Shimba Hills, Arabuko-Sokoke Forest, and the marine parks — are worth visiting if you are combining safari with beach.", "Planning a trip: pick two or three parks rather than trying to see them all. The distances are long, and the best experiences come from slow safaris where you spend three or four nights in one place. Book through a reputable operator; Kenya Wildlife Service requires licensed guides in most parks."), coverImage: img("photo-1564760055775-d63b17a55c44"), tags: "Wildlife,Safari,Planning", published: true, publishedAt: new Date("2025-08-15") },
  { title: "How to Choose a Safari Operator", slug: "choose-safari-operator", excerpt: "Questions to ask, red flags to watch for, and why KATO membership matters.", content: para("Choosing the right safari operator is the single most important decision in planning a Kenyan trip. The wrong operator can mean overcrowded vehicles, indifferent guides, and missed wildlife sightings. The right one can mean the trip of a lifetime. Ask questions, read reviews carefully, and check credentials before you book.", "Questions to ask: Is the company a member of KATO (Kenya Association of Tour Operators)? What is the vehicle capacity — do they guarantee a window seat for every guest? Are the guides KPSGA-certified? What are the payment terms, and what happens if a trip is cancelled due to weather or political unrest?", "Red flags: prices dramatically below the market average, no physical address or verifiable reviews, unwillingness to provide references, and pressure to pay the full amount upfront. KATO membership requires a formal application process and ongoing compliance; it is the single best signal of legitimacy. A good operator will happily answer every question and provide references from past clients."), coverImage: img("photo-1449965408869-eaa3f722e40d"), tags: "Planning,Safari,Operators", published: true, publishedAt: new Date("2025-08-02") },
  { title: "The Best Kenyan Beaches Beyond Diani", slug: "kenyan-beaches-beyond-diani", excerpt: "Watamu, Malindi, Lamu, Kilifi, and Tiwi — quieter alternatives to the famous south coast.", content: para("Diani is deservedly famous, but it is not the only spectacular beach in Kenya. Watamu is smaller and quieter, with a marine park right offshore and a laid-back Italian-inflected town. Malindi has more history — Vasco da Gama Pillar, the Gedi ruins, and a Swahili old town alongside its beaches.", "Lamu is the most distinctive: the main island has no cars, and the nearby Manda and Shela beaches are among the most beautiful in East Africa. Kilifi is a smaller town with a growing expat community and easy access to Bofa Beach. Tiwi is a quiet stretch south of Diani with cliffs and caves.", "Each has its own character. Watamu for families and divers, Malindi for history and Italian food, Lamu for culture and quiet, Kilifi for a low-key getaway, and Tiwi for solitude. All are reachable from Mombasa or via Malindi and Lamu airports. Book ahead in December and January, when Kenyans and Europeans both head to the coast."), coverImage: img("photo-1544551763-77ef2d0cfc6c"), tags: "Beach,Coast,Planning", published: true, publishedAt: new Date("2025-07-20") },
  { title: "Understanding Kenya's Tourism Licensing", slug: "kenya-tourism-licensing", excerpt: "What TRA and KTB do, and what it means for travellers choosing operators.", content: para("Kenya's tourism industry is regulated by the Tourism Regulatory Authority (TRA), established under the Tourism Act of 2011. TRA licenses tourism enterprises — tour operators, hotels, lodges, restaurants, and travel agencies — across a range of classes, from Class A (international five-star) to Class E (budget). Every legitimate operator should have a TRA license number.", "The Kenya Tourism Board (KTB) is the marketing arm of the government, responsible for promoting Kenya as a destination. KTB does not regulate; it markets. Many operators are members of KTB's trade programs, and some hold memberships in KATO (Kenya Association of Tour Operators) or KAHC (Kenya Association of Hotelkeepers and Caterers).", "For travellers: check that your operator has a current TRA license and is a KATO member. Both are signals of legitimacy and compliance. The TRA registry is searchable online. If an operator cannot produce a license number on request, treat that as a red flag and choose another provider."), coverImage: img("photo-1547471080-7cc2caa01a7e"), tags: "Planning,Licensing,Regulation", published: true, publishedAt: new Date("2025-07-05") },
];

export async function seedPosts(ctx: SeedContext) {
  let created = 0;
  let updated = 0;

  for (const p of POSTS) {
    const existing = await ctx.prisma.post.findUnique({
      where: { slug: p.slug },
      select: { id: true },
    });

    if (existing) {
      await ctx.prisma.post.update({
        where: { id: existing.id },
        data: {
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.coverImage,
          tags: p.tags,
          published: p.published,
          publishedAt: p.publishedAt,
        },
      });
      updated++;
    } else {
      await ctx.prisma.post.create({ data: p });
      created++;
    }
  }

  const featuredCount = POSTS.filter((p) => p.tags.includes("Featured")).length;
  console.log(`✔ Posts: ${POSTS.length} (${created} created, ${updated} updated, ${featuredCount} featured)`);
}