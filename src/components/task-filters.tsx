"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Filter } from "@/lib/types";
import { clearDone } from "@/app/actions";
import { TASKS_KEY } from "./task-board";
import { toast } from "sonner";

interface TaskFiltersProps {
  filter: Filter;
  setFilter: (f: Filter) => void;
  counts: Record<Filter, number>;
}

export function TaskFilters({ filter, setFilter, counts }: TaskFiltersProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: clearDone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast("Cleared completed tasks");
    },
    onError: () => toast.error("Failed to clear tasks"),
  });

  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid #1e1e1e",
        opacity: isPending ? 0.5 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {(["all", "active", "done"] as Filter[]).map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: "0.5rem 1.25rem",
            background: "transparent",
            border: "none",
            borderBottom: filter === f ? "2px solid #c8f542" : "2px solid transparent",
            cursor: "pointer",
            color: filter === f ? "#c8f542" : "#444",
            fontFamily: "inherit",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            transition: "color 0.15s",
            marginBottom: "-1px",
          }}
        >
          {f}{" "}
          <span style={{ color: filter === f ? "#c8f542" : "#2d2d2d", marginLeft: "4px" }}>
            {counts[f]}
          </span>
        </button>
      ))}

      {counts.done > 0 && (
        <button
          onClick={() => mutate()}
          disabled={isPending}
          style={{
            marginLeft: "auto",
            padding: "0.5rem 0",
            background: "transparent",
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            color: "#333",
            fontFamily: "inherit",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "underline",
            textDecorationColor: "#2a2a2a",
          }}
          onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#ff4d4d")}
          onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = "#333")}
        >
          clear done
        </button>
      )}
    </div>
  );
}
