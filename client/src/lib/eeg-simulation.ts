export interface EegDataPoint {
  timestamp: string;
  value: number;
  time: Date;
}

export class EegSimulator {
  private data: EegDataPoint[] = [];
  private maxPoints: number;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: Array<(data: EegDataPoint[]) => void> = [];

  constructor(maxPoints: number = 50) {
    this.maxPoints = maxPoints;
  }

  start() {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      const now = new Date();
      const newDataPoint: EegDataPoint = {
        timestamp: now.toLocaleTimeString(),
        value: Math.random() * 100, // EEG-like data (0-100 μV)
        time: now,
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
    const headers = "Timestamp,EEG Value (μV)";
    const rows = this.data.map(point => `${point.timestamp},${point.value.toFixed(2)}`);
    return [headers, ...rows].join("\n");
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
