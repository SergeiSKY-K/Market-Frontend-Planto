// src/components/Main.tsx
import Navigation from "./navigation/Navigation";
import { Outlet } from "react-router-dom";

export default function Main() {
    return (
        <div className="grid grid-cols-7 gap-4 min-h-screen">
            <Navigation />
            <div className="col-span-6 p-6">
                <Outlet />
            </div>
        </div>
    );
}
