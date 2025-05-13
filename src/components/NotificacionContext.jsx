import React, { createContext, useContext, useState, useCallback } from "react";
import { GoAlert } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { v4 as uuid } from "uuid";

const NotificationContext = createContext();

export const useNotificacion = () => useContext(NotificationContext);

export const NotificacionContext = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback((message, { type = "success" } = {}) => {
    const id = uuid();
    const duration = type === "error" ? 10000 : 3000;

    setNotifications((toasts) => [...toasts, { id, message, type, duration }]);

    // auto‐dismiss
    setTimeout(() => {
      setNotifications((toasts) => toasts.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {/* aquí renderizamos el “container” de toasts */}
      <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
        {notifications.map(({ id, message, type }) => (
          <div
            key={id}
            className={`
              flex items-center space-x-2
              p-2 pl-3 pr-4 rounded shadow
              max-w-xs
              ${
                type === "error"
                  ? "bg-red-100 border border-red-500 text-red-800"
                  : "bg-green-100 border border-green-500 text-green-800"
              }
            `}
          >
            <span className="text-xl">
              {type === "error" ? <GoAlert /> : <FaCheck />}
            </span>
            <span className="text-sm">{message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
