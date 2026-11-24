import { geoMercator, geoPath } from "d3-geo";
import { FeatureCollection, Geometry } from "geojson";

export type IndicatorType =
  | "rainfall_z"
  | "ndvi_z"
  | "evi_z"
  | "rootzone_z"
  | "mismatch"
  | "stress";

export interface IndicatorConfig {
  id: IndicatorType;
  label: string;
  source: string;
  unit: string;
  min: number;
  max: number;
  description: string;
  type: "continuous" | "binary";
}

export const INDICATOR_CONFIGS: Record<IndicatorType, IndicatorConfig> = {
  rainfall_z: {
    id: "rainfall_z",
    label: "Rainfall Anomaly (LOYO z)",
    source: "CHIRPS V2.0",
    unit: "Standard Deviations (z)",
    min: -2.5,
    max: 2.5,
    description: "District spatial mean rainfall anomaly relative to other 8 years",
    type: "continuous",
  },
  ndvi_z: {
    id: "ndvi_z",
    label: "NDVI Vegetation Anomaly (LOYO z)",
    source: "MODIS MOD13Q1",
    unit: "Standard Deviations (z)",
    min: -2.5,
    max: 2.5,
    description: "Canopy greenness anomaly; z ≤ -1.0 indicates severe vegetative stress",
    type: "continuous",
  },
  evi_z: {
    id: "evi_z",
    label: "EVI Vegetation Anomaly (LOYO z)",
    source: "MODIS MOD13Q1",
    unit: "Standard Deviations (z)",
    min: -2.5,
    max: 2.5,
    description: "Enhanced vegetation anomaly reducing atmospheric and canopy background distortion",
    type: "continuous",
  },
  rootzone_z: {
    id: "rootzone_z",
    label: "Root-Zone Soil Moisture Anomaly (LOYO z)",
    source: "NASA SMAP L4",
    unit: "Standard Deviations (z)",
    min: -2.5,
    max: 2.5,
    description: "Assimilation-based soil moisture anomaly in 0–100 cm depth column",
    type: "continuous",
  },
  mismatch: {
    id: "mismatch",
    label: "Rainfall–Vegetation Mismatch",
    source: "CHIRPS + MODIS Rule",
    unit: "Binary (Candidate / Normal)",
    min: 0,
    max: 1,
    description: "Flagged if NDVI ≤ -1 AND EVI ≤ -1 AND Rainfall ≥ -0.5",
    type: "binary",
  },
  stress: {
    id: "stress",
    label: "Root-Zone Moisture Stress",
    source: "SMAP L4 Rule",
    unit: "Binary (Stressed / Normal)",
    min: 0,
    max: 1,
    description: "Flagged if SMAP sm_rootzone LOYO z ≤ -1.0",
    type: "binary",
  },
};

// Interpolate continuous color ramps
export function getIndicatorColor(
  indicator: IndicatorType,
  value: number | null | undefined,
  isOutage: boolean
): string {
  if (isOutage || value === null || value === undefined || value === -999.0) {
    return "#28382F"; // Masked / unavailable
  }

  if (indicator === "mismatch") {
    return value ? "#C69B65" : "#18221C"; // Amber for mismatch candidate
  }

  if (indicator === "stress") {
    return value ? "#C56E63" : "#18221C"; // Alert red for root-zone stress
  }

  // Continuous z-scores clamped to [-2.5, +2.5]
  const clamped = Math.max(-2.5, Math.min(2.5, value));
  const normalized = (clamped + 2.5) / 5.0; // 0.0 (extreme deficit) to 1.0 (extreme surplus)

  if (indicator === "rainfall_z") {
    // Brown -> Muted Gray -> Water Blue
    if (normalized < 0.5) {
      // Deficit: interpolate from amber/brown to dark slate
      const t = normalized / 0.5;
      return interpolateRgb([198, 155, 101], [30, 42, 35], t);
    } else {
      // Surplus: interpolate from dark slate to vivid water blue
      const t = (normalized - 0.5) / 0.5;
      return interpolateRgb([30, 42, 35], [109, 158, 186], t);
    }
  }

  if (indicator === "ndvi_z" || indicator === "evi_z") {
    // Burnt Sienna/Dry Ochre -> Dark Charcoal -> Lush Vegetation Green
    if (normalized < 0.5) {
      const t = normalized / 0.5;
      return interpolateRgb([197, 110, 99], [30, 42, 35], t);
    } else {
      const t = (normalized - 0.5) / 0.5;
      return interpolateRgb([30, 42, 35], [139, 175, 114], t);
    }
  }

  if (indicator === "rootzone_z") {
    // Dry Earth Brown -> Neutral -> Deep Hydrologic Teal
    if (normalized < 0.5) {
      const t = normalized / 0.5;
      return interpolateRgb([198, 120, 80], [30, 42, 35], t);
    } else {
      const t = (normalized - 0.5) / 0.5;
      return interpolateRgb([30, 42, 35], [80, 150, 170], t);
    }
  }

  return "#18221C";
}

function interpolateRgb(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Generate D3 Mercator projection fitted to Karnataka bounding box
export function createKarnatakaProjection(width: number, height: number, geojson: FeatureCollection) {
  const projection = geoMercator();
  projection.fitExtent(
    [
      [20, 20],
      [width - 20, height - 20],
    ],
    geojson as any
  );
  const pathGenerator = geoPath().projection(projection);
  return { projection, pathGenerator };
}
