import { Task, Filter } from "@/lib/types";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
}

export function TaskList({ tasks, filter }: TaskListProps) {
  if (tasks.length === 0) {
    return (
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
        {filter === "done" ? "nothing done yet" : "all clear"}
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task, i) => (
        <TaskItem key={task.id} task={task} index={i} />
      ))}
    </div>
  );
}
