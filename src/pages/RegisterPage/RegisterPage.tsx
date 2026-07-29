import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateRegister } from "../../helpers/validateRegister";
import { getAuthErrorMessage } from "../../features/auth/authErrors";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import "./RegisterPage.css";

interface RegisterFormState {
    email: string;
    password: string;
}

type RegisterStatus = "idle" | "loading" | "success" | "error";

function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<RegisterFormState>({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<RegisterStatus>("idle");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validateRegister(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setStatus("loading");

        try {
            await createUserWithEmailAndPassword(auth, form.email, form.password);
            navigate("/app");
        } catch (err) {
            setStatus("error");
            setError(getAuthErrorMessage(err));
        }
    }

    async function handleGoogleRegister() {
        setError(null);
        setStatus("loading");

        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/app");
        } catch (err) {
            setStatus("error");
            setError(getAuthErrorMessage(err));
        }
    }

    return (
        <div className="register-card">
            <div className="auth-brand">
                <span className="auth-brand__mark" aria-hidden="true">✓</span>
                <p className="auth-brand__tagline">Tus tareas, en un solo lugar.</p>
            </div>
            <h2 className="register-title">Crear cuenta</h2>
            {status === "success" ? (
                <p className="register-success" role="status">Usuario registrado correctamente.</p>
            ) : (
                <form className="register-form" onSubmit={handleSubmit} noValidate>
                    <div className="register-form__field">
                        <input
                            className="register-form__input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            disabled={status === "loading"}
                        />
                    </div>
                    <div className="register-form__field">
                        <input
                            className="register-form__input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            disabled={status === "loading"}
                        />
                    </div>
                    {error && <p className="register-form__error" role="alert">{error}</p>}
                    <button
                        className={`register-btn${status === "loading" ? " register-btn--loading" : ""}`}
                        type="submit"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Registrando..." : "Registrarse"}
                    </button>
                </form>
            )}

            <div className="auth-divider">
                <span>o</span>
            </div>

            <button
                type="button"
                className="google-btn"
                onClick={handleGoogleRegister}
                disabled={status === "loading"}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z" />
                    <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03z" />
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
                </svg>
                Continuar con Google
            </button>

            <p className="register-footer">
                ¿Ya tenés cuenta? <a href="/login">Inicia sesión</a>
            </p>
        </div>
    );
}

export default RegisterPage;
