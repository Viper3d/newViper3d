/**
 * ModalViper3D: Modal responsive con imagen de presentación
 * Props:
 * - open: boolean (si está abierto)
 * - onClose: función para cerrar el modal
 */
import { motion, AnimatePresence } from "framer-motion";
import gvPresentacion from "../../../assets/gvPresentacion.webp";

const ModalViper3D = ({ open, onClose }) => {
  console.log("[ModalViper3D] Render", { open });
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 rounded-3xl shadow-2xl p-2 sm:p-6 max-w-[95vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 2147483647 }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.28, type: "spring", bounce: 0.22 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white bg-black/40 hover:bg-red-600 rounded-full p-2 transition text-2xl z-10"
              aria-label="Cerrar"
            >
              ×
            </button>
            <img
              src={gvPresentacion}
              alt="Presentación GarajeVision"
              className="max-w-full max-h-[70vh] rounded-2xl shadow-lg border-4 border-indigo-400 object-contain"
              style={{ boxShadow: "0 4px 32px 0 rgba(49, 130, 206, 0.25)" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalViper3D;
