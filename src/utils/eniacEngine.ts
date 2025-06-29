import { ENIACState, Accumulator, Switch, Connection } from '../types/eniac';

export class ENIACEngine {
  private state: ENIACState;
  private listeners: ((state: ENIACState) => void)[] = [];

  constructor() {
    this.state = this.initializeState();
  }

  private initializeState(): ENIACState {
    const accumulators: Accumulator[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      value: 0,
      digits: Array(10).fill(0),
      isActive: false,
    }));

    const switches: Switch[] = [
      { id: 'op1', position: 0, maxPosition: 9, label: 'Operation 1' },
      { id: 'op2', position: 0, maxPosition: 9, label: 'Operation 2' },
      { id: 'op3', position: 0, maxPosition: 9, label: 'Operation 3' },
      { id: 'addr1', position: 0, maxPosition: 19, label: 'Address 1' },
      { id: 'addr2', position: 0, maxPosition: 19, label: 'Address 2' },
      { id: 'addr3', position: 0, maxPosition: 19, label: 'Address 3' },
      { id: 'timing1', position: 0, maxPosition: 10, label: 'Timing 1' },
      { id: 'timing2', position: 0, maxPosition: 10, label: 'Timing 2' },
    ];

    return {
      accumulators,
      switches,
      connections: [],
      isRunning: false,
      currentStep: 0,
      programCounter: 0,
      cycleCount: 0,
    };
  }

  subscribe(listener: (state: ENIACState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  getState(): ENIACState {
    return { ...this.state };
  }

  setSwitchPosition(switchId: string, position: number) {
    const switchObj = this.state.switches.find(s => s.id === switchId);
    if (switchObj && position >= 0 && position <= switchObj.maxPosition) {
      switchObj.position = position;
      this.notify();
    }
  }

  addConnection(from: string, to: string) {
    // Check if connection already exists
    const existingConnection = this.state.connections.find(
      c => c.from === from && c.to === to
    );
    
    if (!existingConnection) {
      const connection: Connection = {
        id: `${from}-${to}-${Date.now()}`,
        from,
        to,
        active: true,
      };
      this.state.connections.push(connection);
      this.notify();
    }
  }

  removeConnection(connectionId: string) {
    this.state.connections = this.state.connections.filter(c => c.id !== connectionId);
    this.notify();
  }

  setAccumulatorValue(id: number, value: number) {
    const acc = this.state.accumulators.find(a => a.id === id);
    if (acc) {
      acc.value = Math.max(-9999999999, Math.min(9999999999, value));
      acc.digits = this.valueToDigits(acc.value);
      this.notify();
    }
  }

  private valueToDigits(value: number): number[] {
    const digits = Array(10).fill(0);
    const absValue = Math.abs(value);
    const str = absValue.toString().padStart(10, '0');
    
    for (let i = 0; i < 10; i++) {
      digits[9 - i] = parseInt(str[9 - i] || '0');
    }
    
    return digits;
  }

  executeStep() {
    if (!this.state.isRunning) return;

    // Reset all accumulator active states
    this.state.accumulators.forEach(acc => acc.isActive = false);

    // Simple execution logic based on connections and switches
    const op1 = this.state.switches.find(s => s.id === 'op1')?.position || 0;
    const addr1 = this.state.switches.find(s => s.id === 'addr1')?.position || 0;
    const addr2 = this.state.switches.find(s => s.id === 'addr2')?.position || 0;

    // Find active connections involving accumulators
    const activeConnections = this.state.connections.filter(c => c.active);
    
    if (activeConnections.length > 0) {
      // Simulate data flow through connections
      activeConnections.forEach(connection => {
        const fromAcc = this.state.accumulators.find(a => `acc${a.id}` === connection.from);
        const toAcc = this.state.accumulators.find(a => `acc${a.id}` === connection.to);
        
        if (fromAcc && toAcc) {
          fromAcc.isActive = true;
          toAcc.isActive = true;
        }
      });
    } else {
      // Fallback to switch-based operation
      const acc1 = this.state.accumulators[addr1];
      const acc2 = this.state.accumulators[addr2];

      if (acc1 && acc2) {
        acc1.isActive = true;
        acc2.isActive = true;

        switch (op1) {
          case 1: // Addition
            acc1.value += acc2.value;
            break;
          case 2: // Subtraction
            acc1.value -= acc2.value;
            break;
          case 3: // Multiplication (simplified)
            acc1.value = Math.floor(acc1.value * acc2.value / 1000);
            break;
          case 4: // Division (simplified)
            if (acc2.value !== 0) {
              acc1.value = Math.floor(acc1.value * 1000 / acc2.value);
            }
            break;
        }

        acc1.value = Math.max(-9999999999, Math.min(9999999999, acc1.value));
        acc1.digits = this.valueToDigits(acc1.value);
      }
    }

    // Clear active states after a delay
    setTimeout(() => {
      this.state.accumulators.forEach(acc => acc.isActive = false);
      this.notify();
    }, 500);

    this.state.currentStep++;
    this.state.programCounter++;
    
    // Increment cycle count every 10 steps
    if (this.state.currentStep % 10 === 0) {
      this.state.cycleCount++;
    }
    
    this.notify();
  }

  start() {
    this.state.isRunning = true;
    this.notify();
  }

  stop() {
    this.state.isRunning = false;
    this.notify();
  }

  reset() {
    this.state = this.initializeState();
    this.notify();
  }

  clear() {
    this.state.accumulators.forEach(acc => {
      acc.value = 0;
      acc.digits = Array(10).fill(0);
      acc.isActive = false;
    });
    this.state.currentStep = 0;
    this.state.programCounter = 0;
    this.state.cycleCount = 0;
    this.notify();
  }

  exportState() {
    return {
      name: 'ENIAC Program',
      description: 'Exported ENIAC program state',
      switches: this.state.switches,
      connections: this.state.connections,
      initialData: this.state.accumulators.map(acc => acc.value),
      createdAt: new Date().toISOString(),
    };
  }

  importState(program: any) {
    if (program.switches) {
      this.state.switches = program.switches;
    }
    if (program.connections) {
      this.state.connections = program.connections;
    }
    if (program.initialData) {
      program.initialData.forEach((value: number, index: number) => {
        if (index < this.state.accumulators.length) {
          this.setAccumulatorValue(index + 1, value);
        }
      });
    }
    this.notify();
  }
}