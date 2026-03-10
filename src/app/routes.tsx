import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Billing from "./pages/Billing";
import Pharmacy from "./pages/Pharmacy";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "patients", Component: Patients },
      { path: "doctors", Component: Doctors },
      { path: "appointments", Component: Appointments },
      { path: "medical-records", Component: MedicalRecords },
      { path: "billing", Component: Billing },
      { path: "pharmacy", Component: Pharmacy },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
