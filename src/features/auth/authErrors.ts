const errorMessages: Record<string, string> = {
    "auth/invalid-credential": "Credenciales invalidas. Verifica tu email y contrasena.",
    "auth/user-not-found": "No existe una cuenta con ese email.",
    "auth/wrong-password": "Contrasena incorrecta.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
    "auth/weak-password": "La contrasena debe tener al menos 6 caracteres.",
    "auth/invalid-email": "El formato del email no es valido.",
    "auth/too-many-requests": "Demasiados intentos fallidos. Intenta de nuevo mas tarde.",
};

export function getAuthErrorMessage(error: unknown): string {
    if (error !== null && typeof error === "object" && "code" in error) {
        const code = (error as { code: string }).code;
        return errorMessages[code] || "Error de autenticacion. Intenta de nuevo.";
    }

    return "Error inesperado. Intenta de nuevo.";
}
