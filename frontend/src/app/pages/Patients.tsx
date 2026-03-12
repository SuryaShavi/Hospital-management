import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Filter, Download, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { getAllPatients, getAllDoctors, createPatient, updatePatient, deletePatient, Patient } from "../services/api";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<{id?: number; name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Fetch patients and doctor list on mount
  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  // Fetch all patients from API
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    const result = await getAllPatients();
    if (result.error) {
      setError(result.error);
      toast.error("Failed to load patients", {
        description: result.error
      });
    } else {
      setPatients(result.data || []);
    }
    setLoading(false);
  };

  const fetchDoctors = async () => {
    const res = await getAllDoctors();
    if (res.data) {
      setDoctors(res.data);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    contact: "",
    email: "",
    address: "",
    bloodType: "",
    doctor: "", // will store doctor id as string
    status: "Active"
  });

  // Handle form changes (doctor field holds doctor id string)
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id?.toString().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Button Handlers
  const handleExport = () => {
    toast.success("Exporting patients data...", {
      description: "Your export will download automatically"
    });
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const patientData = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      contact: formData.contact,
      email: formData.email,
      address: formData.address,
      bloodType: formData.bloodType,
      doctor: formData.doctor,
      status: formData.status
    };
    
    const result = await createPatient(patientData);
    if (result.error) {
      toast.error("Failed to add patient", {
        description: result.error
      });
    } else {
      toast.success("Patient added successfully!", {
        description: `${formData.name} has been added to the system.`
      });
      setPatients([...patients, result.data!]);
      setIsAddModalOpen(false);
      setFormData({ name: "", age: "", gender: "Male", contact: "", email: "", address: "", bloodType: "", doctor: "", status: "Active" });
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name || "",
      age: patient.age?.toString() || "",
      gender: patient.gender || "Male",
      contact: patient.contact || "",
      email: patient.email || "",
      address: patient.address || "",
      bloodType: patient.bloodType || "",
      doctor: patient.doctor || "",
      status: patient.status || "Active"
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    const updatedPatient: Patient = {
      id: selectedPatient.id,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      contact: formData.contact,
      email: formData.email,
      address: formData.address,
      bloodType: formData.bloodType,
      doctor: formData.doctor,
      status: formData.status
    };
    
    const result = await updatePatient(selectedPatient.id!, updatedPatient);
    if (result.error) {
      toast.error("Failed to update patient", {
        description: result.error
      });
    } else {
      toast.success("Patient updated successfully!", {
        description: `${formData.name}'s information has been updated.`
      });
      setPatients(patients.map(p => p.id === selectedPatient.id ? result.data! : p));
      setIsEditModalOpen(false);
      setSelectedPatient(null);
    }
  };

  const handleDeleteClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPatient?.id) return;
    
    const result = await deletePatient(selectedPatient.id);
    if (result.error) {
      toast.error("Failed to delete patient", {
        description: result.error
      });
    } else {
      toast.success("Patient deleted successfully!", {
        description: `${selectedPatient.name} has been removed from the system.`
      });
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleMoreFilters = () => {
    toast.info("More filters coming soon!", {
      description: "Advanced filtering options will be available."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Patients</h1>
          <p className="text-gray-500 mt-1">Manage patient records and information</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Patients</p>
              <h3 className="text-2xl font-bold text-[#111827]">
                {loading ? "..." : patients.length || "—"}
              </h3>
            </div>
            <UsersIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active</p>
              <h3 className="text-2xl font-bold text-green-600">
                {loading ? "..." : patients.filter((p) => p.status === "Active").length || "—"}
              </h3>
            </div>
            <UsersIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">In Treatment</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {loading ? "..." : patients.filter((p) => p.status === "In Treatment").length || "—"}
              </h3>
            </div>
            <UsersIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Discharged</p>
              <h3 className="text-2xl font-bold text-gray-600">
                {loading ? "..." : patients.filter((p) => p.status === "Discharged").length || "—"}
              </h3>
            </div>
            <UsersIcon className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="In Treatment">In Treatment</option>
              <option value="Discharged">Discharged</option>
            </select>
            <button 
              onClick={handleMoreFilters}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2563EB]">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.doctor && doctors.find(d => String(d.id) === String(patient.doctor))?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          patient.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : patient.status === "In Treatment"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditPatient(patient)}
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(patient)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <UsersIcon className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No patients found
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Add patients to start managing your records.
                      </p>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Add Patient
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-[#111827] mb-4">Add New Patient</h2>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="In Treatment">In Treatment</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-[#111827] mb-4">Edit Patient</h2>
            <form onSubmit={handleUpdatePatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="In Treatment">In Treatment</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setSelectedPatient(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-xl font-semibold text-[#111827] mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedPatient?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setIsDeleteDialogOpen(false); setSelectedPatient(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

