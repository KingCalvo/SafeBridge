import React, { createContext, useContext, useState, useCallback } from "react";

const AlertaContext = createContext();

export const useAlerta = () => useContext(AlertaContext);

export const AlertaProvider = ({ children }) => {
  const [current, setCurrent] = useState(null);

  const confirmar = useCallback((texto) => {
    return new Promise((resolve) => {
      setCurrent({ texto, resolve });
    });
  }, []);

  const handleAccept = () => {
    current.resolve(true);
    setCurrent(null);
  };

  const handleCancel = () => {
    current.resolve(false);
    setCurrent(null);
  };

  return (
    <AlertaContext.Provider value={{ confirmar }}>
      {children}

      {current && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl shadow-xl w-full max-w-md p-8 relative border-4 border-[#ffc340]">
            <p className="text-gray-800 mb-4">
              ¿Deseas eliminar {current.texto}?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-700 cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertaContext.Provider>
  );
};
