import { describe, it, expect, vi, beforeEach } from "vitest";

const {
    mockAddDoc,
    mockUpdateDoc,
    mockDeleteDoc,
    mockOnSnapshot,
    mockQuery,
    mockWhere,
    mockOrderBy,
    mockDoc,
    mockCollection,
} = vi.hoisted(() => ({
    mockAddDoc: vi.fn(),
    mockUpdateDoc: vi.fn(),
    mockDeleteDoc: vi.fn(),
    mockOnSnapshot: vi.fn(),
    mockQuery: vi.fn(),
    mockWhere: vi.fn(),
    mockOrderBy: vi.fn(),
    mockDoc: vi.fn(),
    mockCollection: vi.fn(),
}));


vi.mock("firebase/firestore", () => ({
    collection: (...args: unknown[]) => mockCollection(...args),
    addDoc: (...args: unknown[]) => mockAddDoc(...args),
    updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
    deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
    doc: (...args: unknown[]) => mockDoc(...args),
    query: (...args: unknown[]) => mockQuery(...args),
    where: (...args: unknown[]) => mockWhere(...args),
    orderBy: (...args: unknown[]) => mockOrderBy(...args),
    onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
}));


vi.mock("./firebase", () => ({
    db: { __fakeDb: true },
}));

import {
    createTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
    subscribeToUserTasks,
} from "./firestore";

beforeEach(() => {
    vi.clearAllMocks();
    mockDoc.mockReturnValue({ __docRef: true });
});

describe("firestore service", () => {
    it("createTask llama a addDoc con userId, completed en false y createdAt", async () => {
        mockAddDoc.mockResolvedValue(undefined);

        await createTask("user-1", { title: "Comprar pan", description: "" });

        expect(mockAddDoc).toHaveBeenCalledTimes(1);
        const [, payload] = mockAddDoc.mock.calls[0];
        expect(payload).toMatchObject({
            title: "Comprar pan",
            description: "",
            userId: "user-1",
            completed: false,
        });
        expect(typeof payload.createdAt).toBe("number");
    });

    it("toggleTaskCompleted llama a updateDoc con el nuevo estado de completado", async () => {
        mockUpdateDoc.mockResolvedValue(undefined);

        await toggleTaskCompleted("task-1", true);

        expect(mockDoc).toHaveBeenCalledWith({ __fakeDb: true }, "tasks", "task-1");
        expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { completed: true });
    });

    it("updateTask llama a updateDoc solo con los campos editados", async () => {
        mockUpdateDoc.mockResolvedValue(undefined);

        await updateTask("task-1", { title: "Nuevo titulo" });

        expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { title: "Nuevo titulo" });
    });

    it("deleteTask llama a deleteDoc con el id correcto", async () => {
        mockDeleteDoc.mockResolvedValue(undefined);

        await deleteTask("task-1");

        expect(mockDoc).toHaveBeenCalledWith({ __fakeDb: true }, "tasks", "task-1");
        expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
    });

    it("subscribeToUserTasks arma la query filtrando por userId y ordenando por fecha", () => {
        const onChange = vi.fn();
        const onError = vi.fn();
        mockOnSnapshot.mockReturnValue(() => { });

        subscribeToUserTasks("user-1", onChange, onError);

        expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-1");
        expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "desc");
        expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
    });

    it("subscribeToUserTasks transforma los documentos de Firestore en tareas tipadas", () => {
        const onChange = vi.fn();
        const onError = vi.fn();

        mockOnSnapshot.mockImplementation((_q, successCallback) => {
            successCallback({
                docs: [
                    {
                        id: "1",
                        data: () => ({
                            title: "Tarea 1",
                            description: "",
                            userId: "user-1",
                            completed: false,
                            createdAt: 1,
                        }),
                    },
                ],
            });
            return () => { };
        });

        subscribeToUserTasks("user-1", onChange, onError);

        expect(onChange).toHaveBeenCalledWith([
            { id: "1", title: "Tarea 1", description: "", userId: "user-1", completed: false, createdAt: 1 },
        ]);
    });

    it("subscribeToUserTasks llama a onError si Firestore devuelve un error", () => {
        const onChange = vi.fn();
        const onError = vi.fn();
        const fakeError = new Error("permission-denied");

        mockOnSnapshot.mockImplementation((_q, _successCallback, errorCallback) => {
            errorCallback(fakeError);
            return () => { };
        });

        subscribeToUserTasks("user-1", onChange, onError);

        expect(onError).toHaveBeenCalledWith(fakeError);
        expect(onChange).not.toHaveBeenCalled();
    });
});