import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./components/RootLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Billing from "./pages/Billing";
import Pharmacy from "./pages/Pharmacy";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { authApi, hasPermission, UserRole } from "./services/api";

// Auth loader - redirects to login if not authenticated
const requireAuth = () => {
  if (!authApi.isAuthenticated()) {
    return redirect("/login");
  }
  return null;
};

// Role-based route access checker using request URL
const checkRouteAccess = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const pathName = url.pathname;
  
  const user = authApi.getUser();
  if (!user) {
    return redirect("/login");
  }
  
  // Extract route name from path (e.g., "/patients" -> "patients")
  const routeName = pathName === "/" ? "dashboard" : pathName.replace("/", "");
  
  // Convert to UserRole type
  const userRole = user.role as UserRole;
  
  if (!hasPermission(userRole, routeName)) {
    // Redirect to dashboard if user doesn't have permission
    return redirect("/?unauthorized=true");
  }
  
  return null;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    loader: requireAuth,
    Component: RootLayout,
    children: [
      { 
        index: true, 
        Component: Dashboard,
        loader: checkRouteAccess
      },
      { 
        path: "patients", 
        Component: Patients,
        loader: checkRouteAccess
      },
      { 
        path: "doctors", 
        Component: Doctors,
        loader: checkRouteAccess
      },
      { 
        path: "appointments", 
        Component: Appointments,
        loader: checkRouteAccess
      },
      { 
        path: "medical-records", 
        Component: MedicalRecords,
        loader: checkRouteAccess
      },
      { 
        path: "billing", 
        Component: Billing,
        loader: checkRouteAccess
      },
      { 
        path: "pharmacy", 
        Component: Pharmacy,
        loader: checkRouteAccess
      },
      { 
        path: "reports", 
        Component: Reports,
        loader: checkRouteAccess
      },
      { 
        path: "settings", 
        Component: Settings,
        loader: checkRouteAccess
      },
    ],
  },
]);
