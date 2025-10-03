import { AuthProvider } from "@/contexts/AuthContext";
import { ChatInterface } from "../ChatInterface";

export default function ChatInterfaceExample() {
  return (
    <AuthProvider>
      <div className="h-[600px]">
        <ChatInterface />
      </div>
    </AuthProvider>
  );
}
