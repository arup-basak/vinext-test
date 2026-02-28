"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Priority, PRIORITY_COLORS } from "@/lib/types";
import { addTask } from "@/app/actions";
import { TASKS_KEY } from "./task-board";
import { toast } from "sonner";

export function TaskInput() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("mid");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ text, priority }: { text: string; priority: string }) =>
      addTask(text, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      setInput("");
      toast.success("Task added");
      inputRef.current?.focus();
    },
    onError: () => toast.error("Failed to add task"),
  });

  function handleAdd() {
    const text = input.trim();
    if (!text) return;
    mutate({ text, priority });
  }

  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #2a2a2a",
        background: "#111",
        opacity: isPending ? 0.7 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {/* Priority selector */}
      <div
        style={{ display: "flex", flexDirection: "column", borderRight: "1px solid #2a2a2a" }}
      >
        {(["high", "mid", "low"] as Priority[]).map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            style={{
              flex: 1,
              padding: "0 0.75rem",
              background: priority === p ? "#1a1a1a" : "transparent",
              border: "none",
              borderBottom: p !== "low" ? "1px solid #2a2a2a" : "none",
              cursor: "pointer",
              fontSize: "0.6rem",
              fontFamily: "inherit",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: priority === p ? PRIORITY_COLORS[p] : "#333",
              transition: "all 0.1s",
              minWidth: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: priority === p ? PRIORITY_COLORS[p] : "#333",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {p}
          </button>
        ))}
      </div>

      {/* Text input */}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="new task... press enter"
        disabled={isPending}
        style={{
          flex: 1,
          padding: "1rem 1.25rem",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#e8e8e8",
          fontFamily: "inherit",
          fontSize: "0.85rem",
          letterSpacing: "0.02em",
        }}
      />

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={isPending}
        style={{
          padding: "0 1.5rem",
          background: "#c8f542",
          border: "none",
          cursor: isPending ? "not-allowed" : "pointer",
          color: "#0a0a0a",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!isPending)
            (e.target as HTMLButtonElement).style.background = "#d4f76a";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background = "#c8f542";
        }}
      >
        {isPending ? "..." : "ADD"}
      </button>
    </div>
  );
}
