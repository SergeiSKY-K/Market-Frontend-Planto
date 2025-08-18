import { Outlet } from "react-router-dom";
import Navigation from "./navigation/Navigation";

export default function Main() {
    return (
        <div className="app-layout flex min-h-screen">
            <Navigation />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
