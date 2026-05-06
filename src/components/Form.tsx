import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Contact, Calendar, BookOpen, Send, Loader2 } from 'lucide-react';
import { Student } from '../types';

interface FormProps {
  onSubmit: (data: Omit<Student, 'id' | 'createdAt'>) => Promise<void>;
  isLoading: boolean;
}

const Form: React.FC<FormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    class: '12th Standard'
  });

  const [dob, setDob] = useState({
    day: '',
    month: '',
    year: ''
  });

  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - 15 - i).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.registerNumber || !dob.day || !dob.month || !dob.year) {
      return;
    }
    
    const dateOfBirth = `${dob.day}-${dob.month}-${dob.year}`;
    await onSubmit({ ...formData, dateOfBirth });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-center mb-8 text-glow">Student Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Student Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 w-5 h-5" />
              <input
                required
                type="text"
                placeholder="Enter full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Register Number</label>
            <div className="relative">
              <Contact className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 w-5 h-5" />
              <input
                required
                type="number"
                placeholder="Enter register number"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-500"
                value={formData.registerNumber}
                onChange={(e) => setFormData({...formData, registerNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Date of Birth</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 appearance-none cursor-pointer"
                  value={dob.day}
                  onChange={(e) => setDob({...dob, day: e.target.value})}
                >
                  <option value="" disabled className="bg-slate-900">Day</option>
                  {days.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                </select>
              </div>
              <div className="relative flex-[1.5]">
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 appearance-none cursor-pointer"
                  value={dob.month}
                  onChange={(e) => setDob({...dob, month: e.target.value})}
                >
                  <option value="" disabled className="bg-slate-900">Month</option>
                  {months.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                </select>
              </div>
              <div className="relative flex-1">
                <select
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 appearance-none cursor-pointer"
                  value={dob.year}
                  onChange={(e) => setDob({...dob, year: e.target.value})}
                >
                  <option value="" disabled className="bg-slate-900">Year</option>
                  {years.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 opacity-60">
            <label className="text-sm font-medium text-slate-300 ml-1">Class</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                disabled
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none"
                value={formData.class}
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-4 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(2,132,199,0.3)] hover:shadow-[0_0_30px_rgba(2,132,199,0.5)] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            ) : (
              <>
                Submit Details
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Form;
