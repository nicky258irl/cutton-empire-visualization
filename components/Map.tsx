import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Line
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { HistoricalEvent, CapitalismPhase } from '../types';
import { PHASE_COLORS, PRODUCTION_REGIONS, TRADE_ROUTES } from '../constants';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapProps {
  currentEvent: HistoricalEvent;
  events: HistoricalEvent[];
  onMarkerClick: (id: number) => void;
}

const Map: React.FC<MapProps> = ({ currentEvent, events, onMarkerClick }) => {
  // Filter for elements relevant to the current phase
  const activeRegions = PRODUCTION_REGIONS.filter(r => r.phase === currentEvent.phase);
  const activeRoutes = TRADE_ROUTES.filter(r => r.phase === currentEvent.phase);

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
            <span className={currentEvent.phase === phase ? "text-white font-medium" : "text-slate-500"}>
              {phase}
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-slate-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-white/50 bg-white/20"></div>
            <span>Production Region</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t border-dashed border-white/50"></div>
            <span>Trade Route</span>
          </div>
        </div>
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

          {/* Render Trade Routes */}
          {activeRoutes.map((route) => (
            <Line
              key={route.id}
              from={route.start}
              to={route.end}
              stroke={PHASE_COLORS[route.phase]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="4 4"
              style={{
                opacity: 0.6,
                animation: "dash 1s linear infinite"
              }}
            />
          ))}

          {/* Render Production Regions */}
          {activeRegions.map((region) => (
            <Marker key={region.id} coordinates={region.coordinates}>
              <motion.circle
                r={region.radius * 2} // Initial sizing
                fill={PHASE_COLORS[region.phase]}
                fillOpacity={0.15}
                stroke={PHASE_COLORS[region.phase]}
                strokeWidth={1}
                strokeDasharray="2 2"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <text
                textAnchor="middle"
                y={region.radius * 2 + 5}
                style={{ 
                  fontFamily: "Inter", 
                  fill: PHASE_COLORS[region.phase], 
                  fontSize: "8px",
                  opacity: 0.8,
                  textShadow: "0px 1px 2px rgba(0,0,0,1)"
                }}
              >
                {region.name}
              </text>
            </Marker>
          ))}

          {/* Render Historical Events (Nodes) */}
          {events.map((evt) => {
            // Only show events up to the current one
            if (evt.id > currentEvent.id) return null;
            const isCurrent = evt.id === currentEvent.id;

            return (
              <Marker 
                key={evt.id} 
                coordinates={[evt.coordinates.lng, evt.coordinates.lat]}
                onClick={() => onMarkerClick(evt.id)}
                className="cursor-pointer"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              >
                {/* Outer Glow for Current Event */}
                {isCurrent && (
                  <motion.circle
                    r={20}
                    fill={PHASE_COLORS[evt.phase]}
                    opacity={0.2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
                
                {/* Main Dot */}
                <motion.circle
                  r={isCurrent ? 6 : 3}
                  fill={isCurrent ? "#fff" : PHASE_COLORS[evt.phase]}
                  stroke={PHASE_COLORS[evt.phase]}
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1, 
                    r: isCurrent ? 6 : 3,
                    opacity: isCurrent ? 1 : 0.6
                  }}
                  whileHover={{ scale: 1.5 }}
                />

                {/* Tooltip Label for Current Event */}
                {isCurrent && (
                  <g transform="translate(0, -25)">
                    <rect
                      x="-60"
                      y="-20"
                      width="120"
                      height="24"
                      rx="4"
                      fill="#0f172a"
                      stroke={PHASE_COLORS[evt.phase]}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="-4"
                      style={{ 
                        fontFamily: "Inter", 
                        fill: "#fff", 
                        fontSize: "10px", 
                        fontWeight: "600" 
                      }}
                    >
                      {evt.locationName}
                    </text>
                  </g>
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
