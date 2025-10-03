import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "../../pages/Dashboard";

export default function DashboardExample() {
  return (
    <AuthProvider>
      <div className="p-6">
        <Dashboard />
      </div>
    </AuthProvider>
  );
}
