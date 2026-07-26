import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskFormData } from "../types/task";

const tasksCollection = collection(db, "tasks");

/**
 * Se suscribe en tiempo real a las tareas del usuario logueado.
 * Devuelve una funcion "unsubscribe" para cortar la suscripcion en el useEffect.
 *
 * OJO: where + orderBy juntos piden un indice compuesto en Firestore.
 * La primera vez que corras esto la consola te va a tirar un link para crearlo
 * desde la consola de Firebase (tarda 1-2 minutos en generarse).
 */
export function subscribeToUserTasks(
    userId: string,
    onChange: (tasks: Task[]) => void,
    onError: (error: unknown) => void
) {
    const q = query(
        tasksCollection,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const tasks: Task[] = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...(docSnap.data() as Omit<Task, "id">),
            }));
            onChange(tasks);
        },
        onError
    );
}

export async function createTask(userId: string, data: TaskFormData) {
    await addDoc(tasksCollection, {
        ...data,
        userId,
        completed: false,
        createdAt: Date.now(),
    });
}

export async function updateTask(taskId: string, data: Partial<TaskFormData>) {
    await updateDoc(doc(db, "tasks", taskId), { ...data });
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
    await updateDoc(doc(db, "tasks", taskId), { completed });
}

export async function deleteTask(taskId: string) {
    await deleteDoc(doc(db, "tasks", taskId));
}
