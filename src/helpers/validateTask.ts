import type { TaskFormData } from "../types/task";

export function validateTask(form: TaskFormData): Partial<Record<keyof TaskFormData, string>> {
    const errors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!form.title.trim()) {
        errors.title = "El titulo es obligatorio.";
    } else if (form.title.trim().length < 3) {
        errors.title = "Minimo 3 caracteres.";
    }

    if (form.description.length > 200) {
        errors.description = "Maximo 200 caracteres.";
    }

    return errors;
}
