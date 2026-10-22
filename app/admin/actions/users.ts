// app/admin/actions/users.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma/client";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  groups: { id: string; name: string }[];
};

export type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  _count: { users: number };
};

export async function listUsers(search?: string): Promise<UserRow[]> {
  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      groups: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

export async function updateUserRole(userId: string, role: Role) {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin");
}

export async function listGroups(): Promise<GroupRow[]> {
  const groups = await prisma.userGroup.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { name: "asc" },
  });
  return groups;
}

export async function createGroup(name: string, description?: string) {
  await prisma.userGroup.create({
    data: { name, description },
  });
  revalidatePath("/admin");
}

export async function deleteGroup(groupId: string) {
  await prisma.userGroup.delete({
    where: { id: groupId },
  });
  revalidatePath("/admin");
}

export async function toggleUserGroup(userId: string, groupId: string, assign: boolean) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      groups: assign
        ? { connect: { id: groupId } }
        : { disconnect: { id: groupId } },
    },
  });
  revalidatePath("/admin");
}
export async function updateUserDetails(userId: string, data: { name: string; email: string; role: Role }) {
  await prisma.user.update({
    where: { id: userId },
    data: { name: data.name, email: data.email, role: data.role },
  });
  revalidatePath("/admin");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/admin");
}