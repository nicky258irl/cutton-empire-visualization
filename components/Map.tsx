import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { motion } from "framer-motion";
import { HistoricalEvent, CapitalismPhase } from '../types';
import { PHASE_COLORS } from '../constants';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapProps {
  currentEvent: HistoricalEvent;
  events: HistoricalEvent[];
  onMarkerClick: (id: number) => void;
}

const Map: React.FC<MapProps> = ({ currentEvent, events, onMarkerClick }) => {
  return (
    <div className="w-full h-full bg-slate-900 overflow-hidden relative rounded-xl border border-slate-700 shadow-2xl">
      <motion.div 
        className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur p-4 rounded-lg border border-slate-600 z-10 text-xs text-slate-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h4 className="font-bold mb-2 text-white border-b border-slate-600 pb-1">Legend</h4>
        {Object.values(CapitalismPhase).map((phase) => (
          <div key={phase} className="flex items-center gap-2 mb-1">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: PHASE_COLORS[phase] }}
            />
            <span>{phase}</span>
          </div>
        ))}
      </motion.div>

      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
        <ZoomableGroup 
          center={[currentEvent.coordinates.lng, currentEvent.coordinates.lat]} 
          zoom={2}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#334155", outline: "none" },
                    pressed: { fill: "#475569", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {events.map((evt) => {
            const isCurrent = evt.id === currentEvent.id;
            // Only show events up to the current one to simulate history unfolding
            if (evt.id > currentEvent.id) return null;

            return (
              <Marker 
                key={evt.id} 
                coordinates={[evt.coordinates.lng, evt.coordinates.lat]}
                onClick={() => onMarkerClick(evt.id)}
                className="cursor-pointer"
              >
                <motion.circle
                  r={isCurrent ? 8 : 4}
                  fill={PHASE_COLORS[evt.phase]}
                  stroke="#fff"
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1, 
                    r: isCurrent ? 8 : 4,
                    opacity: isCurrent ? 1 : 0.6
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                />
                {isCurrent && (
                  <text
                    textAnchor="middle"
                    y={-15}
                    style={{ fontFamily: "system-ui", fill: "#fff", fontSize: "12px", fontWeight: "bold", textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {evt.locationName}
                  </text>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default Map;
