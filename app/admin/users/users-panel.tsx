// app/admin/users/users-panel.tsx
"use client";

import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import { Role } from "@/lib/generated/prisma/client";
import {
  listUsers,
  listGroups,
  createGroup,
  deleteGroup,
  updateUserDetails,
  deleteUser,
  type UserRow,
  type GroupRow,
} from "../actions/users";

const ALL_ROLES: Role[] = [
  "EMPLOYER", "CUSTOMER", "BUSINESS", "OPERATOR",
  "PERUSER", "VERIFIER", "COMMITTEE_MEMBER", "PERMANENT_SECRETARY", "ADMIN",
];

// Theme-consistent color mapping for each role
const ROLE_STYLES: Record<Role, string> = {
  EMPLOYER:
    "bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300",
  CUSTOMER:
    "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  BUSINESS:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  OPERATOR:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  PERUSER:
    "bg-cream-200 text-deep-700 dark:bg-deep-800 dark:text-cream-300",
  VERIFIER:
    "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  COMMITTEE_MEMBER:
    "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
  PERMANENT_SECRETARY:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
  ADMIN:
    "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300",
};

type SortOption = "name_asc" | "name_desc" | "email_asc" | "email_desc" | "role_asc";
const ITEMS_PER_PAGE = 10;

export function UsersPanel({ search }: { search: string }) {
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  // Sorting, Filtering & Pagination
  const [sortBy, setSortBy] = useState<SortOption>("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [groupFilter, setGroupFilter] = useState<string | "ALL">("ALL");

  // Modal State
  const [modalState, setModalState] = useState<{
    type: "view" | "edit" | "delete";
    user: UserRow;
  } | null>(null);

  const createGroupFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [u, g] = await Promise.all([listUsers(), listGroups()]);
      setUsers(u);
      setGroups(g);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, roleFilter, groupFilter]);

  const processedUsers = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = users.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesGroup = groupFilter === "ALL" || u.groups.some((g) => g.id === groupFilter);
      return matchesSearch && matchesRole && matchesGroup;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        case "email_asc": return a.email.localeCompare(b.email);
        case "email_desc": return b.email.localeCompare(a.email);
        case "role_asc": return a.role.localeCompare(b.role);
        default: return 0;
      }
    });
  }, [users, search, sortBy, roleFilter, groupFilter]);

  const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleDeleteGroup(groupId: string) {
    if (!confirm("Delete this group? Users will be unassigned.")) return;
    if (groupFilter === groupId) setGroupFilter("ALL");
    
    startTransition(async () => {
      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    });
  }

  function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!createGroupFormRef.current) return;
    const formData = new FormData(createGroupFormRef.current);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    if (!name) return;

    startTransition(async () => {
      await createGroup(name, description);
      const updatedGroups = await listGroups();
      setGroups(updatedGroups);
      createGroupFormRef.current?.reset();
    });
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-deep-200 bg-cream-50 dark:border-deep-800 dark:bg-deep-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-deep-200 dark:border-deep-800">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-semibold transition ${
            activeTab === "users"
              ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
              : "text-deep-500 hover:text-deep-800 dark:text-cream-400 dark:hover:text-cream-200"
          }`}
        >
          System Users
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`pb-3 text-sm font-semibold transition ${
            activeTab === "groups"
              ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
              : "text-deep-500 hover:text-deep-800 dark:text-cream-400 dark:hover:text-cream-200"
          }`}
        >
          User Groups
        </button>
      </div>

      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-4 rounded-xl border border-deep-200 bg-cream-50 p-4 dark:border-deep-800 dark:bg-deep-900">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-deep-500 dark:text-cream-500">Role:</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as Role | "ALL")}
                  className="rounded-lg border border-deep-200 bg-cream-100 px-3 py-1.5 text-xs text-deep-800 outline-none transition focus:border-brand-500 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
                >
                  <option value="ALL">All Roles</option>
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-deep-500 dark:text-cream-500">Group:</label>
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="rounded-lg border border-deep-200 bg-cream-100 px-3 py-1.5 text-xs text-deep-800 outline-none transition focus:border-brand-500 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
                >
                  <option value="ALL">All Groups</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-deep-500 dark:text-cream-500">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-lg border border-deep-200 bg-cream-100 px-3 py-1.5 text-xs text-deep-800 outline-none transition focus:border-brand-500 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100"
                >
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="email_asc">Email (A-Z)</option>
                  <option value="email_desc">Email (Z-A)</option>
                  <option value="role_asc">Role (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {paginatedUsers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-deep-300 bg-cream-50 p-8 text-center dark:border-deep-700 dark:bg-deep-900">
                <p className="text-sm text-deep-500 dark:text-cream-400">No users match your criteria.</p>
              </div>
            ) : (
              paginatedUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col gap-4 rounded-2xl border border-deep-200 bg-cream-50 p-4 md:flex-row md:items-center md:justify-between dark:border-deep-800 dark:bg-deep-900"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-deep-800 dark:text-cream-100">{u.name}</h3>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ROLE_STYLES[u.role]}`}
                      >
                        {u.role.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="truncate text-xs text-deep-500 dark:text-cream-500 mt-1">{u.email}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => setModalState({ type: "view", user: u })}
                      className="rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-xs font-semibold text-deep-700 transition hover:bg-cream-200 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-300 dark:hover:bg-deep-800"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setModalState({ type: "edit", user: u })}
                      className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-950/70"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setModalState({ type: "delete", user: u })}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
             <div className="flex items-center justify-between border-t border-deep-200 pt-4 dark:border-deep-800">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="rounded-lg border border-deep-200 bg-cream-50 px-3 py-1.5 text-xs font-medium text-deep-700 transition hover:bg-cream-100 disabled:opacity-50 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-300 dark:hover:bg-deep-800"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page} 
                    onClick={() => setCurrentPage(page)} 
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                      currentPage === page 
                        ? "bg-brand-500 text-white dark:bg-brand-600" 
                        : "text-deep-600 hover:bg-cream-100 dark:text-cream-400 dark:hover:bg-deep-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
                className="rounded-lg border border-deep-200 bg-cream-50 px-3 py-1.5 text-xs font-medium text-deep-700 transition hover:bg-cream-100 disabled:opacity-50 dark:border-deep-800 dark:bg-deep-900 dark:text-cream-300 dark:hover:bg-deep-800"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === "groups" && (
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.id} className="flex items-center justify-between rounded-xl border border-deep-200 bg-cream-50 p-4 dark:border-deep-800 dark:bg-deep-900">
                <div>
                  <h3 className="font-semibold text-deep-800 dark:text-cream-100">{g.name}</h3>
                  <p className="text-xs text-deep-500 dark:text-cream-500">{g.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-cream-200 px-2 py-1 text-xs font-medium text-deep-700 dark:bg-deep-800 dark:text-cream-300">{g._count.users} users</span>
                  <button onClick={() => handleDeleteGroup(g.id)} className="text-xs font-medium text-red-600 hover:underline dark:text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className="h-fit rounded-2xl border border-deep-200 bg-cream-50 p-5 dark:border-deep-800 dark:bg-deep-900">
            <h3 className="mb-4 text-sm font-semibold text-deep-800 dark:text-cream-100">Create New Group</h3>
            <form ref={createGroupFormRef} onSubmit={handleCreateGroup} className="space-y-3">
              <input name="name" placeholder="Group Name" required className="w-full rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-800 placeholder:text-deep-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500" />
              <input name="description" placeholder="Description" className="w-full rounded-lg border border-deep-200 bg-cream-100 px-3 py-2 text-sm text-deep-800 placeholder:text-deep-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100 dark:placeholder:text-cream-500" />
              <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400">
                {pending ? "Creating..." : "Create Group"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Layer */}
      {modalState && (
        <UserModal
          type={modalState.type}
          user={modalState.user}
          groups={groups}
          onClose={() => setModalState(null)}
          onUpdate={(updatedUser) => {
            setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
            setModalState(null);
          }}
          onDelete={() => {
            setUsers((prev) => prev.filter((u) => u.id !== modalState.user.id));
            setModalState(null);
          }}
        />
      )}
    </div>
  );
}

