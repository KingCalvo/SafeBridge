import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserEdit, FaUserTimes } from "react-icons/fa";
import { supabase } from "../../supabase/client";
import Modal from "../../components/Modal";
import Sidebar from "../../components/SidebarAdmin";

const GestionUserAdm = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

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
  });

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
    const { data, error } = await supabase.from("usuario").select(
      `id_usuario, id_rol, nombre, apellido_paterno, apellido_materno, curp, tel, correo, 
         catalogo_roles ( nombre, status )`
    );
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
    if (!window.confirm("¿Seguro quieres eliminar este usuario?")) return;
    const { error } = await supabase
      .from("usuario")
      .delete()
      .eq("id_usuario", id);
    if (!error) fetchUsers();
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
    });
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
    const payload = { ...formData };
    let error;
    if (editingUser) {
      ({ error } = await supabase
        .from("usuario")
        .update(payload)
        .eq("id_usuario", editingUser));
    } else {
      ({ error } = await supabase.from("usuario").insert([payload]));
    }
    if (!error) {
      setShowModal(false);
      fetchUsers();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-x-auto">
        <main className="flex-1 p-6 bg-gray-50">
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
                <option value="">Todos</option>
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
              className="p-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
            >
              <FaUserPlus className="text-2xl" />
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#2C2B2B] text-white">
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
                          className="p-1 hover:text-blue-600"
                        >
                          <FaUserEdit className="text-2xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_usuario)}
                          className="p-1 hover:text-red-600"
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
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

export default GestionUserAdm;
