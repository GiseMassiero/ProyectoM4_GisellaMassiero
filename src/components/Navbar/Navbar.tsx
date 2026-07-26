import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../features/auth/Authenticator";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

function Navbar() {
    const { user } = useAuth();
    const location = useLocation();

    async function handleLogout() {
        await signOut(auth);
    }

    return (
        <nav className="navbar">
            <Link to={user ? "/app" : "/"} className="navbar__brand" aria-label="Ir al inicio">
                <span className="navbar__brand-mark" aria-hidden="true">✓</span>
                <span className="navbar__brand-name">Página principal</span>
            </Link>
            <div className="navbar__actions">
                <ThemeToggle />
                {user ? (
                    <>
                        <span className="navbar__user">{user.email}</span>
                        <button className="navbar__btn navbar__btn--logout" onClick={handleLogout}>
                            Cerrar sesion
                        </button>
                    </>
                ) : (
                    location.pathname !== "/login" && (
                        <Link to="/login" className="navbar__btn">Iniciar sesion</Link>
                    )
                )}
            </div>
        </nav>
    );
}

export default Navbar;
