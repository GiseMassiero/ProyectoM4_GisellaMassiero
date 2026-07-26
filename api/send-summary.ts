// Esta funcion corre en el servidor de Vercel, NUNCA en el navegador.
// Aca si se pueden usar las credenciales de AWS de forma segura, porque
// viven como variables de entorno del lado del servidor (nunca en el bundle
// de React que descarga el usuario).
//
// Variables de entorno a configurar en Vercel
// (Project Settings > Environment Variables) y tambien en tu .env local:
//   AWS_ACCESS_KEY_ID
//   AWS_SECRET_ACCESS_KEY
//   AWS_REGION           <- ej: us-east-1
//   SES_SENDER_EMAIL     <- tiene que estar verificado en AWS SES
//
// Mientras tu cuenta de AWS este en modo "sandbox" (el estado por defecto),
// el email DESTINO tambien tiene que estar verificado en SES, o el envio va
// a fallar con "Email address not verified".

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

interface TaskSummaryItem {
    title: string;
    completed: boolean;
}

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

function buildSummaryHtml(tasks: TaskSummaryItem[]): string {
    const pendientes = tasks.filter((t) => !t.completed);
    const completadas = tasks.filter((t) => t.completed);

    const renderList = (items: TaskSummaryItem[]) =>
        items.length > 0
            ? `<ul>${items.map((t) => `<li>${t.title}</li>`).join("")}</ul>`
            : "<p>No hay tareas en esta categoria.</p>";

    return `
    <div style="font-family: sans-serif; color: #1e293b;">
      <h2>Resumen de tus tareas</h2>
      <p>Tenes <strong>${tasks.length}</strong> tarea(s) en total.</p>

      <h3>Pendientes (${pendientes.length})</h3>
      ${renderList(pendientes)}

      <h3>Completadas (${completadas.length})</h3>
      ${renderList(completadas)}
    </div>
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Metodo no permitido" });
    }

    const { email, tasks } = req.body as { email?: string; tasks?: TaskSummaryItem[] };

    if (!email) {
        return res.status(400).json({ error: "Falta el email del destinatario" });
    }

    const safeTasks = tasks ?? [];

    try {
        const command = new SendEmailCommand({
            Source: process.env.SES_SENDER_EMAIL,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: "Resumen de tus tareas - Gestor de tareas",
                    Charset: "UTF-8",
                },
                Body: {
                    Html: {
                        Data: buildSummaryHtml(safeTasks),
                        Charset: "UTF-8",
                    },
                },
            },
        });

        await sesClient.send(command);

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error("Error al enviar email con SES:", error);
        return res.status(500).json({ error: "Error al enviar el email" });
    }
}
