import { FileText, Target, Building2, User, Plus, LogOut } from "lucide-react";
import { Link, useRouteLoaderData } from "react-router";
import type { User as Iuser } from "~/types";

const Sbar = () => {
    const data = useRouteLoaderData<Iuser>("root")

    return (
        <div className="w-full bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
            {/* User Info */}
            {!(data?.fullName) ? <div className="h-16 border-b border-gray-700 flex items-center justify-center px-4">
                <Link to="login" className="bg-green-600 p-2 w-40 rounded-md text-white text-sm font-medium hover:bg-green-700 transition text-center">
                    Login
                </Link>
            </div> : <div className="h-16 border-b border-gray-700 flex items-center px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-semibold text-sm">
                        {data.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                            {data.fullName}'s Workspace
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                            {data.email}
                        </p>
                    </div>
                </div>
            </div>}

            {/* Navigation */}
            <div className="p-4">
                <p className="text-gray-500 text-xs font-semibold mb-3">Private</p>

                <button
                    //   onClick={() => navigate("/dashboard")}
                    className="w-full flex items-center gap-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition text-left group mb-1"
                >
                    <span className="text-xl">👋</span>
                    <span className="text-sm font-medium">Welcome to WorkHive!</span>
                </button>

                <button
                    //   onClick={() => navigate("/templates")}
                    className="w-full flex items-center gap-3 p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition text-left group mb-1"
                >
                    <FileText size={18} />
                    <span className="text-sm font-medium">New page</span>
                </button>

                <button
                    //   onClick={() => navigate("/documents")}
                    className="w-full flex items-center gap-3 p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition text-left"
                >
                    <Plus size={18} />
                    <span className="text-sm">Add new</span>
                </button>
            </div>

            {/* Teamspaces Section */}
            <div className="p-4 border-t border-gray-700">
                <p className="text-gray-500 text-xs font-semibold mb-3">Teamspaces</p>

                <div className="mb-2">
                    <button className="w-full flex items-center gap-2 p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition text-left group">
                        <Building2 size={18} />
                        <span className="text-sm font-medium flex-1">Workspace HQ</span>
                    </button>

                    <button
                        // onClick={() => navigate("/templates")}
                        className="w-full flex items-center gap-2 p-2 pl-8 text-gray-300 hover:bg-gray-700 rounded-lg transition text-left group mt-1"
                    >
                        <Target size={16} className="text-blue-500" />
                        <span className="text-sm">Projects</span>
                    </button>

                    <button
                        // onClick={() => navigate("/documents")}
                        className="w-full flex items-center gap-2 p-2 pl-8 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition text-left mt-1"
                    >
                        <Plus size={16} />
                        <span className="text-sm">Add new</span>
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-auto p-4 border-t border-gray-700 space-y-1">
                <button className="w-full flex items-center gap-3 p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition text-left">
                    <User size={18} />
                    <span className="text-sm">Members</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition text-left">
                    <Target size={18} />
                    <span className="text-sm">Settings</span>
                </button>
                <Link to="/logout"
                    //   onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2 text-red-400 hover:bg-gray-700 rounded-lg transition text-left"
                >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sbar;
