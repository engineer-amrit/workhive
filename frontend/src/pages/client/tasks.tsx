import { Link } from "react-router";

export default function TasksPage() {
    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                <Link
                    to={"/"}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
                >
                    ← Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold text-white mb-8">Tasks</h1>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Tasks Management
                        </h3>
                        <p className="text-gray-400">
                            Full tasks management system coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
