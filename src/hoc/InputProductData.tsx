import type { ComponentType } from "react";
import ErrorPage from "../components/ErrorPage.tsx";

export const inputProductData = <T extends object>(Component: ComponentType<T>) => (props: T) => {
    const isError = false;
    const msg = "Something is going wrong..";

    return isError ? <ErrorPage msg={msg} /> : <Component {...props} />;
};
