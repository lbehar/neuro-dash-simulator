import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { eegSimulator, type EegDataPoint } from "@/lib/eeg-simulation";
import { 
  Brain, 
  LogOut, 
  User, 
  Clock, 
  TrendingUp, 
  Play, 
  Pause, 
  Download, 
  Lock 
} from "lucide-react";

// Chart.js imports
declare global {
  interface Window {
    Chart: any;
  }
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [userRole, setUserRole] = useState<string>("");
  const [eegData, setEegData] = useState<EegDataPoint[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRecording, setIsRecording] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  // Mock patient data
  const patientData = {
    name: "Sarah Johnson",
    id: "NK-2024-0892",
    age: "34 years",
    sessionId: "S-20241201-147",
    startTime: "14:32:18",
    duration: "00:12:45",
    signalStatus: "Excellent",
    channels: "8/8 Active",
    impedance: "< 5kΩ"
  };

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (!savedRole) {
      setLocation('/');
      return;
    }
    setUserRole(savedRole);

    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      if (isRecording) {
        eegSimulator.start();
      }
    };
    document.head.appendChild(script);

    return () => {
      eegSimulator.stop();
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [setLocation]);

  useEffect(() => {
    const unsubscribe = eegSimulator.subscribe((data) => {
      setEegData(data);
      setCurrentTime(new Date());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (window.Chart && chartRef.current && eegData.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: eegData.map(d => d.timestamp),
          datasets: [{
            label: 'EEG Signal (μV)',
            data: eegData.map(d => d.value),
            borderColor: 'hsl(207, 90%, 54%)',
            backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 4,
            pointBackgroundColor: 'hsl(207, 90%, 54%)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 750,
            easing: 'easeInOutQuart'
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(100, 116, 139, 0.1)',
              },
              ticks: {
                color: '#64748b',
                font: {
                  family: 'Inter',
                  size: 12
                }
              }
            },
            x: {
              grid: {
                color: 'rgba(100, 116, 139, 0.1)',
              },
              ticks: {
                color: '#64748b',
                maxTicksLimit: 10,
                font: {
                  family: 'Inter',
                  size: 12
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top' as const,
              labels: {
                color: '#1e293b',
                font: {
                  family: 'Inter',
                  size: 14,
                  weight: '500'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: 'hsl(207, 90%, 54%)',
              borderWidth: 1,
              cornerRadius: 8,
              titleFont: {
                family: 'Inter',
                size: 14,
                weight: '600'
              },
              bodyFont: {
                family: 'Inter',
                size: 13
              }
            }
          }
        }
      });
    }
  }, [eegData]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    eegSimulator.stop();
    setLocation('/');
  };

  const toggleRecording = () => {
    if (isRecording) {
      eegSimulator.stop();
    } else {
      eegSimulator.start();
    }
    setIsRecording(!isRecording);
  };

  const exportToCSV = () => {
    const csvContent = eegSimulator.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eeg_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const stats = eegSimulator.getStats();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="text-white w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">NeuroLink Dashboard</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                <span className="text-sm text-slate-600">
                  {isRecording ? 'Recording' : 'Paused'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-slate-700">
                  {userRole}
                </span>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Patient Information</h3>
                  <p className="text-sm text-slate-600">Active Session</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Name:</span> {patientData.name}</p>
                <p className="text-sm"><span className="font-medium">ID:</span> {patientData.id}</p>
                <p className="text-sm"><span className="font-medium">Age:</span> {patientData.age}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Session Details</h3>
                  <p className="text-sm text-slate-600">Current Monitoring</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Session ID:</span> {patientData.sessionId}</p>
                <p className="text-sm"><span className="font-medium">Started:</span> {patientData.startTime}</p>
                <p className="text-sm"><span className="font-medium">Duration:</span> {patientData.duration}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Signal Quality</h3>
                  <p className="text-sm text-slate-600">Real-time Status</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">{patientData.signalStatus}</span></p>
                <p className="text-sm"><span className="font-medium">Channels:</span> {patientData.channels}</p>
                <p className="text-sm"><span className="font-medium">Impedance:</span> {patientData.impedance}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Real-Time EEG Monitoring</h2>
                <p className="text-sm text-slate-600">
                  Live neural signal data • Last updated: {currentTime.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  onClick={toggleRecording}
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                >
                  {isRecording ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRecording ? 'Pause' : 'Resume'}
                </Button>
                
                {userRole === 'Clinician' ? (
                  <Button
                    onClick={exportToCSV}
                    disabled={eegData.length === 0}
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="secondary"
                    size="sm"
                    className="cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Export Restricted
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4" style={{ height: '400px' }}>
              <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center space-x-4">
                <span>Data Points: <span className="font-medium">{stats.count}</span></span>
                <span>Sample Rate: <span className="font-medium">1 Hz</span></span>
                <span>Range: <span className="font-medium">0-100 μV</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>EEG Signal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Summary */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Session Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {stats.average}
                </div>
                <div className="text-sm text-slate-600">Average (μV)</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.peak}
                </div>
                <div className="text-sm text-slate-600">Peak (μV)</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {stats.range}
                </div>
                <div className="text-sm text-slate-600">Range (μV)</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-700">
                  {isRecording ? 'Stable' : 'Paused'}
                </div>
                <div className="text-sm text-slate-600">Signal Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
