import type { Task } from "../../types/task";
import "./TaskItem.css";

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
    return (
        <li className={`task-item${task.completed ? " task-item--done" : ""}`}>
            <input
                className="task-item__checkbox"
                type="checkbox"
                checked={task.completed}
                onChange={onToggle}
                title={task.completed ? "Volver a pendiente" : "Marcar como completada"}
            />
            <div className="task-item__content">
                <span className="task-item__title">{task.title}</span>
                {task.description && (
                    <span className="task-item__description">{task.description}</span>
                )}
            </div>
            <div className="task-item__actions">
                <button className="task-item__btn" type="button" onClick={onEdit}>
                    Editar
                </button>
                <button
                    className="task-item__btn task-item__btn--delete"
                    type="button"
                    onClick={onDelete}
                >
                    Eliminar
                </button>
            </div>
        </li>
    );
}

export default TaskItem;