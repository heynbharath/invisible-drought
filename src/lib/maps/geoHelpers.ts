import { geoMercator, geoPath, geoArea } from "d3-geo";
import { FeatureCollection } from "geojson";

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

// Interpolate continuous high-contrast color ramps
export function getIndicatorColor(
  indicator: IndicatorType,
  value: number | null | undefined,
  isOutage: boolean
): string {
  if (isOutage || value === null || value === undefined || value === -999.0) {
    return "#1A2520"; // Masked / unavailable
  }

  if (indicator === "mismatch") {
    return value ? "#F59E0B" : "#131C17"; // Vivid glowing amber for mismatch
  }

  if (indicator === "stress") {
    return value ? "#EF4444" : "#131C17"; // Vivid red for root-zone stress
  }

  // Continuous z-scores clamped to [-2.5, +2.5]
  const clamped = Math.max(-2.5, Math.min(2.5, value));
  const normalized = (clamped + 2.5) / 5.0; // 0.0 (extreme deficit) to 1.0 (extreme surplus)

  if (indicator === "rainfall_z") {
    // High-contrast Amber/Ochre -> Dark Charcoal-Slate -> Vibrant Sky/Azure Blue
    if (normalized < 0.5) {
      const t = normalized / 0.5;
      return interpolateRgb([245, 158, 11], [19, 28, 23], t);
    } else {
      const t = (normalized - 0.5) / 0.5;
      return interpolateRgb([19, 28, 23], [56, 189, 248], t);
    }
  }

  if (indicator === "ndvi_z" || indicator === "evi_z") {
    // High-contrast Coral-Crimson -> Dark Slate -> High-Voltage Emerald Green
    if (normalized < 0.5) {
      const t = normalized / 0.5;
      return interpolateRgb([239, 68, 68], [19, 28, 23], t);
    } else {
      const t = (normalized - 0.5) / 0.5;
      return interpolateRgb([19, 28, 23], [74, 222, 128], t);
    }
  }

  if (indicator === "rootzone_z") {
    // Warm Terracotta -> Dark Slate -> Cyan Hydro
    if (normalized < 0.5) {
      const t = normalized / 0.5;
      return interpolateRgb([249, 115, 22], [19, 28, 23], t);
    } else {
      const t = (normalized - 0.5) / 0.5;
      return interpolateRgb([19, 28, 23], [6, 182, 212], t);
    }
  }

  return "#131C17";
}

function interpolateRgb(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Rewind GeoJSON polygon coordinates if their spherical area exceeds a hemisphere (> 2π).
 * In d3-geo, an inverted winding order causes polygons to be interpreted as covering
 * the entire globe except the small region, producing blank or bounding-box clipping artifacts.
 */
export function normalizeGeojsonWinding<T extends FeatureCollection>(geojson: T): T {
  if (!geojson || !Array.isArray(geojson.features)) return geojson;

  const normalizedFeatures = geojson.features.map((feature) => {
    if (!feature || !feature.geometry) return feature;
    const geom = feature.geometry;

    if (geom.type === "Polygon") {
      const polygonGeom = geom as { type: "Polygon"; coordinates: number[][][] };
      if (geoArea(feature as any) > 2 * Math.PI) {
        return {
          ...feature,
          geometry: {
            ...polygonGeom,
            coordinates: polygonGeom.coordinates.map((ring) => [...ring].reverse()),
          },
        };
      }
    } else if (geom.type === "MultiPolygon") {
      const multiGeom = geom as { type: "MultiPolygon"; coordinates: number[][][][] };
      if (geoArea(feature as any) > 2 * Math.PI) {
        return {
          ...feature,
          geometry: {
            ...multiGeom,
            coordinates: multiGeom.coordinates.map((poly) =>
              poly.map((ring) => [...ring].reverse())
            ),
          },
        };
      }
    }

    return feature;
  });

  return {
    ...geojson,
    features: normalizedFeatures,
  };
}

// Generate D3 Mercator projection fitted to Karnataka bounding box
export function createKarnatakaProjection(width: number, height: number, geojson: FeatureCollection) {
  const normalizedGeojson = normalizeGeojsonWinding(geojson);
  const projection = geoMercator();
  projection.fitExtent(
    [
      [24, 24],
      [width - 24, height - 24],
    ],
    normalizedGeojson as any
  );
  const pathGenerator = geoPath().projection(projection);
  return { projection, pathGenerator, normalizedGeojson };
}
