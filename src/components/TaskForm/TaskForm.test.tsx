import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskForm from "./TaskForm";

describe("TaskForm", () => {
    it("no llama a onAddTask si el titulo esta vacio", async () => {
        const onAddTask = vi.fn();
        render(<TaskForm onAddTask={onAddTask} />);

        fireEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

        await waitFor(() => {
            expect(onAddTask).not.toHaveBeenCalled();
        });
    });

    it("llama a onAddTask con los datos del formulario cuando es valido", async () => {
        const onAddTask = vi.fn().mockResolvedValue(undefined);
        render(<TaskForm onAddTask={onAddTask} />);

        fireEvent.change(screen.getByPlaceholderText(/titulo de la tarea/i), {
            target: { value: "Comprar pan" },
        });
        fireEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

        await waitFor(() => {
            expect(onAddTask).toHaveBeenCalledWith({ title: "Comprar pan", description: "" });
        });
    });
});
