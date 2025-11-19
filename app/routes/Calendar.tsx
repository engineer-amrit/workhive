import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    MoreVertical,
    Circle,
    X,
    Clock,
    MapPin,
    Users,
    Calendar as CalendarIcon,
} from "lucide-react";

const CalendarPage = ({ onBack, handleLogout }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentDay, setCurrentDay] = useState(new Date().getDate());
    const [viewType, setViewType] = useState("month");
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Team Meeting",
            date: "2024-11-12",
            time: "10:00",
            endTime: "11:00",
            description: "Weekly team sync",
            location: "Conference Room A",
            attendees: ["john@company.com", "sarah@company.com"],
            color: "blue",
        },
        {
            id: 2,
            title: "Lunch with Client",
            date: "2024-11-14",
            time: "12:30",
            endTime: "14:00",
            description: "Discuss project requirements",
            location: "Downtown Cafe",
            attendees: ["client@business.com"],
            color: "green",
        },
    ]);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "09:00",
        endTime: "10:00",
        description: "",
        location: "",
        attendees: [],
        color: "blue",
    });

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const colorOptions = [
        { name: "blue", value: "bg-blue-500" },
        { name: "green", value: "bg-green-500" },
        { name: "purple", value: "bg-purple-500" },
        { name: "red", value: "bg-red-500" },
        { name: "yellow", value: "bg-yellow-500" },
        { name: "indigo", value: "bg-indigo-500" },
    ];

    // Calendar functions
    const getDaysInMonth = (month, year) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const generateCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return days;
    };

    const calendarDays = generateCalendar();

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevDay = () => {
        const date = new Date(currentYear, currentMonth, currentDay);
        date.setDate(date.getDate() - 1);
        setCurrentDay(date.getDate());
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
    };

    const nextDay = () => {
        const date = new Date(currentYear, currentMonth, currentDay);
        date.setDate(date.getDate() + 1);
        setCurrentDay(date.getDate());
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setCurrentDay(today.getDate());
    };

    const getEventsForDate = (day) => {
        if (!day) return [];
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-${String(day).padStart(2, "0")}`;
        return events.filter((event) => event.date === dateStr);
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const openEventModal = (day = null) => {
        if (day) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;
            setSelectedDate(dateStr);
            setNewEvent({
                ...newEvent,
                date: dateStr,
            });
        } else {
            setSelectedDate(null);
            setNewEvent({
                title: "",
                date: "",
                time: "09:00",
                endTime: "10:00",
                description: "",
                location: "",
                attendees: [],
                color: "blue",
            });
        }
        setShowEventModal(true);
    };

    const addEvent = () => {
        if (newEvent.title && newEvent.date) {
            const event = {
                id: Date.now(),
                ...newEvent,
            };
            setEvents([...events, event]);
            setShowEventModal(false);
            setNewEvent({
                title: "",
                date: "",
                time: "09:00",
                endTime: "10:00",
                description: "",
                location: "",
                attendees: [],
                color: "blue",
            });
        }
    };

    const deleteEvent = (eventId) => {
        setEvents(events.filter((event) => event.id !== eventId));
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getUpcomingEvents = () => {
        const today = new Date().toISOString().split("T")[0];
        return events
            .filter((event) => event.date >= today)
            .sort(
                (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
            )
            .slice(0, 5);
    };

    const getEventsWithoutDate = () => {
        return events.filter((event) => !event.date);
    };

    const handleBackToDashboard = () => {
        if (typeof onBack === "function") {
            onBack();
        } else {
            console.error("onBack is not a function");
        }
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let i = 0; i < 24; i++) {
            const hour = i % 12 || 12;
            const ampm = i < 12 ? "AM" : "PM";
            slots.push(`${hour}:00 ${ampm}`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const getEventPosition = (event) => {
        const [hours, minutes] = event.time.split(":");
        const startHour = parseInt(hours);
        const startMinutes = parseInt(minutes);
        const top = (startHour + startMinutes / 60) * 60; // 60px per hour

        const [endHours, endMinutes] = event.endTime.split(":");
        const endHour = parseInt(endHours);
        const endMinute = parseInt(endMinutes);
        const duration = endHour + endMinute / 60 - (startHour + startMinutes / 60);
        const height = duration * 60;

        return { top, height };
    };

    const renderDayView = () => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
            2,
            "0"
        )}-${String(currentDay).padStart(2, "0")}`;
        const dayEvents = events.filter((event) => event.date === dateStr);
        const currentDate = new Date(currentYear, currentMonth, currentDay);
        const dayName = dayNames[currentDate.getDay()];

        return (
            <div className="lg:col-span-3">
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-normal text-gray-900">
                                {dayName}, {monthNames[currentMonth]} {currentDay},{" "}
                                {currentYear}
                            </h3>
                            <button
                                onClick={() => openEventModal(currentDay)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Event
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto" style={{ maxHeight: "600px" }}>
                        <div className="relative">
                            {/* Time slots */}
                            {timeSlots.map((time, index) => (
                                <div
                                    key={index}
                                    className="flex border-b border-gray-100"
                                    style={{ height: "60px" }}
                                >
                                    <div className="w-20 pr-4 text-sm text-gray-500 text-right py-1">
                                        {time}
                                    </div>
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-0 border-l border-gray-100"></div>
                                    </div>
                                </div>
                            ))}

                            {/* Events overlay */}
                            <div className="absolute left-20 right-0 top-0">
                                {dayEvents.map((event) => {
                                    const { top, height } = getEventPosition(event);
                                    return (
                                        <div
                                            key={event.id}
                                            className={`absolute left-2 right-2 p-2 rounded-lg cursor-pointer shadow-sm ${event.color === "blue"
                                                    ? "bg-blue-500"
                                                    : event.color === "green"
                                                        ? "bg-green-500"
                                                        : event.color === "purple"
                                                            ? "bg-purple-500"
                                                            : event.color === "red"
                                                                ? "bg-red-500"
                                                                : event.color === "yellow"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-indigo-500"
                                                } text-white`}
                                            style={{
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                minHeight: "40px",
                                            }}
                                            onClick={() => {
                                                setNewEvent(event);
                                                setShowEventModal(true);
                                            }}
                                        >
                                            <div className="font-medium text-sm">{event.title}</div>
                                            <div className="text-xs opacity-90">
                                                {formatTime(event.time)} - {formatTime(event.endTime)}
                                            </div>
                                            {event.location && (
                                                <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
                                                    <MapPin size={10} />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        return (
            <div className="lg:col-span-3">
                {/* This Week Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">This Week</h2>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-xl font-normal text-gray-900 mb-4">
                            {monthNames[currentMonth]} {currentYear}
                        </h3>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                            {/* Day Headers */}
                            {dayNames.map((day) => (
                                <div key={day} className="bg-gray-50 p-3 text-center">
                                    <span className="text-sm font-medium text-gray-600">
                                        {day}
                                    </span>
                                </div>
                            ))}

                            {/* Calendar Days */}
                            {calendarDays.map((day, index) => {
                                const dayEvents = getEventsForDate(day);
                                const today = isToday(day);
                                const dateStr = day
                                    ? `${currentYear}-${String(currentMonth + 1).padStart(
                                        2,
                                        "0"
                                    )}-${String(day).padStart(2, "0")}`
                                    : null;

                                return (
                                    <div
                                        key={index}
                                        className={`bg-white min-h-32 p-2 relative group ${today ? "bg-blue-50" : ""
                                            }`}
                                        onMouseEnter={() => setHoveredDate(dateStr)}
                                        onMouseLeave={() => setHoveredDate(null)}
                                    >
                                        {day && (
                                            <>
                                                <div
                                                    className={`flex items-center justify-between mb-1 ${today
                                                            ? "text-blue-600 font-medium"
                                                            : "text-gray-900"
                                                        }`}
                                                >
                                                    <span className="text-sm">{day}</span>
                                                    {today && (
                                                        <Circle
                                                            size={8}
                                                            className="text-blue-600 fill-current"
                                                        />
                                                    )}
                                                </div>

                                                {/* Add Event Button - Show on hover */}
                                                {hoveredDate === dateStr && (
                                                    <button
                                                        onClick={() => openEventModal(day)}
                                                        className="absolute top-2 right-2 p-1 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                )}

                                                {/* Events */}
                                                <div className="space-y-1">
                                                    {dayEvents.slice(0, 2).map((event) => (
                                                        <div
                                                            key={event.id}
                                                            className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 ${event.color === "blue"
                                                                    ? "bg-blue-500"
                                                                    : event.color === "green"
                                                                        ? "bg-green-500"
                                                                        : event.color === "purple"
                                                                            ? "bg-purple-500"
                                                                            : event.color === "red"
                                                                                ? "bg-red-500"
                                                                                : event.color === "yellow"
                                                                                    ? "bg-yellow-500"
                                                                                    : "bg-indigo-500"
                                                                }`}
                                                            onClick={() => {
                                                                setNewEvent(event);
                                                                setShowEventModal(true);
                                                            }}
                                                        >
                                                            {formatTime(event.time)} {event.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && (
                                                        <div className="text-xs text-gray-500 pl-1">
                                                            +{dayEvents.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Manage in Calendar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Manage in Calendar</h3>
                    <div className="space-y-2">
                        {["Today"].map((day) => (
                            <div
                                key={day}
                                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                            >
                                <span className="text-sm text-gray-600">{day}</span>
                                <button
                                    onClick={() => openEventModal()}
                                    className="text-blue-600 text-sm hover:text-blue-700"
                                >
                                    Add event
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleBackToDashboard}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronLeft size={20} className="text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-normal text-gray-900">Calendar</h1>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                                <span className="text-sm text-gray-600">
                                    {viewType === "day"
                                        ? `${monthNames[currentMonth]} ${currentDay}, ${currentYear}`
                                        : `${monthNames[currentMonth]} ${currentYear}`}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewType("month")}
                                    className={`px-4 py-2 text-sm ${viewType === "month"
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600"
                                        }`}
                                >
                                    Month
                                </button>
                                <button
                                    onClick={() => setViewType("week")}
                                    className={`px-4 py-2 text-sm ${viewType === "week"
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600"
                                        }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setViewType("day")}
                                    className={`px-4 py-2 text-sm ${viewType === "day"
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600"
                                        }`}
                                >
                                    Day
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={viewType === "day" ? prevDay : prevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <ChevronLeft size={20} className="text-gray-600" />
                                </button>
                                <button
                                    onClick={viewType === "day" ? nextDay : nextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <ChevronRight size={20} className="text-gray-600" />
                                </button>
                            </div>

                            <button
                                onClick={() => openEventModal()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToToday}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                        >
                            Today
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                            By Weekday
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* How to use this template */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            How to use this template?
                        </span>
                        <button
                            onClick={() => openEventModal()}
                            className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700"
                        >
                            <Plus size={16} />
                            New page
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Calendar - Render based on viewType */}
                    {viewType === "month" && renderMonthView()}
                    {viewType === "week" && renderMonthView()}
                    {viewType === "day" && renderDayView()}

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Add Attendees Contacts */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-gray-900">
                                    Add Attendees Contacts
                                </h3>
                                <span className="text-xs text-gray-500">12:00 AM</span>
                            </div>
                            <button
                                onClick={() => openEventModal()}
                                className="w-full flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700 justify-center py-2 border border-dashed border-gray-300 rounded"
                            >
                                <Plus size={16} />
                                Add attendees
                            </button>
                        </div>

                        {/* Events without date */}
                        {getEventsWithoutDate().length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">
                                    No date ({getEventsWithoutDate().length})
                                </h3>
                                <div className="space-y-2">
                                    {getEventsWithoutDate().map((event) => (
                                        <div
                                            key={event.id}
                                            className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upcoming Events */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Upcoming Events
                            </h3>
                            <div className="space-y-3">
                                {getUpcomingEvents().map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer group"
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full ${event.color === "blue"
                                                    ? "bg-blue-500"
                                                    : event.color === "green"
                                                        ? "bg-green-500"
                                                        : event.color === "purple"
                                                            ? "bg-purple-500"
                                                            : event.color === "red"
                                                                ? "bg-red-500"
                                                                : event.color === "yellow"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-indigo-500"
                                                }`}
                                        ></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {event.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(event.date).toLocaleDateString()} at{" "}
                                                {formatTime(event.time)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteEvent(event.id);
                                            }}
                                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} className="text-gray-400" />
                                        </button>
                                    </div>
                                ))}
                                {getUpcomingEvents().length === 0 && (
                                    <p className="text-sm text-gray-500 text-center">
                                        No upcoming events
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Event</h3>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Sync Status */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Sync Status</span>
                                    <span className="text-sm text-gray-400 ml-auto">Empty</span>
                                </div>

                                {/* Source */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Source</span>
                                    <span className="text-sm text-gray-400 ml-auto">
                                        Google Calendar
                                    </span>
                                </div>

                                {/* Event Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) =>
                                            setNewEvent({ ...newEvent, title: e.target.value })
                                        }
                                        placeholder="Add event title"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newEvent.date}
                                            onChange={(e) =>
                                                setNewEvent({ ...newEvent, date: e.target.value })
                                            }
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start
                                            </label>
                                            <input
                                                type="time"
                                                value={newEvent.time}
                                                onChange={(e) =>
                                                    setNewEvent({ ...newEvent, time: e.target.value })
                                                }
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End
                                            </label>
                                            <input
                                                type="time"
                                                value={newEvent.endTime}
                                                onChange={(e) =>
                                                    setNewEvent({ ...newEvent, endTime: e.target.value })
                                                }
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color
                                    </label>
                                    <div className="flex gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() =>
                                                    setNewEvent({ ...newEvent, color: color.name })
                                                }
                                                className={`w-6 h-6 rounded-full ${color.value} ${newEvent.color === color.name
                                                        ? "ring-2 ring-offset-2 ring-blue-500"
                                                        : ""
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) =>
                                            setNewEvent({ ...newEvent, description: e.target.value })
                                        }
                                        placeholder="Add description"
                                        rows="3"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) =>
                                            setNewEvent({ ...newEvent, location: e.target.value })
                                        }
                                        placeholder="Add location"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={addEvent}
                                        disabled={!newEvent.title || !newEvent.date}
                                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {newEvent.id ? "Update Event" : "Create Event"}
                                    </button>
                                    {newEvent.id && (
                                        <button
                                            onClick={() => deleteEvent(newEvent.id)}
                                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
