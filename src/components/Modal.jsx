import React from "react";

const Modal = ({ onClose, onSubmit, children }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white text-black rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg mx-4 sm:mx-auto p-4 sm:p-6 lg:p-8 relative border-4 border-[#ffc340]">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-black text-2xl cursor-pointer"
        >
          &times;
        </button>
        <div className="mb-6 flex justify-center">
          <div className="w-full space-y-3">{children}</div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
