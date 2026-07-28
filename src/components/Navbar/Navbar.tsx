import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../features/auth/Authenticator";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

function Navbar() {
    const { user } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    async function handleLogout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar__row">
                <Link to={user ? "/app" : "/"} className="navbar__brand" aria-label="Ir al inicio">
                    <span className="navbar__brand-mark" aria-hidden="true">✓</span>
                    <span className="navbar__brand-title">Gestor de tareas</span>
                </Link>

                <div className="navbar__actions">
                    <ThemeToggle />
                    {user ? (
                        <button className="navbar__btn navbar__btn--logout" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    ) : (
                        location.pathname !== "/login" && (
                            <Link to="/login" className="navbar__btn">Iniciar sesión</Link>
                        )
                    )}
                </div>
            </div>

            {isLoginPage && (
                <div className="navbar__welcome">
                    <span className="navbar__welcome-text">¡Bienvenido/a de nuevo!</span>
                    <Link to="/" className="navbar__home-link">Inicio</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;