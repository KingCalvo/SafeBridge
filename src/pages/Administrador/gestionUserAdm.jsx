import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserEdit, FaUserTimes } from "react-icons/fa";
import { supabase } from "../../supabase/client";
import Modal from "../../components/Modal";
import Sidebar from "../../components/Sidebar";
import bcrypt from "bcryptjs";
import { useNotificacion } from "../../components/NotificacionContext";
import { useAlerta } from "../../components/AlertaContext";

const GestionUserAdm = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [modalError, setModalError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    id_rol: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    curp: "",
    tel: "",
    correo: "",
    password: "",
    confirmPassword: "",
  });
  const { confirmar } = useAlerta();
  const { notify } = useNotificacion();

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from("catalogo_roles")
      .select("id_rol, nombre, status")
      .eq("status", true);
    if (!error) setRoles(data);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("usuario")
      .select(
        `id_usuario, id_rol, nombre, apellido_paterno, apellido_materno, curp, tel, correo, 
         catalogo_roles ( nombre, status )`
      )
      .order("id_usuario", { ascending: true });
    if (!error) {
      setUsers(data);
      setFilteredUsers(data);
    }
  };

  useEffect(() => {
    let temp = [...users];
    if (filterRole)
      temp = temp.filter((u) => u.id_rol === parseInt(filterRole, 10));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(
        (u) =>
          u.nombre.toLowerCase().includes(term) ||
          u.apellido_paterno.toLowerCase().includes(term) ||
          u.apellido_materno.toLowerCase().includes(term) ||
          u.correo.toLowerCase().includes(term)
      );
    }
    setFilteredUsers(temp);
  }, [searchTerm, filterRole, users]);

  const handleDelete = async (id) => {
    const ok = await confirmar(`el usuario con ID ${id}`);
    if (!ok) {
      notify("Operación cancelada.", { type: "success" });
      return;
    }
    const { error } = await supabase
      .from("usuario")
      .delete()
      .eq("id_usuario", id);

    if (error) {
      notify("Error al eliminar usuario: " + error.message, { type: "error" });
    } else {
      notify("Usuario eliminado.", { type: "success" });
      fetchUsers();
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      id_rol: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      curp: "",
      tel: "",
      correo: "",
      password: "",
      confirmPassword: "",
    });
    setModalError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user.id_usuario);
    setFormData({
      id_rol: user.id_rol,
      nombre: user.nombre,
      apellido_paterno: user.apellido_paterno,
      apellido_materno: user.apellido_materno,
      curp: user.curp,
      tel: user.tel,
      correo: user.correo,
    });
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    setModalError("");

    const roleId = parseInt(formData.id_rol, 10);
    if (isNaN(roleId)) {
      setModalError("Debes seleccionar un rol válido.");
      return;
    }

    // Validaciones de contraseña
    if (!editingUser) {
      if (formData.password.length < 6) {
        setModalError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setModalError("Las contraseñas no coinciden.");
        return;
      }
    }

    try {
      const payload = {
        id_rol: roleId,
        nombre: formData.nombre.trim(),
        apellido_paterno: formData.apellido_paterno.trim(),
        apellido_materno: formData.apellido_materno.trim(),
        curp: formData.curp.trim().toUpperCase(),
        tel: formData.tel.trim(),
        correo: formData.correo.trim().toLowerCase(),
      };

      //Solo al agregar: cifrar contraseña y añadir pass
      if (!editingUser) {
        const hashed = await bcrypt.hash(formData.password, 10);
        payload.pass = hashed;
      }

      //Insertar o actualizar
      let error;
      if (editingUser) {
        ({ error } = await supabase
          .from("usuario")
          .update(payload)
          .eq("id_usuario", editingUser));
      } else {
        ({ error } = await supabase.from("usuario").insert([payload]));
      }

      if (error) throw error;

      setShowModal(false);
      fetchUsers();
      if (editingUser) {
        notify("Usuario editado con éxito.", { type: "success" });
      } else {
        notify("Usuario agregado con éxito.", { type: "success" });
      }
    } catch (err) {
      console.error(err);
      notify("Error al guardar usuario: " + err.message, { type: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={1} />
      <div className="ml-64 flex-1">
        <main className="p-8 bg-gray-50">
          <h1 className="text-3xl font-bold mb-4 text-center w-full">
            LISTA DE USUARIOS
          </h1>

          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <IoSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar Usuarios"
                className="w-64 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="border border-gray-300 rounded-lg px-6 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">Todos los usuarios</option>
                {roles.map((r) => (
                  <option key={r.id_rol} value={r.id_rol}>
                    {r.nombre}
                  </option>
                ))}
              </select>
              <CiFilter className="absolute left-0.5 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600" />
            </div>
            <button
              onClick={openAddModal}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
            >
              <FaUserPlus className="text-2xl" />
            </button>
          </div>

          <div className="overflow-auto bg-white rounded-lg shadow mb-6 max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    ID
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Rol
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Apellido Paterno
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Apellido Materno
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    CURP
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Tel.
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Correo
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const rol = user.catalogo_roles?.nombre;
                  const rolColor =
                    rol === "Administrador"
                      ? "#e28000"
                      : rol === "Operador"
                      ? "#ffc340"
                      : rol === "Proteccion Civil"
                      ? "#ffff9a"
                      : "#ccc";

                  const statusActivo = roles.find(
                    (r) => r.id_rol === user.id_rol
                  )?.status;

                  return (
                    <tr key={user.id_usuario}>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {user.id_usuario}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        <span
                          className="px-2 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: rolColor }}
                        >
                          {rol || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {user.nombre}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {user.apellido_paterno}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {user.apellido_materno}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {user.curp}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {user.tel}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-center">
                        {user.correo}
                      </td>
                      <td className="px-4 py-2 text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded-full font-semibold text-white ${
                            statusActivo ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {statusActivo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center space-x-2 flex justify-center">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1 text-green-500 hover:text-green-700 cursor-pointer"
                        >
                          <FaUserEdit className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_usuario)}
                          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <FaUserTimes className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              onSubmit={handleModalSubmit}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {editingUser ? "EDITAR USUARIO" : "AGREGAR USUARIO"}
              </h2>
              <div className="space-y-3">
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.id_rol}
                  onChange={(e) =>
                    setFormData({ ...formData, id_rol: e.target.value })
                  }
                >
                  <option value="">Selecciona Rol</option>
                  {roles.map((r) => (
                    <option key={r.id_rol} value={r.id_rol}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Apellido Paterno"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.apellido_paterno}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellido_paterno: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Apellido Materno"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.apellido_materno}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellido_materno: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="CURP"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.curp}
                  onChange={(e) =>
                    setFormData({ ...formData, curp: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.tel}
                  onChange={(e) =>
                    setFormData({ ...formData, tel: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Correo"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                />
                {/* Contraseña */}
                {!editingUser && (
                  <>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <input
                      type="password"
                      placeholder="Confirmar contraseña"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {modalError && (
                  <div className="text-red-500 text-sm text-center mt-2">
                    {modalError}
                  </div>
                )}
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default GestionUserAdm;
