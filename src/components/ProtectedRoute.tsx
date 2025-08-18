// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { JSX } from "react";
import { getRolesFromJwt } from "../utils/jwt";

type Props = { children?: JSX.Element; allowedRoles?: string[] };

export default function ProtectedRoute({ children, allowedRoles }: Props) {
    const token = useSelector((s: RootState) => s.token.accessToken);
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles?.length) {
        const roles = getRolesFromJwt(token || "");
        if (!roles.some(r => allowedRoles.includes(r))) return <Navigate to="/" replace />;
    }
    return children ?? <Outlet />;
}
