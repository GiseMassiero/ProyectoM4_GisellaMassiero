import type { Task } from "../../types/task";
import TaskItem from "../TaskItem/TaskItem";
import "./TaskList.css";

interface TaskListProps {
    tasks: Task[];
    onToggle: (task: Task) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
    if (tasks.length === 0) {
        return <p className="task-empty">No hay tareas todavía. Agregá la primera.</p>;
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => onToggle(task)}
                    onDelete={() => onDelete(task.id)}
                    onEdit={() => onEdit(task)}
                />
            ))}
        </ul>
    );
}

export default TaskList;
