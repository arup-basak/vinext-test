"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/types";
import { toggleTask, deleteTask, updateTaskText } from "@/app/actions";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { TASKS_KEY } from "./task-board";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  index: number;
}

export function TaskItem({ task, index }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: TASKS_KEY });
  }

  const toggleMutation = useMutation({
    mutationFn: () => toggleTask(task.id, task.done),
    onSuccess: () => {
      invalidate();
      toast(task.done ? "Marked active" : "Marked done");
    },
    onError: () => toast.error("Failed to update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      invalidate();
      toast.error("Task deleted");
    },
    onError: () => toast.error("Failed to delete task"),
  });

  const editMutation = useMutation({
    mutationFn: (text: string) => updateTaskText(task.id, text),
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
      setEditing(false);
    },
    onError: () => toast.error("Failed to update task"),
  });

  const [debouncedSave, cancelSave] = useDebouncedCallback((text: string) => {
    if (text && text !== task.text) {
      editMutation.mutate(text);
    }
  }, 600);

  function handleEditChange(value: string) {
    setEditText(value);
    debouncedSave(value.trim());
  }

  function handleCommit() {
    cancelSave();
    const text = editText.trim();
    if (!text || text === task.text) {
      setEditing(false);
      return;
    }
    editMutation.mutate(text);
  }

  function handleCancel() {
    cancelSave();
    setEditText(task.text);
    setEditing(false);
  }

  function startEdit() {
    setEditText(task.text);
    setEditing(true);
  }

  const isPending =
    toggleMutation.isPending || deleteMutation.isPending || editMutation.isPending;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.875rem 0",
        borderBottom: "1px solid #161616",
        opacity: isPending ? 0.5 : task.done ? 0.4 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {/* Index */}
      <span
        style={{
          fontSize: "0.6rem",
          color: "#2d2d2d",
          minWidth: "22px",
          textAlign: "right",
          letterSpacing: "0.05em",
          flexShrink: 0,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Priority dot */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: task.done ? "#2d2d2d" : PRIORITY_COLORS[task.priority],
          flexShrink: 0,
          boxShadow: task.done ? "none" : `0 0 6px ${PRIORITY_COLORS[task.priority]}66`,
        }}
      />

      {/* Checkbox */}
      <button
        onClick={() => toggleMutation.mutate()}
        disabled={isPending}
        style={{
          width: 18,
          height: 18,
          border: `1.5px solid ${task.done ? "#2d2d2d" : "#3a3a3a"}`,
          background: task.done ? "#1e1e1e" : "transparent",
          cursor: isPending ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      >
        {task.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#c8f542"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Task text / edit input */}
      {editing ? (
        <input
          autoFocus
          value={editText}
          onChange={(e) => handleEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCommit();
            if (e.key === "Escape") handleCancel();
          }}
          onBlur={handleCommit}
          style={{
            flex: 1,
            background: "#161616",
            border: "1px solid #2d2d2d",
            borderBottom: "1px solid #c8f542",
            outline: "none",
            color: "#e8e8e8",
            fontFamily: "inherit",
            fontSize: "0.85rem",
            padding: "0.2rem 0.5rem",
            letterSpacing: "0.02em",
          }}
        />
      ) : (
        <span
          onDoubleClick={() => !task.done && startEdit()}
          title={task.done ? "" : "double-click to edit"}
          style={{
            flex: 1,
            fontSize: "0.85rem",
            letterSpacing: "0.02em",
            textDecoration: task.done ? "line-through" : "none",
            textDecorationColor: "#2d2d2d",
            cursor: task.done ? "default" : "text",
            color: task.done ? "#3a3a3a" : "#e8e8e8",
            wordBreak: "break-word",
          }}
        >
          {task.text}
        </span>
      )}

      {/* Priority badge */}
      <span
        style={{
          fontSize: "0.58rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: task.done ? "#2d2d2d" : PRIORITY_COLORS[task.priority],
          flexShrink: 0,
          minWidth: "28px",
          textAlign: "right",
        }}
      >
        {PRIORITY_LABELS[task.priority]}
      </span>

      {/* Delete */}
      <button
        onClick={() => deleteMutation.mutate()}
        disabled={isPending}
        style={{
          width: 24,
          height: 24,
          background: "transparent",
          border: "none",
          cursor: isPending ? "not-allowed" : "pointer",
          color: "#2d2d2d",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          lineHeight: 1,
          transition: "color 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLButtonElement).style.color = "#ff4d4d")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLButtonElement).style.color = "#2d2d2d")
        }
      >
        ×
      </button>
    </div>
  );
}
