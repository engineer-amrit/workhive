import { tasks } from "~/mock/tasks";
import { CheckSquare, Plus } from "lucide-react";
import { Link } from "react-router";
const Tasks = () => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <CheckSquare size={24} className="text-blue-500" />
                    <h2 className="text-xl font-bold text-white">Tasks</h2>
                </div>
                <Link
                    to={"/tasks"}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} className="text-white" />
                </Link>
            </div>
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-600 text-blue-600"
                        />
                        <div className="flex-1">
                            <p className="text-white">{task.text}</p>
                            <p className="text-gray-400 text-xs">{task.dueDate}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                // onClick={() => navigate("/tasks")}
                className="w-full mt-4 px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition"
            >
                View all tasks →
            </button>
        </div>
    );
};

export default Tasks;
