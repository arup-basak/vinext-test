export type Priority = "high" | "mid" | "low";
export type Filter = "all" | "active" | "done";

export interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: string;
  createdAt: Date;
}

export const PRIORITY_LABELS: Record<string, string> = {
  high: "!!",
  mid: "! ",
  low: "  ",
};

export const PRIORITY_COLORS: Record<string, string> = {
  high: "#ff4d4d",
  mid: "#f5a623",
  low: "#a8a8a8",
};
