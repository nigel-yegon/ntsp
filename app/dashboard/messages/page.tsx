// app/dashboard/messages/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  if (session.user.role === "BUSINESS") {
    return <BusinessThreads userId={session.user.id} />;
  }
  return <CustomerThreads userId={session.user.id} />;
}

async function CustomerThreads({ userId }: { userId: string }) {
  const threads = await prisma.messageThread.findMany({
    where: { customerId: userId },
    orderBy: { updatedAt: "desc" },
    include: {
      business: {
        select: { businessProfile: { select: { businessName: true } } },
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: {
          messages: {
            where: { readByCustomer: false, authorId: { not: userId } },
          },
        },
      },
    },
  });

  return (
    <ThreadList
      heading="Messages"
      subheading="Conversations with lodges and tour operators."
      threads={threads}
      currentUserId={userId}
      emptyMessage="No conversations yet. Send an inquiry from a stay or package page to start one."
      counterpartyLabel={(t) =>
        t.business.businessProfile?.businessName ?? "Business"
      }
    />
  );
}

async function BusinessThreads({ userId }: { userId: string }) {
  const threads = await prisma.messageThread.findMany({
    where: { businessId: userId },
    orderBy: { updatedAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: {
          messages: {
            where: { readByBusiness: false, authorId: { not: userId } },
          },
        },
      },
    },
  });

  return (
    <ThreadList
      heading="Inquiries"
      subheading="Messages from travellers asking about your listings."
      threads={threads}
      currentUserId={userId}
      emptyMessage="No inquiries yet. They'll appear here when travellers write in from your listings."
      counterpartyLabel={(t) => t.customer.name}
    />
  );
}

type ThreadListProps = {
  heading: string;
  subheading: string;
  threads: Array<{
    id: string;
    subjectLabel: string;
    updatedAt: Date;
    messages: Array<{ body: string; authorId: string }>;
    _count: { messages: number };
    [k: string]: unknown;
  }>;
  currentUserId: string;
  emptyMessage: string;
  counterpartyLabel: (thread: any) => string;
};

function ThreadList({
  heading,
  subheading,
  threads,
  currentUserId,
  emptyMessage,
  counterpartyLabel,
}: ThreadListProps) {
  return (
    <section>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
          {heading}
        </h2>
        <p className="mt-1 text-sm text-deep-500 dark:text-cream-400">
          {subheading}
        </p>
      </header>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 p-10 text-center dark:border-deep-700 dark:bg-deep-900">
          <p className="text-sm text-deep-500 dark:text-cream-400">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {threads.map((t) => {
            const last = t.messages[0];
            const unread = t._count.messages;
            return (
              <li key={t.id}>
                <Link
                  href={`/dashboard/messages/${t.id}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-cream-300 bg-cream-50 p-4 transition hover:border-brand-400 dark:border-deep-700 dark:bg-deep-900 dark:hover:border-brand-500"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-deep-800 dark:text-cream-100">
                      {counterpartyLabel(t)}
                    </p>
                    <p className="mt-0.5 text-xs text-deep-500 dark:text-cream-400">
                      re: {t.subjectLabel}
                    </p>
                    {last && (
                      <p className="mt-1 line-clamp-1 text-sm text-deep-600 dark:text-cream-300">
                        {last.authorId === currentUserId ? "You: " : ""}
                        {last.body}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-xs text-deep-400 dark:text-cream-500">
                      {t.updatedAt.toLocaleDateString()}
                    </span>
                    {unread > 0 && (
                      <span className="rounded-full bg-brand-400 px-2 py-0.5 text-xs font-semibold text-deep-800">
                        {unread}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}