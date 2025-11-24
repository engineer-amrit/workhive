import { Calendar, Clock, FileText, Target } from "lucide-react";
const Features = () => {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">What is WorkHive?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition cursor-pointer">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <FileText size={24} className="text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                        Write & Collaborate
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Create beautiful documents, notes, and wikis. Work together with
                        your team in real-time.
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition cursor-pointer">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <Target size={24} className="text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                        Manage Projects
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Track tasks, projects, and goals. Stay organized with customizable
                        workflows and views.
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition cursor-pointer">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                        <Calendar size={24} className="text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                        Plan Your Time
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Schedule events, set reminders, and manage your calendar. Never miss
                        an important date.
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition cursor-pointer">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                        <Clock size={24} className="text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                        Stay Focused
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Use productivity tools like Pomodoro timer to maintain focus and
                        boost your efficiency.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Features;
