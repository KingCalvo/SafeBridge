import React from "react";

const ModalInfo = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-2xl shadow-xl w-full max-w-md p-8 relative border-4 border-[#ffc340]">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-black text-2xl cursor-pointer"
        >
          &times;
        </button>
        <div className="mb-6 flex justify-center">
          <div className="w-[20rem] space-y-3">{children}</div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInfo;
