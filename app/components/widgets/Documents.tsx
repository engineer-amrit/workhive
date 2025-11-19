import { FileText, Plus } from "lucide-react";
import { documents } from "~/mock/documents";

const Documents = () => {
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText size={24} className="text-green-500" />
                    <h2 className="text-xl font-bold text-white">Documents</h2>
                </div>
                <button
                    onClick={() => navigate("/documents")}
                    className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                    <Plus size={20} className="text-white" />
                </button>
            </div>
            <div className="space-y-3">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => handleOpenDocument(doc)}
                        className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                    >
                        <div>
                            <p className="text-white font-medium">{doc.title}</p>
                            <p className="text-gray-400 text-xs">Edited {doc.lastEdited}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => navigate("/documents")}
                className="w-full mt-4 px-4 py-2 text-green-400 hover:text-green-300 text-sm font-medium transition"
            >
                View all documents →
            </button>
        </div>
    );
};

export default Documents;
