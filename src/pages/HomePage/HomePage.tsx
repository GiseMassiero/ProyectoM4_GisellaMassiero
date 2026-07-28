import { useEffect, useState } from "react";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskList from "../../components/TaskList/TaskList";
import TaskEditModal from "../../components/TaskEditModal/TaskEditModal";
import EmailSummaryButton from "../../components/EmailSummaryButton/EmailSummaryButton";
import { useAuth } from "../../features/auth/Authenticator";
import {
    subscribeToUserTasks,
    createTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
} from "../../services/firestore";
import { sendTaskSummaryEmail } from "../../services/email";
import type { Task, TaskFormData } from "../../types/task";
import "./HomePage.css";

type TaskFilter = "all" | "pending" | "done";

function HomePage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [filter, setFilter] = useState<TaskFilter>("all");

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const unsubscribe = subscribeToUserTasks(
            user.uid,
            (nextTasks) => {
                setTasks(nextTasks);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError("No se pudieron cargar las tareas.");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 4000);
    };

    const handleAddTask = async (data: TaskFormData) => {
        if (!user) return;
        await createTask(user.uid, data);
        showNotification("Tarea agregada.");
    };

    const handleToggle = async (task: Task) => {
        await toggleTaskCompleted(task.id, !task.completed);
    };

    const handleDelete = async (id: string) => {
        await deleteTask(id);
        showNotification("Tarea eliminada.");
    };

    const handleSaveEdit = async (id: string, data: TaskFormData) => {
        await updateTask(id, data);
        setEditingTask(null);
        showNotification("Tarea actualizada.");
    };

    const handleSendSummary = async () => {
        if (!user?.email) return;
        await sendTaskSummaryEmail(
            user.email,
            tasks.map((t) => ({ title: t.title, completed: t.completed }))
        );
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "pending") return !task.completed;
        if (filter === "done") return task.completed;
        return true;
    });

    return (
        <div className="home-page">
            <p className="home-page__greeting">
                Hola, <strong>{user?.email}</strong> 👋
            </p>

            <TaskForm onAddTask={handleAddTask} />

            {loading && <p className="home-page__status">Cargando tareas...</p>}
            {error && <p className="home-page__status home-page__status--error">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="home-page__tabs">
                        <button
                            type="button"
                            className={`home-page__tab${filter === "all" ? " home-page__tab--active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            Todas
                        </button>
                        <button
                            type="button"
                            className={`home-page__tab${filter === "pending" ? " home-page__tab--active" : ""}`}
                            onClick={() => setFilter("pending")}
                        >
                            Pendientes
                        </button>
                        <button
                            type="button"
                            className={`home-page__tab${filter === "done" ? " home-page__tab--active" : ""}`}
                            onClick={() => setFilter("done")}
                        >
                            Completadas
                        </button>
                    </div>

                    <TaskList
                        tasks={filteredTasks}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={setEditingTask}
                    />
                    <EmailSummaryButton onSend={handleSendSummary} />
                </>
            )}

            {editingTask && (
                <TaskEditModal
                    task={editingTask}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingTask(null)}
                />
            )}

            {notification && <p className="home-page__toast">{notification}</p>}
        </div>
    );
}

export default HomePage;