export enum CapitalismPhase {
  ORIGINS = 'Origins',
  WAR_CAPITALISM = 'War Capitalism',
  INDUSTRIAL_CAPITALISM = 'Industrial Capitalism',
  GLOBAL_RECONSTRUCTION = 'Global Reconstruction',
  RETURN_OF_SOUTH = 'Return of the Global South',
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HistoricalEvent {
  id: number;
  year: number;
  displayYear: string;
  title: string;
  locationName: string;
  coordinates: Coordinates;
  phase: CapitalismPhase;
  description: string;
  keyFigure?: string;
  impact: string;
}

export interface TradeRoute {
  id: string;
  phase: CapitalismPhase;
  start: [number, number]; // [lng, lat]
  end: [number, number];   // [lng, lat]
  label?: string;
  type: 'cotton' | 'textiles' | 'slaves' | 'machinery';
}

export interface ProductionRegion {
  id: string;
  phase: CapitalismPhase;
  coordinates: [number, number]; // [lng, lat]
  name: string;
  radius: number; // For visual scaling
}
