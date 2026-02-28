"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Task, Filter } from "@/lib/types";
import { TaskInput } from "./task-input";
import { TaskFilters } from "./task-filters";
import { TaskList } from "./task-list";

export const TASKS_KEY = ["tasks"] as const;

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export function TaskBoard() {
  const [filter, setFilter] = useState<Filter>("all");

  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: TASKS_KEY,
    queryFn: fetchTasks,
  });

  const filtered = allTasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const counts: Record<Filter, number> = {
    all: allTasks.length,
    active: allTasks.filter((t) => !t.done).length,
    done: allTasks.filter((t) => t.done).length,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e8e8e8",
        fontFamily: "var(--font-geist-mono), monospace",
        padding: "clamp(1.5rem, 5vw, 4rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          borderBottom: "1px solid #2a2a2a",
          paddingBottom: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#c8f542",
              lineHeight: 1,
            }}
          >
            TASKS
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#444",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {isLoading ? "loading..." : `${counts.active} remaining`}
          </span>
        </div>
      </div>

      {/* Input */}
      <div style={{ width: "100%", maxWidth: "680px", marginBottom: "2rem" }}>
        <TaskInput />
      </div>

      {/* Filters */}
      <div style={{ width: "100%", maxWidth: "680px", marginBottom: "1.5rem" }}>
        <TaskFilters filter={filter} setFilter={setFilter} counts={counts} />
      </div>

      {/* Task list */}
      <div style={{ width: "100%", maxWidth: "680px" }}>
        {isLoading ? (
          <div
            style={{
              padding: "3rem 0",
              textAlign: "center",
              color: "#2a2a2a",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            loading...
          </div>
        ) : (
          <TaskList tasks={filtered} filter={filter} />
        )}
      </div>

      {/* Footer */}
      {allTasks.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            marginTop: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            color: "#222",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>{allTasks.length} total tasks</span>
          <span>double-click to edit</span>
        </div>
      )}
    </div>
  );
}
