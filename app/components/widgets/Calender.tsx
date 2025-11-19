import { Calendar as CIcon, ChevronRight } from "lucide-react";
import { Link } from "react-router";

const Calendar = () => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <CIcon size={24} className="text-purple-500" />
                    <h2 className="text-xl font-bold text-white">Calendar</h2>
                </div>
                <Link
                    to={"/calendar"}
                    className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                >
                    <ChevronRight size={20} className="text-white" />
                </Link>
            </div>
            <div className="text-center py-8">
                <CIcon size={64} className="text-purple-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Manage your schedule</p>
                <Link
                    to={"/calendar"}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                    Open Calendar
                </Link>
            </div>
        </div>
    );
};

export default Calendar;
