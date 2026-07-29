export interface LoginFormData {
    email: string;
    password: string;
}

export function validateLogin(form: LoginFormData): string | null {
    if (!form.email.includes("@") || !form.email.includes(".")) return "Email inválido.";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    return null;
}
