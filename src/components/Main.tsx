import Navigation from "./Navigation.tsx";
import Workspace from "./Workspace.tsx";

const Main = () => {
    return (
        <main className={"grid grid-cols-7 gap-4 h-2/3"}>
            <Navigation/>
            <Workspace/>
        </main>
    )
}

export default Main

