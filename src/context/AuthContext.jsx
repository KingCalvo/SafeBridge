import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Obtener sesión actual
  const fetchUserData = async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setRol(null);
      return;
    }

    setUser(sessionUser);

    // Obtener rol desde tu tabla
    const { data, error } = await supabase
      .from("usuario")
      .select("id_rol, nombre")
      .eq("user_id", sessionUser.id)
      .single();

    if (!error && data) {
      setRol(data);
    }
  };

  useEffect(() => {
    // 🔥 1. Sesión actual (al recargar)
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserData(session?.user);
      setLoading(false);
    });

    // 🔥 2. Escuchar cambios (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchUserData(session?.user);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, rol, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