// ─── User Modal Component ─────────────────────────────────────────

function UserModal({
  type,
  user,
  groups,
  onClose,
  onUpdate,
  onDelete,
}: {
  type: "view" | "edit" | "delete";
  user: UserRow;
  groups: GroupRow[];
  onClose: () => void;
  onUpdate: (u: UserRow) => void;
  onDelete: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<Role>(user.role);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(user.groups.map(g => g.id));

  const isEdit = type === "edit";
  const isDelete = type === "delete";

  function handleSave() {
    startTransition(async () => {
      await updateUserDetails(user.id, { name, email, role });
      onUpdate({
        ...user,
        name,
        email,
        role,
        groups: groups.filter(g => selectedGroups.includes(g.id)).map(g => ({ id: g.id, name: g.name }))
      });
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteUser(user.id);
      onDelete();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-deep-950/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Body */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-deep-200 bg-cream-50 shadow-2xl dark:border-deep-800 dark:bg-deep-900">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-deep-200 px-6 py-4 dark:border-deep-800">
          <h3 className="text-lg font-bold text-deep-800 dark:text-cream-100">
            {type === "view" ? "User Details" : type === "edit" ? "Edit User" : "Delete User"}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-deep-400 transition hover:bg-cream-200 hover:text-deep-700 dark:text-cream-500 dark:hover:bg-deep-800 dark:hover:text-cream-100">
             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {isDelete ? (
             <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p className="text-sm text-deep-700 dark:text-cream-300">
                   Are you sure you want to delete <strong className="text-deep-900 dark:text-cream-100">{user.name}</strong>?
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                   This action is permanent and will remove all associated data (bookings, messages, etc.).
                </p>
                <div className="flex justify-center gap-3 pt-4">
                    <button onClick={onClose} className="rounded-lg border border-deep-200 bg-cream-100 px-4 py-2 text-sm font-medium text-deep-700 transition hover:bg-cream-200 dark:border-deep-700 dark:bg-deep-800 dark:text-cream-300 dark:hover:bg-deep-700">Cancel</button>
                    <button onClick={handleDelete} disabled={pending} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50">
                        {pending ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
             </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">Name</span>
                  <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    disabled={!isEdit} 
                    className={`w-full rounded-lg border border-deep-200 px-3 py-2 text-sm text-deep-800 transition ${isEdit ? "bg-cream-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100" : "border-transparent bg-transparent dark:text-cream-100"}`} 
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">Email</span>
                  <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    disabled={!isEdit} 
                    className={`w-full rounded-lg border border-deep-200 px-3 py-2 text-sm text-deep-800 transition ${isEdit ? "bg-cream-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100" : "border-transparent bg-transparent dark:text-cream-100"}`} 
                  />
                </label>
              </div>

              <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">System Role</span>
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value as Role)} 
                    disabled={!isEdit} 
                    className={`w-full rounded-lg border border-deep-200 px-3 py-2 text-sm text-deep-800 transition ${isEdit ? "bg-cream-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-950 dark:text-cream-100" : "border-transparent bg-transparent dark:text-cream-100"}`}
                  >
                    {ALL_ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                  </select>
              </label>

              <div>
                <span className="mb-2 block text-xs font-semibold text-deep-700 dark:text-cream-300">Assigned Groups</span>
                <div className="flex flex-wrap gap-2">
                  {groups.map(g => {
                    const isAssigned = selectedGroups.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          if (!isEdit) return;
                          setSelectedGroups(prev => isAssigned ? prev.filter(id => id !== g.id) : [...prev, g.id]);
                        }}
                        className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                          isAssigned 
                            ? "bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300" 
                            : "bg-cream-200 text-deep-500 dark:bg-deep-800 dark:text-cream-500"
                        } ${isEdit ? "cursor-pointer hover:opacity-80" : "cursor-default opacity-80"}`}
                        disabled={!isEdit}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isEdit && (
                <div className="flex justify-end gap-3 border-t border-deep-200 pt-4 dark:border-deep-800 mt-6">
                  <button onClick={onClose} className="rounded-lg border border-deep-200 bg-cream-100 px-4 py-2 text-sm font-medium text-deep-700 transition hover:bg-cream-200 dark:border-deep-700 dark:bg-deep-800 dark:text-cream-300 dark:hover:bg-deep-700">Cancel</button>
                  <button onClick={handleSave} disabled={pending} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50 dark:bg-brand-500 dark:text-deep-900 dark:hover:bg-brand-400">
                    {pending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}