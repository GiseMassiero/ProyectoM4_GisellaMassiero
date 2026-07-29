import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/Authenticator";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./WelcomePage.css";

function WelcomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    function handleStart() {
        navigate(user ? "/app" : "/login");
    }

    return (
        <div className="welcome-page">
            <div className="welcome-page__toggle">
                <ThemeToggle />
            </div>
            <div className="welcome-card">
                <div className="auth-brand">
                    <span className="auth-brand__mark" aria-hidden="true">✓</span>
                </div>
                <p className="welcome-eyebrow">Gestor de Tareas</p>
                <h2 className="welcome-title">Todo empieza con un pequeño paso.</h2>
                <p className="welcome-subtitle">
                    Organizá tu día con calma y mantén tus prioridades cerca.
                </p>
                <button className="welcome-cta" type="button" onClick={handleStart}>
                    <span>{user ? "Ir a mis tareas" : "Comenzar"}</span>
                    <span className="welcome-cta__arrow" aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
}

export default WelcomePage;
