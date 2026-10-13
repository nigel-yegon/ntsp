// app/components/dashboard/message-list.tsx
import type { Message } from "@/lib/db-types";

export function MessageList({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: string;
}) {
  if (messages.length === 0) {
    return (
      <p className="p-5 text-sm text-deep-500 dark:text-cream-400">
        No messages yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-cream-200 dark:divide-deep-800">
      {messages.map((m) => {
        const mine = m.authorId === currentUserId;
        return (
          <li
            key={m.id}
            className={`flex ${mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                mine
                  ? "bg-brand-400 text-deep-800"
                  : "bg-cream-100 text-deep-800 dark:bg-deep-800 dark:text-cream-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.body}</p>
              <p
                className={`mt-1 text-xs ${
                  mine
                    ? "text-deep-700/70"
                    : "text-deep-500 dark:text-cream-400"
                }`}
              >
                {m.createdAt.toLocaleString()}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}