import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskList from "../src/components/TaskList/TaskList";
import type { Task } from "../src/types/task";

const tasks: Task[] = [
    { id: "1", userId: "u1", title: "Tarea 1", description: "", completed: false, createdAt: 1 },
    { id: "2", userId: "u1", title: "Tarea 2", description: "", completed: true, createdAt: 2 },
];

describe("TaskList", () => {
    it("muestra el mensaje vacio cuando no hay tareas", () => {
        render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
        expect(screen.getByText(/no hay tareas todavía/i)).toBeInTheDocument();
    });

    it("renderiza una tarea por cada item de la lista", () => {
        render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
        expect(screen.getByText("Tarea 1")).toBeInTheDocument();
        expect(screen.getByText("Tarea 2")).toBeInTheDocument();
    });
});
