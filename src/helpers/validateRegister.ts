export interface RegisterFormData {
    email: string;
    password: string;
}

export function validateRegister(form: RegisterFormData): string | null {
    if (!form.email.includes("@") || !form.email.includes(".")) return "Email invalido.";
    if (form.password.length < 6) return "La contrasena debe tener al menos 6 caracteres.";
    return null;
}
