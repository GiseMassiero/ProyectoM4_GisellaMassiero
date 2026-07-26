import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { validateLogin } from "../../helpers/validateLogin";
import { getAuthErrorMessage } from "../../features/auth/authErrors";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import "./LoginPage.css";

interface LocationState {
    from?: { pathname: string };
}

type LoginStatus = "idle" | "loading" | "success" | "error";

interface LoginFormState {
    email: string;
    password: string;
}

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | null;

    const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<LoginStatus>("idle");

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validateLogin(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setStatus("loading");

        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
            const destino = state?.from?.pathname || "/app";
            navigate(destino, { replace: true });
        } catch (error) {
            setStatus("error");
            setError(getAuthErrorMessage(error));
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleGoogleLogin() {
        setError(null);
        setStatus("loading");

        try {
            await signInWithPopup(auth, googleProvider);
            const destino = state?.from?.pathname || "/app";
            navigate(destino, { replace: true });
        } catch (error) {
            setStatus("error");
            setError(getAuthErrorMessage(error));
        }
    }

    return (
        <div className="login-card">
            <div className="auth-brand">
                <span className="auth-brand__mark" aria-hidden="true">✓</span>
                <p className="auth-brand__tagline">Tus tareas, en un solo lugar.</p>
            </div>
            {state?.from && (
                <p className="login-redirect">
                    Necesitas iniciar sesion para acceder a {state.from.pathname}
                </p>
            )}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="login-form__field">
                    <input
                        className="login-form__input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        disabled={status === "loading"}
                    />
                </div>
                <div className="login-form__field">
                    <input
                        className="login-form__input"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Contrasena"
                        disabled={status === "loading"}
                    />
                </div>
                {error && <p className="login-form__error" role="alert">{error}</p>}
                <button
                    className={`login-btn${status === "loading" ? " login-btn--loading" : ""}`}
                    type="submit"
                    disabled={status === "loading"}
                >
                    {status === "loading" ? "Iniciando sesion..." : "Iniciar sesion"}
                </button>
                <p className="login-form__register">
                    ¿No tenes cuenta? <Link to="/register">Registrate</Link>
                </p>
            </form>

            <div className="auth-divider">
                <span>o</span>
            </div>

            <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
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
        </div>
    );
}

export default LoginPage;
