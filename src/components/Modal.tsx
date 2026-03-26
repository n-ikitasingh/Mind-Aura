import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md rounded-2xl p-6 bg-card text-card-foreground"
          style={{ boxShadow: 'var(--shadow-lg)', x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <button onClick={onClose} className="btn-ghost rounded-full w-8 h-8 flex items-center justify-center text-lg">×</button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default Modal;
