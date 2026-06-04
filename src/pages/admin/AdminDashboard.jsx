import React, { useState, useEffect } from "react";
import { Users, UserPlus, Calendar, Activity, Trash2, CheckCircle2, XCircle, Clock, Plus, Pencil, Tag, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/adminApi";
import Button from "../../components/common/Button";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Specialty form state
  const [newSpecialty, setNewSpecialty] = useState("");
  const [editingSpecialty, setEditingSpecialty] = useState(null); // { id, name }
  const [specialtyLoading, setSpecialtyLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, appointmentsData, specialtiesData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAllUsers(),
        adminApi.getAllAppointments(),
        adminApi.getSpecialties(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setAppointments(appointmentsData);
      setSpecialties(specialtiesData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId, role) => {
    if (!window.confirm("Are you sure you want to delete this user? This will also delete their doctor/patient record.")) return;
    
    try {
      await adminApi.deleteUser(userId, role);
      toast.success("User deleted successfully");
      fetchData(); // Refresh all data
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success("Role updated successfully");
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await adminApi.updateAppointmentStatus(appointmentId, newStatus);
      toast.success(`Appointment marked as ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await adminApi.deleteAppointment(appointmentId);
      toast.success("Appointment deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete appointment");
    }
  };

  // ===== SPECIALTY HANDLERS =====
  const handleAddSpecialty = async () => {
    const name = newSpecialty.trim();
    if (!name) {
      toast.error("Please enter a specialty name");
      return;
    }
    setSpecialtyLoading(true);
    try {
      const added = await adminApi.addSpecialty(name);
      setSpecialties((prev) => [...prev, added]);
      setNewSpecialty("");
      toast.success(`"${name}" added successfully!`);
    } catch (err) {
      toast.error(err.message || "Failed to add specialty");
    } finally {
      setSpecialtyLoading(false);
    }
  };

  const handleUpdateSpecialty = async () => {
    if (!editingSpecialty) return;
    const name = editingSpecialty.name.trim();
    if (!name) {
      toast.error("Specialty name cannot be empty");
      return;
    }
    setSpecialtyLoading(true);
    try {
      await adminApi.updateSpecialty(editingSpecialty.id, name);
      setSpecialties((prev) =>
        prev.map((s) => (s.id === editingSpecialty.id ? { ...s, name } : s))
      );
      setEditingSpecialty(null);
      toast.success("Specialty updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update specialty");
    } finally {
      setSpecialtyLoading(false);
    }
  };

  const handleDeleteSpecialty = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await adminApi.deleteSpecialty(id);
      setSpecialties((prev) => prev.filter((s) => s.id !== id));
      toast.success(`"${name}" deleted successfully`);
    } catch (err) {
      toast.error("Failed to delete specialty");
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 ${colorClass}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-gray-500 font-medium text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage the entire hospital system</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
          {["dashboard", "users", "doctors", "patients", "appointments", "specialties"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-[oklch(0.77_0.18_186.55)] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab === "specialties" && <Tag className="w-4 h-4 inline mr-1 -mt-0.5" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "dashboard" && stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="bg-blue-100 text-blue-600" />
                <StatCard title="Total Doctors" value={stats.totalDoctors} icon={Activity} colorClass="bg-teal-100 text-teal-600" />
                <StatCard title="Total Patients" value={stats.totalPatients} icon={UserPlus} colorClass="bg-purple-100 text-purple-600" />
                <StatCard title="Appointments Today" value={stats.todayAppointments} icon={Calendar} colorClass="bg-orange-100 text-orange-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <Clock className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-gray-900">{stats.scheduledCount}</h4>
                    <p className="text-gray-500">Scheduled Appointments</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-gray-900">{stats.confirmedCount}</h4>
                    <p className="text-gray-500">Confirmed Appointments</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-gray-900">{stats.cancelledCount}</h4>
                    <p className="text-gray-500">Cancelled Appointments</p>
                 </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">All System Users</h2>
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{users.length} Users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{u.name || u.username}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={u.role} 
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-brand-red focus:border-brand-red block p-2"
                            disabled={u.role === "admin"}
                          >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => handleDeleteUser(u.id, u.role)}
                             disabled={u.role === "admin"}
                             className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <Trash2 className="w-5 h-5 inline" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === "doctors" || activeTab === "patients") && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 capitalize">Manage {activeTab}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === (activeTab === "doctors" ? "doctor" : "patient")).map(u => (
                      <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                           {u.image && <img src={u.image} alt={u.name} className="w-8 h-8 rounded-full object-cover" />}
                           {u.name || u.username}
                        </td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => handleDeleteUser(u.id, u.role)}
                             className="font-medium text-red-600 hover:text-red-800"
                           >
                             <Trash2 className="w-5 h-5 inline" />
                           </button>
                        </td>
                      </tr>
                    ))}
                    {users.filter(u => u.role === (activeTab === "doctors" ? "doctor" : "patient")).length === 0 && (
                      <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No {activeTab} found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">All Appointments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Date & Time</th>
                      <th className="px-6 py-3">Doctor</th>
                      <th className="px-6 py-3">Patient</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.sort((a,b) => new Date(b.date) - new Date(a.date)).map(apt => (
                      <tr key={apt.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{apt.time}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">Dr. {apt.doctorName}</td>
                        <td className="px-6 py-4">{apt.patientName}</td>
                        <td className="px-6 py-4">
                           <select 
                            value={apt.status} 
                            onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value)}
                            className={`text-xs rounded-full px-2.5 py-1 font-semibold border-0 outline-none
                               ${apt.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                               ${apt.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                               ${apt.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
                               ${apt.status === "completed" ? "bg-gray-100 text-gray-800" : ""}
                            `}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => handleDeleteAppointment(apt.id)}
                             className="font-medium text-red-600 hover:text-red-800"
                           >
                             <Trash2 className="w-5 h-5 inline" />
                           </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No appointments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== SPECIALTIES TAB ===== */}
          {activeTab === "specialties" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Tag className="w-6 h-6 text-[oklch(0.77_0.18_186.55)]" />
                      Manage Specialties
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Add, edit, or remove medical specialties that doctors can choose during registration.
                    </p>
                  </div>
                  <span className="bg-[oklch(0.77_0.18_186.55)]/10 text-[oklch(0.60_0.18_186.55)] text-xs font-semibold px-3 py-1 rounded-full">
                    {specialties.length} Specialties
                  </span>
                </div>
              </div>

              {/* Add New Specialty */}
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add New Specialty</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSpecialty()}
                      placeholder="e.g. Oncology, Radiology..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[oklch(0.77_0.18_186.55)] transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleAddSpecialty}
                    disabled={specialtyLoading || !newSpecialty.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[oklch(0.77_0.18_186.55)] text-white rounded-xl hover:bg-[oklch(0.72_0.18_186.55)] font-semibold transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>

              {/* Specialty List */}
              <div className="divide-y divide-gray-100">
                {specialties.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg font-medium">No specialties yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first specialty above to get started.</p>
                  </div>
                ) : (
                  specialties
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((spec, idx) => (
                      <div
                        key={spec.id}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        {editingSpecialty?.id === spec.id ? (
                          /* Editing Mode */
                          <div className="flex items-center gap-3 flex-1 mr-4">
                            <input
                              type="text"
                              value={editingSpecialty.name}
                              onChange={(e) =>
                                setEditingSpecialty((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdateSpecialty();
                                if (e.key === "Escape") setEditingSpecialty(null);
                              }}
                              autoFocus
                              className="flex-1 border border-[oklch(0.77_0.18_186.55)] rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-[oklch(0.77_0.18_186.55)]"
                            />
                            <button
                              onClick={handleUpdateSpecialty}
                              disabled={specialtyLoading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setEditingSpecialty(null)}
                              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          /* Display Mode */
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[oklch(0.77_0.18_186.55)]/10 flex items-center justify-center text-xs font-bold text-[oklch(0.60_0.18_186.55)]">
                                {idx + 1}
                              </div>
                              <span className="font-medium text-gray-800 text-base">{spec.name}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  setEditingSpecialty({ id: spec.id, name: spec.name })
                                }
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSpecialty(spec.id, spec.name)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
