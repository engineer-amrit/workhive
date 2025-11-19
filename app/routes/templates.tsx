import React, { useState } from "react";
import { ChevronLeft, Search, Star, Plus, Grid, List, Eye } from "lucide-react";
import TemplateManager from "~/components/templates/TemplateManager";
import { Link } from "react-router";

const TemplatesPage = ({ setView }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [activeTemplate, setActiveTemplate] = useState(null);

    // Notion-style templates data
    const templates = [
        {
            id: 1,
            title: "Personal Home",
            category: "personal",
            description: "Organize your personal life with tasks, goals, and notes",
            rating: 4.9,
            uses: "12.4K",
            preview: "personal-home",
            featured: true,
            color: "bg-pink-500",
            icon: "🏠",
        },
        {
            id: 2,
            title: "Task Manager",
            category: "productivity",
            description: "Track tasks and projects with multiple views",
            rating: 4.8,
            uses: "8.7K",
            preview: "task-manager",
            featured: true,
            color: "bg-blue-500",
            icon: "✅",
        },
        {
            id: 3,
            title: "Meeting Notes",
            category: "work",
            description: "Structure your meeting notes and action items",
            rating: 4.7,
            uses: "15.2K",
            preview: "meeting-notes",
            featured: false,
            color: "bg-purple-500",
            icon: "📝",
        },
        {
            id: 4,
            title: "Project Tracker",
            category: "work",
            description: "Manage projects from start to finish",
            rating: 4.9,
            uses: "10.3K",
            preview: "project-tracker",
            featured: true,
            color: "bg-green-500",
            icon: "📊",
        },
        {
            id: 5,
            title: "Habit Tracker",
            category: "personal",
            description: "Build better habits with daily tracking",
            rating: 4.6,
            uses: "7.8K",
            preview: "habit-tracker",
            featured: false,
            color: "bg-yellow-500",
            icon: "📈",
        },
        {
            id: 6,
            title: "Content Calendar",
            category: "marketing",
            description: "Plan and schedule your content strategy",
            rating: 4.7,
            uses: "5.4K",
            preview: "content-calendar",
            featured: false,
            color: "bg-indigo-500",
            icon: "📅",
        },
        {
            id: 7,
            title: "CRM",
            category: "sales",
            description: "Customer relationship management made simple",
            rating: 4.8,
            uses: "6.9K",
            preview: "crm",
            featured: true,
            color: "bg-red-500",
            icon: "👥",
        },
        {
            id: 8,
            title: "Weekly Planner",
            category: "productivity",
            description: "Plan your week with time blocking",
            rating: 4.5,
            uses: "9.1K",
            preview: "weekly-planner",
            featured: false,
            color: "bg-teal-500",
            icon: "🗓️",
        },
        {
            id: 9,
            title: "Book Notes",
            category: "education",
            description: "Capture insights from your reading",
            rating: 4.4,
            uses: "4.2K",
            preview: "book-notes",
            featured: false,
            color: "bg-orange-500",
            icon: "📚",
        },
        {
            id: 10,
            title: "Team Wiki",
            category: "work",
            description: "Central knowledge base for your team",
            rating: 4.9,
            uses: "11.7K",
            preview: "team-wiki",
            featured: true,
            color: "bg-blue-600",
            icon: "🌐",
        },
        {
            id: 11,
            title: "Budget Tracker",
            category: "finance",
            description: "Manage your personal finances",
            rating: 4.6,
            uses: "8.3K",
            preview: "budget-tracker",
            featured: false,
            color: "bg-emerald-500",
            icon: "💰",
        },
        {
            id: 12,
            title: "Event Planning",
            category: "personal",
            description: "Organize events from conception to execution",
            rating: 4.7,
            uses: "3.9K",
            preview: "event-planning",
            featured: false,
            color: "bg-pink-600",
            icon: "🎉",
        },
    ];

    const categories = [
        { key: "all", label: "All templates", count: templates.length },
        {
            key: "featured",
            label: "Featured",
            count: templates.filter((t) => t.featured).length,
        },
        {
            key: "work",
            label: "Work",
            count: templates.filter((t) => t.category === "work").length,
        },
        {
            key: "personal",
            label: "Personal",
            count: templates.filter((t) => t.category === "personal").length,
        },
        {
            key: "productivity",
            label: "Productivity",
            count: templates.filter((t) => t.category === "productivity").length,
        },
        {
            key: "education",
            label: "Education",
            count: templates.filter((t) => t.category === "education").length,
        },
        {
            key: "marketing",
            label: "Marketing",
            count: templates.filter((t) => t.category === "marketing").length,
        },
        {
            key: "sales",
            label: "Sales",
            count: templates.filter((t) => t.category === "sales").length,
        },
        {
            key: "finance",
            label: "Finance",
            count: templates.filter((t) => t.category === "finance").length,
        },
    ];

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            category === "all" ||
            (category === "featured"
                ? template.featured
                : template.category === category);

        return matchesSearch && matchesCategory;
    });

    const useTemplate = (template) => {
        setActiveTemplate(template.preview);
    };

    const handleBackToTemplates = () => {
        setActiveTemplate(null);
    };

    // If a template is active, render it through TemplateManager
    if (activeTemplate) {
        return (
            <TemplateManager
                activeTemplate={activeTemplate}
                setView={handleBackToTemplates}
            />
        );
    }

    const renderTemplatePreview = (template) => {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-32 overflow-hidden">
                <div className="flex items-start gap-2 mb-2">
                    <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-white text-sm ${template.color}`}
                    >
                        {template.icon}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {template.title}
                        </div>
                    </div>
                </div>

                {/* Mock content blocks */}
                <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-1 mt-2">
                        <div className="w-4 h-4 bg-blue-100 rounded"></div>
                        <div className="w-4 h-4 bg-green-100 rounded"></div>
                        <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                to={"/"}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} className="text-gray-600" />
                            </Link>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Templates
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setViewMode(viewMode === "grid" ? "list" : "grid")
                                }
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {viewMode === "grid" ? <List size={20} /> : <Grid size={20} />}
                            </button>

                            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                                <Plus size={16} />
                                New template
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Get started with a template
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose from hundreds of ready-made templates for every use case.
                        Customize them to fit your needs and start working faster.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-2xl mx-auto">
                        <Search
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <div className="flex gap-2 overflow-x-auto pb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setCategory(cat.key)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${category === cat.key
                                    ? "bg-black text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                    }`}
                            >
                                {cat.label} ({cat.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Templates Section */}
                {category === "all" || category === "featured" ? (
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Featured templates
                        </h3>
                        <div
                            className={`grid gap-6 ${viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                                }`}
                        >
                            {filteredTemplates
                                .filter((t) => t.featured)
                                .slice(0, 6)
                                .map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => useTemplate(template)}
                                        className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${template.color}`}
                                                    >
                                                        <span className="text-lg">{template.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {template.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-1 text-amber-500">
                                                                <Star size={14} className="fill-current" />
                                                                <span className="text-sm text-gray-600">
                                                                    {template.rating}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">•</span>
                                                            <span className="text-sm text-gray-500">
                                                                {template.uses} uses
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all">
                                                    <Eye size={16} className="text-gray-400" />
                                                </button>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4">
                                                {template.description}
                                            </p>

                                            {renderTemplatePreview(template)}

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                <span className="text-xs text-gray-500">
                                                    By WorkHive
                                                </span>
                                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                                    Use this template →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : null}

                {/* All Templates Section */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        {category === "all"
                            ? "All templates"
                            : categories.find((c) => c.key === category)?.label}
                    </h3>

                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                No templates found
                            </h4>
                            <p className="text-gray-600">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div
                            className={`grid gap-6 ${viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                                }`}
                        >
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => useTemplate(template)}
                                    className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${template.color}`}
                                                >
                                                    <span className="text-lg">{template.icon}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {template.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star size={14} className="fill-current" />
                                                            <span className="text-sm text-gray-600">
                                                                {template.rating}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">•</span>
                                                        <span className="text-sm text-gray-500">
                                                            {template.uses} uses
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all">
                                                <Eye size={16} className="text-gray-400" />
                                            </button>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4">
                                            {template.description}
                                        </p>

                                        {renderTemplatePreview(template)}

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">By WorkHive</span>
                                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                                Use this template →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16 py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Can't find what you're looking for?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Create your own custom template and share it with the community.
                    </p>
                    <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                        Create custom template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplatesPage;
