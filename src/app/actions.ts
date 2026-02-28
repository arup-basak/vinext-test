"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addTask(text: string, priority: string) {
  await db.insert(tasks).values({ text, priority });
}

export async function toggleTask(id: number, done: boolean) {
  await db.update(tasks).set({ done: !done }).where(eq(tasks.id, id));
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
}

export async function updateTaskText(id: number, text: string) {
  await db.update(tasks).set({ text }).where(eq(tasks.id, id));
}

export async function clearDone() {
  await db.delete(tasks).where(eq(tasks.done, true));
}
