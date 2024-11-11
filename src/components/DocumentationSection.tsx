import React from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';

interface Document {
  title: string;
  type: 'guide' | 'template' | 'policy';
  url: string;
}

interface DocumentationSectionProps {
  documentation: Document[];
  isEditing: boolean;
  onDocumentationChange: (documentation: Document[]) => void;
}

const DocumentationSection: React.FC<DocumentationSectionProps> = ({
  documentation,
  isEditing,
  onDocumentationChange,
}) => {
  const handleAddDocument = () => {
    onDocumentationChange([
      ...documentation,
      { title: '', type: 'guide', url: '' }
    ]);
  };

  const handleDocumentChange = (index: number, field: keyof Document, value: string) => {
    const updatedDocs = [...documentation];
    updatedDocs[index] = {
      ...updatedDocs[index],
      [field]: value
    };
    onDocumentationChange(updatedDocs);
  };

  return (
    <div className="space-y-4">
      {documentation.map((doc, index) => (
        <div key={index} className="border rounded-lg p-4">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={doc.title}
                onChange={(e) => handleDocumentChange(index, 'title', e.target.value)}
                placeholder="Document title"
                className="w-full p-2 border rounded-lg"
              />
              <select
                value={doc.type}
                onChange={(e) => handleDocumentChange(index, 'type', e.target.value as Document['type'])}
                className="w-full p-2 border rounded-lg"
              >
                <option value="guide">Guide</option>
                <option value="template">Template</option>
                <option value="policy">Policy</option>
              </select>
              <input
                type="url"
                value={doc.url}
                onChange={(e) => handleDocumentChange(index, 'url', e.target.value)}
                placeholder="Document URL"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileText className="text-orange-600" size={20} />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{doc.title}</h4>
                <p className="text-sm text-gray-600 capitalize">{doc.type}</p>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-700"
              >
                <LinkIcon size={20} />
              </a>
            </div>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          onClick={handleAddDocument}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          Add Document
        </button>
      )}
    </div>
  );
};

export default DocumentationSection;