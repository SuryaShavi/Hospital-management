import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CreditCard, DollarSign, Calendar, FileText, User, Stethoscope, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getBillingById, deleteBilling, Billing as BillingType } from "../services/api";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function BillingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<BillingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No billing ID provided");
      setLoading(false);
      return;
    }
    
    const fetchBilling = async () => {
      const billingId = parseInt(id, 10);
      if (isNaN(billingId)) {
        setError("Invalid billing ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const result = await getBillingById(billingId);
      if (result.error) {
        setError(result.error);
        toast.error("Failed to load billing details", { description: result.error });
      } else {
        setBilling(result.data!);
      }
      setLoading(false);
    };

    fetchBilling();
  }, [id]);

  const handleDelete = async () => {
    if (!billing?.id || !confirm(`Delete invoice #${billing.id} for ${billing.patientName}?`)) return;
    
    setDeleting(true);
    const result = await deleteBilling(billing.id);
    setDeleting(false);
    
    if (result.error) {
      toast.error("Failed to delete invoice", { description: result.error });
    } else {
      toast.success("Invoice deleted successfully!");
      navigate("/billing");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !billing) {
    return (
      <div className="space-y-4 text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "Billing record could not be loaded."}</p>
        <Button onClick={() => navigate("/billing")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Billings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/billing")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Billings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">Invoice #{billing.id}</h1>
            <p className="text-gray-500">Detailed view of patient billing</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Billing Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Billing Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Patient Name:</span>
                <p className="font-medium text-[#111827] mt-1">{billing.patientName || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-500">Patient ID:</span>
                <p className="font-medium text-[#111827] mt-1">{billing.patientId || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-500">Treatment:</span>
                <p className="font-medium text-[#111827] mt-1">{billing.treatment || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <p className="font-medium text-[#111827] mt-1">
                  {billing.date ? new Date(billing.date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Payment Method:</span>
                <p className="font-medium text-[#111827] mt-1">{billing.method || 'N/A'}</p>
              </div>
            </div>
            
            {/* Amount Highlight */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#111827]">
                  Total: ${(billing.amount || 0).toFixed(2)}
                </span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  billing.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : billing.paymentStatus === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {billing.paymentStatus || 'Unknown'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage this invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start gap-2"
              variant="outline"
              onClick={() => navigate("/billing")}
            >
              <Pencil className="w-4 h-4" />
              Edit Invoice
            </Button>
            <Button 
              className="w-full justify-start gap-2"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete Invoice"}
            </Button>
            <Button className="w-full" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/billing")}
            >
              <ArrowLeft className="w-4 h-4" />
              View All Invoices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{billing.patientName || 'N/A'}</p>
            <p className="text-xs text-muted-foreground mt-1">ID: {billing.patientId || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment</CardTitle>
            <Stethoscope className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{billing.treatment || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-lg font-semibold">
              {billing.date ? new Date(billing.date).toLocaleDateString() : 'N/A'}
            </p>
            {billing.date && (
              <p className="text-xs text-muted-foreground">
                {new Date(billing.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

