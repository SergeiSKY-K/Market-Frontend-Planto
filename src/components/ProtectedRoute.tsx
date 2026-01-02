import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getRolesFromJwt } from "../utils/jwt";

type Props = {
    allowedRoles?: string[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
    const token = useSelector((s: RootState) => s.token.accessToken);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles?.length) {
        const roles = getRolesFromJwt(token);
        const hasAccess = roles.some(r => allowedRoles.includes(r));

        if (!hasAccess) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
}
