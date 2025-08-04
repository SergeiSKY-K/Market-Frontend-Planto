import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <Main />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
