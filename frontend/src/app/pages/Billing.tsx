import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, CreditCard, DollarSign, FileText, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { getMyBillings, createBilling, updateBilling, deleteBilling, Billing as BillingType } from "../services/api";

export default function Billing() {
  const navigate = useNavigate();
  const [billings, setBillings] = useState<BillingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch billings from backend on mount
  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    setLoading(true);
    setError(null);
    const result = await getMyBillings();
    if (result.error) {
      setError(result.error);
      toast.error("Failed to load billings", { description: result.error });
    } else {
      setBillings(result.data || []);
    }
    setLoading(false);
  };

  // Form state
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    treatment: "",
    amount: "",
    date: "",
    method: "Cash",
    paymentStatus: "Pending"
  });

  const filteredBillings = billings.filter((billing) => {
    const matchesSearch =
      billing.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.id?.toString().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || billing.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = filteredBillings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const paidAmount = filteredBillings
    .filter((b) => b.paymentStatus === "Paid")
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const pendingAmount = filteredBillings
    .filter((b) => b.paymentStatus === "Pending")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleViewBilling = (billingId: number) => {
    navigate(`/billing/${billingId}`);
  };

  // Button Handlers
  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const billingData = {
      patientName: formData.patientName,
      patientId: formData.patientId,
      treatment: formData.treatment,
      amount: parseFloat(formData.amount),
      date: formData.date,
      method: formData.method,
      paymentStatus: formData.paymentStatus
    };
    
    const result = await createBilling(billingData);
    if (result.error) {
      toast.error("Failed to create invoice", { description: result.error });
    } else {
      toast.success("Invoice created!", {
        description: `Invoice for ${formData.patientName} - $${formData.amount} has been created.`
      });
      setBillings([...billings, result.data!]);
      setIsAddModalOpen(false);
      setFormData({ patientName: "", patientId: "", treatment: "", amount: "", date: "", method: "Cash", paymentStatus: "Pending" });
    }
  };

  const handleDeleteBilling = async (billing: BillingType) => {
    if (!billing.id) return;
    const result = await deleteBilling(billing.id);
    if (result.error) {
      toast.error("Failed to delete invoice", { description: result.error });
    } else {
      toast.success("Invoice deleted!", {
        description: `Invoice for ${billing.patientName} has been removed.`
      });
      setBillings(billings.filter(b => b.id !== billing.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Billing</h1>
          <p className="text-gray-500 mt-1">Manage patient billing and payments</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <h3 className="text-2xl font-bold text-[#111827]">
                ${loading ? "..." : totalAmount.toFixed(2) || "—"}
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Paid</p>
              <h3 className="text-2xl font-bold text-green-600">
                ${loading ? "..." : paidAmount.toFixed(2) || "—"}
              </h3>
            </div>
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                ${loading ? "..." : pendingAmount.toFixed(2) || "—"}
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Invoices</p>
              <h3 className="text-2xl font-bold text-[#111827]">
                {loading ? "..." : billings.length || "—"}
              </h3>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
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
              placeholder="Search invoices by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Billing Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
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
              {filteredBillings.length > 0 ? (
                filteredBillings.map((billing) => (
                  <tr key={billing.id} className="hover:bg-gray-50 transition-colors">
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2563EB] cursor-pointer hover:underline" 
                      onClick={() => billing.id && handleViewBilling(billing.id)}
                      title="Click to view details"
                    >
                      #{billing.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">
                      {billing.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {billing.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {billing.treatment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">
                      ${(billing.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {billing.date ? new Date(billing.date).toLocaleDateString() : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {billing.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          billing.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : billing.paymentStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {billing.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => billing.id && handleViewBilling(billing.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBilling(billing);
                            setFormData({
                              patientName: billing.patientName || "",
                              patientId: billing.patientId || "",
                              treatment: billing.treatment || "",
                              amount: billing.amount?.toString() || "",
                              date: billing.date ? new Date(billing.date).toISOString().split('T')[0] : "",
                              method: billing.method || "Cash",
                              paymentStatus: billing.paymentStatus || "Pending"
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBilling(billing)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <FileText className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No billing records found
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Create invoices to start tracking payments.
                      </p>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        New Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-[#111827] mb-4">Create New Invoice</h2>
            <form onSubmit={handleAddInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                <input
                  type="text"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., General Checkup"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
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
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {isEditModalOpen && selectedBilling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-[#111827] mb-4">Edit Invoice</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!selectedBilling?.id) return;
              setSubmitting(true);
              const result = await updateBilling(selectedBilling.id, {
                ...selectedBilling,
                patientName: formData.patientName,
                patientId: formData.patientId,
                treatment: formData.treatment,
                amount: parseFloat(formData.amount),
                date: formData.date,
                method: formData.method,
                paymentStatus: formData.paymentStatus
              });
              setSubmitting(false);
              if (result.error) {
                toast.error("Failed to update invoice", { description: result.error });
              } else {
                toast.success("Invoice updated successfully!", {
                  description: `Invoice for ${formData.patientName} has been updated.`
                });
                setBillings(billings.map(b => b.id === selectedBilling.id ? result.data! : b));
                setIsEditModalOpen(false);
                setSelectedBilling(null);
                setFormData({ patientName: "", patientId: "", treatment: "", amount: "", date: "", method: "Cash", paymentStatus: "Pending" });
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                <input
                  type="text"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., General Checkup"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedBilling(null);
                    setFormData({ patientName: "", patientId: "", treatment: "", amount: "", date: "", method: "Cash", paymentStatus: "Pending" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Update Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

