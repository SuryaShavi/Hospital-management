import {
  Users,
  Stethoscope,
  Calendar,
  FileText,
  Bed,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    name: "Total Patients",
    value: "—",
    change: "—",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    name: "Doctors Available",
    value: "—",
    change: "—",
    icon: Stethoscope,
    color: "bg-teal-500",
  },
  {
    name: "Today's Appointments",
    value: "—",
    change: "—",
    icon: Calendar,
    color: "bg-green-500",
  },
  {
    name: "Pending Lab Reports",
    value: "—",
    change: "—",
    icon: FileText,
    color: "bg-orange-500",
  },
  {
    name: "Occupied Beds",
    value: "—",
    change: "—",
    icon: Bed,
    color: "bg-purple-500",
  },
];

const patientVisitsData: { month: string; patients: number }[] = [];

const departmentData: { name: string; workload: number }[] = [];

const bedOccupancyData: { name: string; value: number; color: string }[] = [];

const upcomingAppointments: { id: number; patient: string; doctor: string; time: string; type: string }[] = [];

const recentAdmissions: { id: number; patient: string; age: number; condition: string; status: string }[] = [];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Dr. Admin</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mt-4">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Visits Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Monthly Patient Visits</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={patientVisitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: "#2563EB" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Workload Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Department Workload</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="workload" fill="#14B8A6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bed Occupancy */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Bed Occupancy Rate</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bedOccupancyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bedOccupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">
                      {appointment.patient}
                    </p>
                    <p className="text-xs text-gray-500">{appointment.doctor}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-600 font-medium">
                        {appointment.time}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{appointment.type}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Recent Admissions</h2>
          <div className="space-y-3">
            {recentAdmissions.length > 0 ? (
              recentAdmissions.map((admission) => (
                <div
                  key={admission.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">
                      {admission.patient}, {admission.age}
                    </p>
                    <p className="text-xs text-gray-500">{admission.condition}</p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        admission.status === "Critical"
                          ? "bg-red-100 text-red-700"
                          : admission.status === "Stable"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {admission.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No recent admissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}