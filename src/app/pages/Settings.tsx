import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Building2,
  Users,
  Globe,
  Save,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "hospital" | "security" | "notifications" | "staff"
  >("profile");

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: "Dr. Admin",
    lastName: "User",
    email: "admin@healthcare.com",
    phone: "+1 234 567 8900",
    department: "Administration"
  });

  const [hospitalData, setHospitalData] = useState({
    name: "HealthCare+ Hospital",
    address: "123 Medical Center Drive",
    city: "New York",
    zipCode: "10001",
    phone: "+1 234 567 8900",
    email: "info@healthcare.com",
    totalBeds: "200",
    licenseNumber: "HOSP-2024-001"
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    labResults: true,
    weeklyReports: false
  });

  // Button Handlers
  const handleUploadPhoto = () => {
    toast.success("Photo upload", {
      description: "Please select a photo from your device."
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated!", {
      description: "Your profile changes have been saved successfully."
    });
  };

  const handleSaveHospital = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Hospital info updated!", {
      description: "Hospital information has been saved successfully."
    });
  };

  const handleSaveStaff = () => {
    toast.success("Staff member added!", {
      description: "New staff account has been created."
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("Passwords don't match!", {
        description: "Please make sure your new passwords match."
      });
      return;
    }
    toast.success("Password updated!", {
      description: "Your password has been changed successfully."
    });
    setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "", twoFactorEnabled: false });
  };

  const handleToggleTwoFactor = () => {
    setSecurityData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    toast.info("Two-factor authentication", {
      description: securityData.twoFactorEnabled ? "Two-factor disabled." : "Two-factor enabled."
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences saved!", {
      description: "Your notification settings have been updated."
    });
  };

  const handleEditStaff = (name: string) => {
    toast.info("Edit staff", {
      description: `Editing ${name}'s account.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your hospital and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("hospital")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "hospital"
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Hospital Info</span>
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "staff"
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Staff Accounts</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "security"
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Security</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="font-medium">Notifications</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] mb-4">Profile Settings</h2>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    DA
                  </div>
                  <div>
                    <button 
                      onClick={handleUploadPhoto}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        placeholder="Administrator"
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      >
                        <option value="Administration">Administration</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "hospital" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] mb-4">
                    Hospital Information
                  </h2>
                </div>

                <form onSubmit={handleSaveHospital} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        value={hospitalData.name}
                        onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={hospitalData.address}
                        onChange={(e) => setHospitalData({ ...hospitalData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={hospitalData.city}
                        onChange={(e) => setHospitalData({ ...hospitalData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={hospitalData.zipCode}
                        onChange={(e) => setHospitalData({ ...hospitalData, zipCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={hospitalData.phone}
                        onChange={(e) => setHospitalData({ ...hospitalData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={hospitalData.email}
                        onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Beds
                      </label>
                      <input
                        type="number"
                        value={hospitalData.totalBeds}
                        onChange={(e) => setHospitalData({ ...hospitalData, totalBeds: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={hospitalData.licenseNumber}
                        onChange={(e) => setHospitalData({ ...hospitalData, licenseNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "staff" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#111827]">Staff Accounts</h2>
                  <button 
                    onClick={handleSaveStaff}
                    className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Add Staff
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-[#111827]">Dr. Sarah Wilson</td>
                        <td className="px-4 py-3 text-sm text-gray-500">Doctor</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          sarah.wilson@healthcare.com
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button 
                            onClick={() => handleEditStaff("Dr. Sarah Wilson")}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-[#111827]">Nurse Jane Doe</td>
                        <td className="px-4 py-3 text-sm text-gray-500">Nurse</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          jane.doe@healthcare.com
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button 
                            onClick={() => handleEditStaff("Nurse Jane Doe")}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] mb-4">Security Settings</h2>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="font-medium text-[#111827] mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={securityData.twoFactorEnabled}
                          onChange={handleToggleTwoFactor}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827] mb-4">
                    Notification Settings
                  </h2>
                </div>

                <form onSubmit={handleSaveNotifications} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-[#111827]">Email Notifications</h4>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-[#111827]">Appointment Reminders</h4>
                        <p className="text-sm text-gray-500">
                          Get reminders for upcoming appointments
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.appointmentReminders}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, appointmentReminders: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-[#111827]">Emergency Alerts</h4>
                        <p className="text-sm text-gray-500">
                          Receive critical emergency notifications
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.emergencyAlerts}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, emergencyAlerts: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium text-[#111827]">Lab Results</h4>
                        <p className="text-sm text-gray-500">
                          Notifications when lab results are ready
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.labResults}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, labResults: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-[#111827]">Weekly Reports</h4>
                        <p className="text-sm text-gray-500">
                          Receive weekly performance reports
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

