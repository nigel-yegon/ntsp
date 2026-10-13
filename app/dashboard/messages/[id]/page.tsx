// app/dashboard/messages/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MessageList } from "@/app/components/dashboard/message-list";
import { MessageComposer } from "@/app/components/dashboard/message-composer";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const thread = await prisma.messageThread.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      business: {
        select: {
          id: true,
          businessProfile: { select: { businessName: true } },
        },
      },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!thread) notFound();

  const isCustomer = thread.customerId === session.user.id;
  const isBusiness = thread.businessId === session.user.id;
  if (!isCustomer && !isBusiness) notFound();

  // Mark messages from the other side as read by the current user.
  if (isCustomer) {
    await prisma.message.updateMany({
      where: {
        threadId: thread.id,
        authorId: { not: session.user.id },
        readByCustomer: false,
      },
      data: { readByCustomer: true },
    });
  } else {
    await prisma.message.updateMany({
      where: {
        threadId: thread.id,
        authorId: { not: session.user.id },
        readByBusiness: false,
      },
      data: { readByBusiness: true },
    });
  }

  const headerLabel = isBusiness
    ? `${thread.customer.name} (${thread.customer.email})`
    : thread.business.businessProfile?.businessName ?? "Business";

  return (
    <section className="space-y-4">
      <Link
        href="/dashboard/messages"
        className="text-sm text-deep-500 underline underline-offset-2 hover:text-brand-600 dark:text-cream-400"
      >
        ← Back to messages
      </Link>

      <div className="rounded-2xl border border-cream-300 bg-cream-50 dark:border-deep-700 dark:bg-deep-900">
        <header className="border-b border-cream-200 p-5 dark:border-deep-800">
          <h2 className="text-lg font-semibold text-deep-800 dark:text-cream-100">
            {headerLabel}
          </h2>
          <p className="mt-0.5 text-sm text-deep-500 dark:text-cream-400">
            re: {thread.subjectLabel}
          </p>
        </header>

        <MessageList
          messages={thread.messages}
          currentUserId={session.user.id}
        />

        <MessageComposer threadId={thread.id} />
      </div>
    </section>
  );
}