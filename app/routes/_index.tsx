// src/components/dashboard/Dashboard.jsx
import Sidebar from "../components/dashboard/Sidebar";
import Calendar from "../components/widgets/Calender";
import Header from "../components/dashboard/Header";
import Features from "../components/dashboard/Features";
import Tasks from "~/components/widgets/Tasks";
import ProndoTimer from "~/components/widgets/Timer";
import Documents from "~/components/widgets/Documents";


const Dashboard = () => {

    return (
        <div className="h-screen w-full bg-gray-900 grid grid-cols-[250px_1fr]">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto  w-full h-full">
                {/* Header */}
                <Header />

                {/* Welcome Content */}
                <div className="max-w-6xl  mx-auto p-8">
                    {/* Features Section */}
                    <Features />

                    {/* Quick Access Widgets */}
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* TASKS WIDGET */}
                        <Tasks />

                        {/* POMODORO TIMER */}
                        <ProndoTimer />

                        {/* DOCUMENTS WIDGET */}
                        <Documents />

                        {/* CALENDAR WIDGET */}
                        <Calendar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
