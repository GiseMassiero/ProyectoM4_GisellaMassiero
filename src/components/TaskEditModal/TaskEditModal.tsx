import { useState } from "react";
import { validateTask } from "../../helpers/validateTask";
import type { Task, TaskFormData } from "../../types/task";
import "./TaskEditModal.css";

interface TaskEditModalProps {
    task: Task;
    onSave: (id: string, data: TaskFormData) => Promise<void>;
    onCancel: () => void;
}

function TaskEditModal({ task, onSave, onCancel }: TaskEditModalProps) {
    const [form, setForm] = useState<TaskFormData>({
        title: task.title,
        description: task.description,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
    const [saving, setSaving] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validation = validateTask(form);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        setSaving(true);
        try {
            await onSave(task.id, form);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="task-edit-modal__overlay">
            <div className="task-edit-modal">
                <h3 className="task-edit-modal__title">Editar tarea</h3>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="task-edit-modal__field">
                        <input
                            className="task-edit-modal__input"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            disabled={saving}
                        />
                        {errors.title && <p className="task-edit-modal__error">{errors.title}</p>}
                    </div>
                    <div className="task-edit-modal__field">
                        <textarea
                            className="task-edit-modal__textarea"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                            disabled={saving}
                        />
                        {errors.description && (
                            <p className="task-edit-modal__error">{errors.description}</p>
                        )}
                    </div>
                    <div className="task-edit-modal__actions">
                        <button
                            type="button"
                            className="task-edit-modal__btn task-edit-modal__btn--cancel"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="task-edit-modal__btn" disabled={saving}>
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskEditModal;
