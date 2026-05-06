import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, FileText, Download, ArrowLeft } from 'lucide-react';
import { Student } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AdminPanelProps {
  students: Student[];
  onDelete: (id: string) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ students, onDelete, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);

  useEffect(() => {
    setFilteredStudents(
      students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registerNumber.includes(searchTerm)
      )
    );
  }, [searchTerm, students]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("KM Academy - 12th Students List", 14, 15);
    
    const tableData = filteredStudents.map(s => [
      s.name, 
      s.registerNumber, 
      s.dateOfBirth, 
      s.class, 
      new Date(s.createdAt?.seconds * 1000).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [['Name', 'Reg No', 'DOB', 'Class', 'Date']],
      body: tableData,
      startY: 20,
    });
    
    doc.save('km_academy_students.pdf');
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Register Number', 'DOB', 'Class', 'Date'];
    const rows = filteredStudents.map(s => [
      s.name,
      s.registerNumber,
      s.dateOfBirth,
      s.class,
      new Date(s.createdAt?.seconds * 1000).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'km_academy_students.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-glow">Admin Panel</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all text-sm font-medium"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      <div className="glass-dark rounded-2xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or register number..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-dark rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/5 text-slate-300 font-semibold border-bottom border-white/10">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Reg No</th>
              <th className="px-6 py-4">DOB</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-slate-300">{student.registerNumber}</td>
                  <td className="px-6 py-4 text-slate-300">{student.dateOfBirth}</td>
                  <td className="px-6 py-4 text-slate-300">{student.class}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {student.createdAt?.seconds 
                      ? new Date(student.createdAt.seconds * 1000).toLocaleDateString()
                      : 'Just now'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => student.id && onDelete(student.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
