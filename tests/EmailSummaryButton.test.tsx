import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmailSummaryButton from "../src/components/EmailSummaryButton/EmailSummaryButton";

describe("EmailSummaryButton", () => {
    it("muestra 'Resumen enviado.' cuando onSend resuelve correctamente", async () => {
        const onSend = vi.fn().mockResolvedValue(undefined);
        render(<EmailSummaryButton onSend={onSend} />);

        fireEvent.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

        await waitFor(() => {
            expect(screen.getByText(/resumen enviado/i)).toBeInTheDocument();
        });
        expect(onSend).toHaveBeenCalledTimes(1);
    });

    it("muestra un mensaje de error cuando el serverless de email falla", async () => {
        const onSend = vi.fn().mockRejectedValue(new Error("Error al enviar el email"));
        render(<EmailSummaryButton onSend={onSend} />);

        fireEvent.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

        await waitFor(() => {
            expect(screen.getByText(/no se pudo enviar el resumen/i)).toBeInTheDocument();
        });
    });

    it("deshabilita el boton mientras esta enviando", async () => {
        let resolveSend: () => void = () => { };
        const onSend = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveSend = resolve;
                })
        );
        render(<EmailSummaryButton onSend={onSend} />);

        const button = screen.getByRole("button", { name: /enviar resumen por email/i });
        fireEvent.click(button);

        expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();

        resolveSend();
        await waitFor(() => {
            expect(screen.getByText(/resumen enviado/i)).toBeInTheDocument();
        });
    });
});