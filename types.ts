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

export interface MapMarkerProps {
  coordinates: Coordinates;
  label: string;
  isActive: boolean;
  phase: CapitalismPhase;
}
