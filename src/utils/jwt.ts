export const getSubFromJwt = (token?: string): string | null => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload.sub ?? null;
    } catch { return null; }
};

export const getRolesFromJwt = (token?: string): string[] => {
    if (!token) return [];
    try {
        const p = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        // подстрой под свой клейм: часто это 'roles' или 'authorities'
        const roles = p.roles || p.authorities || [];
        return Array.isArray(roles) ? roles : [];
    } catch { return []; }
};
