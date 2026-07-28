import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

function App() {
    const location = useLocation();
    const isWelcome = location.pathname === "/";

    return (
        <div>
            {!isWelcome && <Navbar />}
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route element={<RequireAuth />}>
                        <Route path="/app" element={<HomePage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
