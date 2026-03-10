import { useState, useEffect } from "react";
import { Search, Plus, Pill, AlertCircle, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { getAllMedications, createMedication, deleteMedication, Pharmacy as PharmacyType } from "../services/api";

export default function Pharmacy() {
  const [medications, setMedications] = useState<PharmacyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"inventory" | "prescriptions">("inventory");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Fetch medications from backend on mount
  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    setLoading(true);
    setError(null);
    const result = await getAllMedications();
    if (result.error) {
      setError(result.error);
      toast.error("Failed to load medications", { description: result.error });
    } else {
      setMedications(result.data || []);
    }
    setLoading(false);
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Antibiotics",
    stock: "",
    price: "",
    expiryDate: ""
  });

  const filteredMedications = medications.filter((med) =>
    med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.id?.toString().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Determine stock status based on quantity
  const getStockStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  // Button Handlers
  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(formData.stock);
    const medicationData = {
      name: formData.name,
      category: formData.category,
      stock: stockNum,
      price: parseFloat(formData.price),
      expiryDate: formData.expiryDate,
      status: getStockStatus(stockNum)
    };
    
    const result = await createMedication(medicationData);
    if (result.error) {
      toast.error("Failed to add medicine", { description: result.error });
    } else {
      toast.success("Medicine added!", {
        description: `${formData.name} has been added to the inventory.`
      });
      setMedications([...medications, result.data!]);
      setIsAddModalOpen(false);
      setFormData({ name: "", category: "Antibiotics", stock: "", price: "", expiryDate: "" });
    }
  };

  const handleDeleteMedication = async (med: PharmacyType) => {
    if (!med.id) return;
    const result = await deleteMedication(med.id);
    if (result.error) {
      toast.error("Failed to delete medicine", { description: result.error });
    } else {
      toast.success("Medicine deleted!", {
        description: `${med.name} has been removed.`
      });
      setMedications(medications.filter(m => m.id !== med.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Pharmacy</h1>
          <p className="text-gray-500 mt-1">Manage medicines and prescriptions</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "inventory"
              ? "bg-[#2563EB] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActiveTab("prescriptions")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "prescriptions"
              ? "bg-[#2563EB] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Prescriptions
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === "inventory" ? "medicines" : "prescriptions"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Medicines</p>
              <h3 className="text-2xl font-bold text-[#111827]">
                {loading ? "..." : medications.length || "—"}
              </h3>
            </div>
            <Pill className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">In Stock</p>
              <h3 className="text-2xl font-bold text-green-600">
                {loading ? "..." : medications.filter((m) => m.status === "In Stock").length || "—"}
              </h3>
            </div>
            <PackagePlus className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Low Stock</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {loading ? "..." : medications.filter((m) => m.status === "Low Stock").length || "—"}
              </h3>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
              <h3 className="text-2xl font-bold text-red-600">
                {loading ? "..." : medications.filter((m) => m.status === "Out of Stock").length || "—"}
              </h3>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "inventory" ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedications.length > 0 ? (
                  filteredMedications.map((med) => (
                    <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2563EB]">
                        {med.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">
                        {med.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {med.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {med.stock} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(med.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            med.status || "In Stock"
                          )}`}
                        >
                          {med.status || "In Stock"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Pill className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No medicines in inventory
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Add medicines to start managing your pharmacy inventory.
                        </p>
                        <button 
                          onClick={() => setIsAddModalOpen(true)}
                          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          Add Medicine
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Pill className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Prescriptions Module
            </h3>
            <p className="text-sm text-gray-500">
              Prescription management coming soon. Create prescriptions through appointments.
            </p>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-[#111827] mb-4">Add New Medicine</h2>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock (units)</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

