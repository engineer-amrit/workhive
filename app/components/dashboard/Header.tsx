import { Sparkles } from "lucide-react";
import { Link, useRouteLoaderData } from "react-router";
import type { User } from "~/types";
const Header = () => {
    const data = useRouteLoaderData<User>("root");

    return (
        <div className="bg-gray-800 border-b px-2.5 border-gray-700 h-16 sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-2xl">👋</span>
                <h1 className="text-white font-bold text-xl">
                    Welcome to WorkHive
                    {data?.fullName ? `, ${data.fullName.split(" ")[0]}` : ""}!
                </h1>
            </div>
            <Link
                to={"/templates"}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm flex items-center gap-2"
            >
                <Sparkles size={16} />
                Browse Templates
            </Link>
        </div>
    );
};

export default Header;
