import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, User, UserCheck } from "lucide-react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      localStorage.setItem('userRole', selectedRole);
      setLocation('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="text-white text-2xl w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">NeuroLink Dashboard</h1>
            <p className="text-slate-600">Brain-Computer Interface Monitoring System</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Your Role
            </label>
            
            <div 
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedRole === 'Clinician' 
                  ? 'border-primary bg-blue-50 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedRole('Clinician')}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'Clinician' 
                    ? 'border-primary bg-primary' 
                    : 'border-slate-300'
                }`}>
                  {selectedRole === 'Clinician' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <UserCheck className="w-5 h-5 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-800">Clinician</h3>
                  <p className="text-sm text-slate-600">Full access with export capabilities</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedRole === 'Researcher' 
                  ? 'border-primary bg-blue-50 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedRole('Researcher')}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'Researcher' 
                    ? 'border-primary bg-primary' 
                    : 'border-slate-300'
                }`}>
                  {selectedRole === 'Researcher' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <User className="w-5 h-5 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-800">Researcher</h3>
                  <p className="text-sm text-slate-600">View-only access for analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!selectedRole || isLoading}
            className="w-full py-3 h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              'Access Dashboard'
            )}
          </Button>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Secure Medical Data Platform v2.1.3
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
