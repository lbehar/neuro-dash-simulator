export interface EegDataPoint {
  timestamp: string;
  value: number;
  time: Date;
  isOutOfRange?: boolean;
}

export type SignalMode = 'normal' | 'flatline' | 'seizure';

export class EegSimulator {
  private data: EegDataPoint[] = [];
  private maxPoints: number;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: Array<(data: EegDataPoint[]) => void> = [];
  private signalMode: SignalMode = 'normal';
  private seizurePhase: number = 0;

  constructor(maxPoints: number = 50) {
    this.maxPoints = maxPoints;
  }

  setSignalMode(mode: SignalMode) {
    this.signalMode = mode;
    this.seizurePhase = 0; // Reset seizure phase when switching modes
  }

  getSignalMode(): SignalMode {
    return this.signalMode;
  }

  private generateValue(): number {
    switch (this.signalMode) {
      case 'normal':
        return 30 + Math.random() * 40; // Normal range: 30-70 μV
      
      case 'flatline':
        return 2 + Math.random() * 2; // Very low, consistent signal: 2-4 μV
      
      case 'seizure':
        // Seizure pattern: high amplitude spiky waves
        this.seizurePhase += 0.5;
        const baseValue = 50;
        const spikeAmplitude = 40;
        const noise = (Math.random() - 0.5) * 20;
        return baseValue + Math.sin(this.seizurePhase) * spikeAmplitude + noise;
      
      default:
        return Math.random() * 100;
    }
  }

  start() {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      const now = new Date();
      const value = this.generateValue();
      const isOutOfRange = value < 10 || value > 95; // Alert range: 10-95 μV
      
      const newDataPoint: EegDataPoint = {
        timestamp: now.toLocaleTimeString(),
        value: Math.max(0, Math.min(100, value)), // Clamp to 0-100
        time: now,
        isOutOfRange,
      };

      this.data.push(newDataPoint);
      
      // Keep only the last maxPoints
      if (this.data.length > this.maxPoints) {
        this.data = this.data.slice(-this.maxPoints);
      }

      // Notify all callbacks
      this.callbacks.forEach(callback => callback([...this.data]));
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  subscribe(callback: (data: EegDataPoint[]) => void) {
    this.callbacks.push(callback);
    // Immediately call with current data
    callback([...this.data]);
    
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  getData(): EegDataPoint[] {
    return [...this.data];
  }

  exportToCSV(): string {
    const stats = this.getStats();
    const sessionInfo = [
      "# NeuroLink EEG Data Export",
      `# Export Date: ${new Date().toISOString()}`,
      `# Signal Mode: ${this.signalMode}`,
      `# Total Data Points: ${stats.count}`,
      `# Average Signal: ${stats.average} μV`,
      `# Peak Signal: ${stats.peak} μV`,
      `# Signal Range: ${stats.range} μV`,
      `# Out of Range Points: ${this.data.filter(d => d.isOutOfRange).length}`,
      "#",
    ];
    
    const headers = "Timestamp,EEG Value (μV),Out of Range";
    const rows = this.data.map(point => 
      `${point.timestamp},${point.value.toFixed(2)},${point.isOutOfRange ? 'YES' : 'NO'}`
    );
    
    return [...sessionInfo, headers, ...rows].join("\n");
  }

  getStats() {
    if (this.data.length === 0) {
      return {
        average: 0,
        peak: 0,
        range: 0,
        count: 0,
      };
    }

    const values = this.data.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const peak = Math.max(...values);
    const min = Math.min(...values);
    const range = peak - min;

    return {
      average: Number(average.toFixed(1)),
      peak: Number(peak.toFixed(1)),
      range: Number(range.toFixed(1)),
      count: this.data.length,
    };
  }
}

export const eegSimulator = new EegSimulator();
