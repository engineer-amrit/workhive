import { useAuth } from "@/context/useAuth"
import WholePageLoader from "./WholePageLoader"

const AuthLoader = () => {
    const { loading } = useAuth();
    if (!loading) return null;
    return (
        <div className="fix z-50">
            <WholePageLoader />
        </div>
    )
}

export default AuthLoader
