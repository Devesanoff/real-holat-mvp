import { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { CreateIssuePayload } from '../types';
import { CATEGORY_LABELS } from '../types';

interface NewIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateIssuePayload) => void;
}

export function NewIssueModal({ isOpen, onClose, onSubmit }: NewIssueModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('boshqa');
    const [address, setAddress] = useState('');
    const [author, setAuthor] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            category,
            address: address.trim(),
            author: author.trim() || 'Anonim',
            lat: 41.28 + Math.random() * 0.1,
            lng: 69.18 + Math.random() * 0.15,
        });

        setTitle('');
        setDescription('');
        setCategory('boshqa');
        setAddress('');
        setAuthor('');
        onClose();
    };

    const categories = Object.entries(CATEGORY_LABELS).filter(([k]) => k !== 'barchasi');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg mx-4 shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                    <h2 className="text-lg font-semibold text-white">Yangi muammo xabar qilish</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    <InputField
                        label="Sarlavha"
                        value={title}
                        onChange={setTitle}
                        placeholder="Muammo sarlavhasini kiriting"
                        required
                    />

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Tavsif</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Muammoni batafsil tavsiflang..."
                            rows={3}
                            className="w-full px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Kategoriya</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors appearance-none"
                        >
                            {categories.map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <InputField
                        label="Manzil"
                        value={address}
                        onChange={setAddress}
                        placeholder="Ko'cha, tuman, uy raqami"
                    />

                    <InputField
                        label="Ismingiz"
                        value={author}
                        onChange={setAuthor}
                        placeholder="Ismingiz (ixtiyoriy)"
                    />

                    <button
                        type="submit"
                        className="mt-1 w-full h-11 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Send size={15} />
                        Yuborish
                    </button>
                </form>
            </div>
        </div>
    );
}

function InputField({
    label,
    value,
    onChange,
    placeholder,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2.5 text-sm bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
            />
        </div>
    );
}
