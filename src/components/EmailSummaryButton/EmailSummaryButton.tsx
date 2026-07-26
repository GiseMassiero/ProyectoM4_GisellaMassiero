import { useState } from "react";
import "./EmailSummaryButton.css";

type SendStatus = "idle" | "loading" | "success" | "error";

interface EmailSummaryButtonProps {
    onSend: () => Promise<void>;
}

function EmailSummaryButton({ onSend }: EmailSummaryButtonProps) {
    const [status, setStatus] = useState<SendStatus>("idle");

    const handleClick = async () => {
        setStatus("loading");
        try {
            await onSend();
            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <div className="email-summary">
            <button
                className="email-summary__btn"
                type="button"
                onClick={handleClick}
                disabled={status === "loading"}
            >
                {status === "loading" ? "Enviando..." : "Enviar resumen por email"}
            </button>
            {status === "success" && <p className="email-summary__success">Resumen enviado.</p>}
            {status === "error" && <p className="email-summary__error">No se pudo enviar el resumen.</p>}
        </div>
    );
}

export default EmailSummaryButton;
