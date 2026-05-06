import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Background3D from './components/Background3D';
import Form from './components/Form';
import Success from './components/Success';
import AdminPanel from './components/AdminPanel';
import { Page, Student } from './types';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);

  // Logo tap logic for admin panel
  useEffect(() => {
    if (logoTapCount >= 3) {
      setCurrentPage('admin');
      setLogoTapCount(0);
      fetchStudents();
    }
  }, [logoTapCount]);

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const studentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleFormSubmit = async (data: Omit<Student, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'students'), {
        ...data,
        createdAt: serverTimestamp()
      });
      toast.success('Data submitted successfully');
      setCurrentPage('success');
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error('Failed to submit data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('Record deleted');
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="relative min-h-screen text-slate-50 overflow-x-hidden">
      <Background3D />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />

      {/* Header */}
      {currentPage !== 'admin' && (
        <header className="pt-12 pb-8 px-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cursor-pointer mb-6"
            onClick={() => setLogoTapCount(prev => prev + 1)}
          >
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center p-2 neon-glow overflow-hidden group hover:scale-110 transition-transform duration-500">
               <img 
                 src="https://i.ibb.co/Tdjh4TX/file-00000000c01471fdb8b1dfd8ee1124ae.png" 
                 alt="KM Academy Logo" 
                 className="w-full h-full object-contain rounded-full"
                 referrerPolicy="no-referrer"
               />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow mb-2">
              KM ACADEMY
            </h1>
            <p className="text-sky-400 text-lg md:text-xl font-medium tracking-wide uppercase">
              12th Students Data Collection Portal
            </p>
          </motion.div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10 mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Form onSubmit={handleFormSubmit} isLoading={loading} />
            </motion.div>
          )}

          {currentPage === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <Success onBack={() => setCurrentPage('home')} />
            </motion.div>
          )}

          {currentPage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdminPanel 
                students={students} 
                onDelete={handleDeleteStudent} 
                onBack={() => setCurrentPage('home')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {currentPage !== 'admin' && (
        <footer className="absolute bottom-8 w-full text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} KM Academy - Empowering Students Success</p>
        </footer>
      )}
    </div>
  );
};

export default App;
