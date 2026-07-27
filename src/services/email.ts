interface TaskSummaryItem {
    title: string;
    completed: boolean;
}

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
