export interface Accumulator {
  id: number;
  value: number;
  digits: number[];
  isActive: boolean;
}

export interface Switch {
  id: string;
  position: number;
  maxPosition: number;
  label: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  active: boolean;
}

export interface Program {
  name: string;
  description: string;
  switches: Switch[];
  connections: Connection[];
  initialData: number[];
  createdAt: string;
}

export interface ENIACState {
  accumulators: Accumulator[];
  switches: Switch[];
  connections: Connection[];
  isRunning: boolean;
  currentStep: number;
  programCounter: number;
  cycleCount: number;
}

export type Language = 'en' | 'es' | 'fr' | 'de';
export type Theme = 'light' | 'dark';