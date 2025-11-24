import React from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

const ProndoTimer = () => {
    const [pomodoroTime, setPomodoroTime] = React.useState(25 * 60);
    const [isRunning, setIsRunning] = React.useState(false);

    // Pomodoro timer effect
    React.useEffect(() => {
        let interval = null;
        if (isRunning && pomodoroTime > 0) {
            interval = setInterval(() => {
                setPomodoroTime((time) => time - 1);
            }, 1000);
        } else if (pomodoroTime === 0) {
            setIsRunning(false);
            // You can add notification here
        }
        return () => clearInterval(interval);
    }, [isRunning, pomodoroTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };
    return (
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Clock size={24} className="text-white" />
                <h2 className="text-xl font-bold text-white">Focus Timer</h2>
            </div>
            <div className="text-center">
                <div className="text-6xl font-bold text-white mb-6">
                    {formatTime(pomodoroTime)}
                </div>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        {isRunning ? <Pause size={20} /> : <Play size={20} />}
                        {isRunning ? "Pause" : "Start"}
                    </button>
                    <button
                        onClick={() => {
                            setPomodoroTime(25 * 60);
                            setIsRunning(false);
                        }}
                        className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <RotateCcw size={20} />
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProndoTimer;
