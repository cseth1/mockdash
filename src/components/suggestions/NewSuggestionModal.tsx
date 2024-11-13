import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Info, Lock, User, X } from 'lucide-react';
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface NewSuggestionModalProps {
  onClose: () => void;
}

const NewSuggestionModal: React.FC<NewSuggestionModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    category: '',
    priority: 'medium',
    tags: [] as string[],
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(resolve => setTimeout(resolve, 1000));
    onClose();
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const availableTags = ['Policy', 'Benefits', 'Training', 'Culture', 'Technology', 'Workplace'];
  const departments = ['HR Operations', 'Talent Management', 'Benefits Administration', 'Employee Relations'];
  const categories = ['Policy', 'Training', 'Benefits', 'Culture', 'Technology'];
  const priorities = [
    { value: 'low', label: 'Low', description: 'Nice to have, not time-sensitive' },
    { value: 'medium', label: 'Medium', description: 'Important but not urgent' },
    { value: 'high', label: 'High', description: 'Urgent, needs attention soon' },
    { value: 'urgent', label: 'Urgent', description: 'Critical, requires immediate attention' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Share Your Voice</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-blue-800 font-medium">Submission Guidelines</p>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>Be specific and constructive in your suggestion</li>
                  <li>Provide context and potential benefits</li>
                  <li>Avoid personal grievances or naming individuals</li>
                  <li>Anonymous submissions have limited follow-up options</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isAnonymous: false }))}
                className={`flex-1 p-4 rounded-lg border-2 ${
                  !formData.isAnonymous
                    ? 'border-[#500000] bg-[#500000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User size={24} className={!formData.isAnonymous ? 'text-[#500000]' : 'text-gray-400'} />
                <div className="mt-2 font-medium">Identified</div>
                <div className="text-sm text-gray-600">Submit with your name</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isAnonymous: true }))}
                className={`flex-1 p-4 rounded-lg border-2 ${
                  formData.isAnonymous
                    ? 'border-[#500000] bg-[#500000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Lock size={24} className={formData.isAnonymous ? 'text-[#500000]' : 'text-gray-400'} />
                <div className="mt-2 font-medium">Anonymous</div>
                <div className="text-sm text-gray-600">Submit privately</div>
              </button>
            </div>

            {formData.isAnonymous && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-yellow-700">
                  Anonymous submissions cannot receive direct feedback or updates. Consider submitting identified if you'd like to be involved in the implementation process.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000]"
                placeholder="Enter a clear, concise title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <TextareaAutosize
                required
                minRows={3}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] resize-none"
                placeholder="Provide detailed information about your suggestion"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000]"
                >
                  <option value="">Select a department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000]"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorities.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: value }))}
                    className={`p-3 rounded-lg border-2 text-left ${
                      formData.priority === value
                        ? 'border-[#500000] bg-[#500000]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-gray-600">{description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagChange(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      formData.tags.includes(tag)
                        ? 'bg-[#500000] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#500000] text-white rounded-lg hover:bg-[#400000] transition"
              >
                Submit Suggestion
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewSuggestionModal;