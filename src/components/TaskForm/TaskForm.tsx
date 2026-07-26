import { useState } from "react";
import { validateTask } from "../../helpers/validateTask";
import type { TaskFormData } from "../../types/task";
import "./TaskForm.css";

type SubmitStatus = "idle" | "loading" | "error";

interface TaskFormProps {
    onAddTask: (data: TaskFormData) => Promise<void>;
}

function TaskForm({ onAddTask }: TaskFormProps) {
    const [form, setForm] = useState<TaskFormData>({ title: "", description: "" });
    const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
    const [status, setStatus] = useState<SubmitStatus>("idle");

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

        setErrors({});
        setStatus("loading");

        try {
            await onAddTask({ title: form.title.trim(), description: form.description.trim() });
            setForm({ title: "", description: "" });
            setStatus("idle");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit} noValidate>
            <div className="task-form__field">
                <input
                    className="task-form__input"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Titulo de la tarea"
                    disabled={status === "loading"}
                />
                {errors.title && <p className="task-form__error">{errors.title}</p>}
            </div>

            <div className="task-form__field">
                <textarea
                    className="task-form__textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descripcion (opcional)"
                    rows={2}
                    disabled={status === "loading"}
                />
                {errors.description && <p className="task-form__error">{errors.description}</p>}
            </div>

            <button
                className={`task-form__btn${status === "loading" ? " task-form__btn--loading" : ""}`}
                type="submit"
                disabled={status === "loading"}
            >
                {status === "loading" ? "Agregando..." : "Agregar tarea"}
            </button>

            {status === "error" && <p className="task-form__error">No se pudo agregar la tarea.</p>}
        </form>
    );
}

export default TaskForm;
