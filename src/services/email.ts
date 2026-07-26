interface TaskSummaryItem {
    title: string;
    completed: boolean;
}

/**
 * Llama a la funcion serverless de Vercel (api/send-summary.ts), que es la
 * que realmente manda el email por AWS SES. Las credenciales de AWS nunca
 * viajan al navegador: solo existen del lado del servidor.
 */
export async function sendTaskSummaryEmail(email: string, tasks: TaskSummaryItem[]) {
    const response = await fetch("/api/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tasks }),
    });

    if (!response.ok) {
        throw new Error("No se pudo enviar el resumen por email.");
    }

    return response.json();
}
