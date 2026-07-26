import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import "./App.css";

function App() {
    const location = useLocation();
    const isWelcome = location.pathname === "/";

    return (
        <div>
            {!isWelcome && (
                <>
                    <h1>Gestor de tareas</h1>
                    <Navbar />
                </>
            )}
            <Routes>
                {/* Ruta publica de bienvenida */}
                <Route path="/" element={<WelcomePage />} />

                {/* Rutas privadas */}
                <Route element={<RequireAuth />}>
                    <Route path="/app" element={<HomePage />} />
                </Route>

                {/* Rutas publicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </div>
    );
}

export default App;
