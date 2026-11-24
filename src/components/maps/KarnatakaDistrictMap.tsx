"use client";

import React, { useState, useMemo } from "react";
import rawGeojson from "@/lib/data/karnataka_districts_27.json";
import { FeatureCollection } from "geojson";
import { createKarnatakaProjection, getIndicatorColor, INDICATOR_CONFIGS, IndicatorType } from "@/lib/maps/geoHelpers";
import { OBSERVATIONS } from "@/lib/data/observations";
import { KARNATAKA_DISTRICTS_27 } from "@/lib/constants/research";
import { Season, ObservationData } from "@/types/research";
import { AlertTriangle, Info, Calendar, Compass, Layers, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const geojsonData = rawGeojson as unknown as FeatureCollection;

interface Props {
  initialYear?: number;
  initialSeason?: Season;
  initialIndicator?: IndicatorType;
  showControls?: boolean;
  className?: string;
}

export function KarnatakaDistrictMap({
  initialYear = 2021,
  initialSeason = "Winter",
  initialIndicator = "mismatch",
  showControls = true,
  className,
}: Props) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedSeason, setSelectedSeason] = useState<Season>(initialSeason);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorType>(initialIndicator);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>("dharwad");

  const isOutageSeason =
    selectedSeason === "Southwest Monsoon" &&
    (selectedYear === 2019 || selectedYear === 2022);

  // Map dimensions for projection
  const mapWidth = 520;
  const mapHeight = 640;

  const { pathGenerator } = useMemo(() => {
    return createKarnatakaProjection(mapWidth, mapHeight, geojsonData);
  }, []);

  // Filter observations for current year and season
  const currentObservations = useMemo(() => {
    const map = new Map<string, ObservationData>();
    OBSERVATIONS.forEach((o) => {
      if (o.year === selectedYear && o.season === selectedSeason) {
        map.set(o.districtId, o);
      }
    });
    return map;
  }, [selectedYear, selectedSeason]);

  // Selected district observation record
  const selectedRecord = selectedDistrictId
    ? currentObservations.get(selectedDistrictId)
    : null;

  const selectedDistrictMeta = KARNATAKA_DISTRICTS_27.find(
    (d) => d.id === selectedDistrictId
  );

  // Summary counts for current slice
  const sliceStats = useMemo(() => {
    if (isOutageSeason) return { candidates: 0, stressed: 0, total: 27, outage: true };
    let candidates = 0;
    let stressed = 0;
    currentObservations.forEach((obs) => {
      if (obs.isMismatchCandidate) candidates++;
      if (obs.isRootzoneStressed) stressed++;
    });
    return { candidates, stressed, total: currentObservations.size, outage: false };
  }, [currentObservations, isOutageSeason]);

  const config = INDICATOR_CONFIGS[selectedIndicator];

  return (
    <div className={cn("flex flex-col rounded-xl border border-drought-border bg-drought-secondary/90 p-4 lg:p-6", className)}>
      {/* Outage Banner if applicable */}
      {isOutageSeason && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-drought-alert/40 bg-drought-alert/10 p-3.5 text-xs text-drought-alertLight">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-drought-alertLight" />
          <div>
            <span className="font-semibold uppercase tracking-wider font-mono">
              SMAP L4 Assimilation Outage Window Excluded
            </span>
            <p className="mt-0.5 text-drought-textMuted leading-relaxed">
              NASA SMAP Level 4 data assimilation telemetry was offline during this season window. All 27 district observations for Southwest Monsoon {selectedYear} are conservatively excluded from the primary research association sample (54 observations excluded overall).
            </p>
          </div>
        </div>
      )}

      {/* Control Bar: Year, Season, Indicator */}
      {showControls && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Year Selector */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-drought-textMuted">
              <Calendar className="h-3.5 w-3.5 text-drought-vegetation" />
              <span>Year: {selectedYear}</span>
            </label>
            <div className="flex flex-wrap gap-1">
              {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={cn(
                    "rounded px-2.5 py-1 font-mono text-xs transition-colors",
                    selectedYear === yr
                      ? "bg-drought-vegetation text-drought-bg font-semibold shadow-sm"
                      : "bg-drought-surface text-drought-textMuted hover:bg-drought-surfaceHover hover:text-drought-text"
                  )}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Season Selector */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-drought-textMuted">
              <Compass className="h-3.5 w-3.5 text-drought-water" />
              <span>Season</span>
            </label>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-1">
              {(["Winter", "Pre-Monsoon", "Southwest Monsoon", "Post-Monsoon"] as Season[]).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSeason(s)}
                    className={cn(
                      "flex items-center justify-between rounded px-2.5 py-1 text-left text-xs transition-colors",
                      selectedSeason === s
                        ? "bg-drought-water text-drought-bg font-semibold shadow-sm"
                        : "bg-drought-surface text-drought-textMuted hover:bg-drought-surfaceHover hover:text-drought-text"
                    )}
                  >
                    <span>{s}</span>
                    <span className="font-mono text-[10px] opacity-75">
                      {s === "Winter"
                        ? "Jan–Feb"
                        : s === "Pre-Monsoon"
                        ? "Mar–May"
                        : s === "Southwest Monsoon"
                        ? "Jun–Sep"
                        : "Oct–Dec"}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Indicator Layer Selector */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-drought-textMuted">
              <Layers className="h-3.5 w-3.5 text-drought-soil" />
              <span>Observation Layer</span>
            </label>
            <div className="flex flex-col space-y-1">
              {(
                [
                  "mismatch",
                  "stress",
                  "rainfall_z",
                  "ndvi_z",
                  "rootzone_z",
                ] as IndicatorType[]
              ).map((ind) => {
                const item = INDICATOR_CONFIGS[ind];
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setSelectedIndicator(ind)}
                    className={cn(
                      "flex items-center justify-between rounded px-2.5 py-1 text-left text-xs transition-colors",
                      selectedIndicator === ind
                        ? "bg-drought-soil text-drought-bg font-semibold shadow-sm"
                        : "bg-drought-surface text-drought-textMuted hover:bg-drought-surfaceHover hover:text-drought-text"
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="font-mono text-[10px] opacity-75 shrink-0 ml-1">
                      {item.source}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Map View & Inspector Panel */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Map Visualization Column */}
        <div className="relative flex flex-col items-center rounded-lg border border-drought-border bg-drought-bg/80 p-2 sm:p-4 lg:col-span-7">
          {/* Map Header / Active Layer Details */}
          <div className="mb-3 flex w-full items-center justify-between border-b border-drought-border/60 pb-2 text-xs">
            <div>
              <span className="font-mono font-medium text-drought-text">
                {config.label}
              </span>
              <span className="ml-2 font-mono text-[10px] text-drought-textDim">
                ({config.source})
              </span>
            </div>
            <div className="font-mono text-[11px] text-drought-vegetationLight">
              {sliceStats.candidates} mismatch &bull; {sliceStats.stressed} stressed
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full max-w-[480px] aspect-[520/640]">
            <svg
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="h-full w-full select-none"
              role="img"
              aria-label={`Geospatial map of Karnataka districts showing ${config.label} for ${selectedSeason} ${selectedYear}`}
            >
              <defs>
                <pattern
                  id="outageHatch"
                  width="8"
                  height="8"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke="#C56E63"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />
                </pattern>
              </defs>

              <g>
                {geojsonData.features.map((feature: any) => {
                  const districtId = feature.properties.id;
                  const districtName = feature.properties.name;
                  const path = pathGenerator(feature as any);
                  const obs = currentObservations.get(districtId);

                  let indicatorVal: number | null | undefined = null;
                  if (obs) {
                    if (selectedIndicator === "mismatch") {
                      indicatorVal = obs.isMismatchCandidate ? 1 : 0;
                    } else if (selectedIndicator === "stress") {
                      indicatorVal = obs.isRootzoneStressed ? 1 : 0;
                    } else if (selectedIndicator === "rainfall_z") {
                      indicatorVal = obs.rainfallZScore;
                    } else if (selectedIndicator === "ndvi_z") {
                      indicatorVal = obs.ndviZScore;
                    } else if (selectedIndicator === "evi_z") {
                      indicatorVal = obs.eviZScore;
                    } else if (selectedIndicator === "rootzone_z") {
                      indicatorVal = obs.rootzoneZScore;
                    }
                  }

                  const fillColor = isOutageSeason
                    ? "url(#outageHatch)"
                    : getIndicatorColor(
                        selectedIndicator,
                        indicatorVal,
                        obs?.isExcludedOutage || false
                      );

                  const isHovered = hoveredDistrictId === districtId;
                  const isSelected = selectedDistrictId === districtId;

                  return (
                    <path
                      key={districtId}
                      d={path || undefined}
                      fill={fillColor}
                      stroke={
                        isSelected
                          ? "#F0F0E8"
                          : isHovered
                          ? "#8BAF72"
                          : "#28382F"
                      }
                      strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 0.8}
                      className="cursor-pointer transition-colors duration-150"
                      onMouseEnter={() => setHoveredDistrictId(districtId)}
                      onMouseLeave={() => setHoveredDistrictId(null)}
                      onClick={() => setSelectedDistrictId(districtId)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${districtName}: ${
                        obs?.isMismatchCandidate
                          ? "Mismatch Candidate"
                          : "Non-mismatch"
                      }, Rootzone Stressed: ${
                        obs?.isRootzoneStressed ? "Yes" : "No"
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedDistrictId(districtId);
                        }
                      }}
                    />
                  );
                })}
              </g>

              {/* District Name Centroid Text Markers */}
              <g pointerEvents="none">
                {geojsonData.features.map((feature: any) => {
                  const districtId = feature.properties.id;
                  const isSelected = selectedDistrictId === districtId;
                  const isHovered = hoveredDistrictId === districtId;
                  const centroid = pathGenerator.centroid(feature as any);
                  if (isNaN(centroid[0]) || isNaN(centroid[1])) return null;

                  return (
                    <text
                      key={`lbl-${districtId}`}
                      x={centroid[0]}
                      y={centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cn(
                        "font-mono transition-opacity select-none",
                        isSelected || isHovered
                          ? "fill-drought-text font-bold text-[11px] opacity-100"
                          : "fill-drought-textMuted text-[8px] opacity-60"
                      )}
                    >
                      {feature.properties.name.split(" ")[0]}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Map Color Legend */}
          <div className="mt-3 w-full border-t border-drought-border/60 pt-2 text-xs">
            {config.type === "binary" ? (
              <div className="flex items-center justify-center gap-6 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-sm border border-drought-border"
                    style={{
                      backgroundColor:
                        selectedIndicator === "mismatch"
                          ? "#C69B65"
                          : "#C56E63",
                    }}
                  ></span>
                  <span>Flagged Condition</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-sm border border-drought-border bg-drought-surface"></span>
                  <span className="text-drought-textMuted">Normal / Unflagged</span>
                </div>
                {isOutageSeason && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-drought-alert/40 bg-drought-alert/20"></span>
                    <span className="text-drought-alertLight">SMAP Outage Excluded</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex w-full max-w-xs items-center justify-between font-mono text-[10px] text-drought-textDim">
                  <span>-2.5σ (Deficit)</span>
                  <span>0.0σ</span>
                  <span>+2.5σ (Surplus)</span>
                </div>
                <div
                  className="h-2 w-full max-w-xs rounded-full border border-drought-border"
                  style={{
                    background:
                      selectedIndicator === "rainfall_z"
                        ? "linear-gradient(to right, rgb(198,155,101), rgb(30,42,35), rgb(109,158,186))"
                        : selectedIndicator === "rootzone_z"
                        ? "linear-gradient(to right, rgb(198,120,80), rgb(30,42,35), rgb(80,150,170))"
                        : "linear-gradient(to right, rgb(197,110,99), rgb(30,42,35), rgb(139,175,114))",
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* District Detail Inspector Drawer */}
        <div className="flex flex-col rounded-lg border border-drought-border bg-drought-surface/90 p-4 lg:col-span-5">
          <div className="border-b border-drought-border pb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-drought-vegetationLight">
              District Detail Inspector
            </span>
            <h3 className="font-serif text-xl font-medium text-drought-text">
              {selectedDistrictMeta?.name || "Select a District"}
            </h3>
            <p className="font-mono text-xs text-drought-textDim">
              Agro-Ecological Region: {selectedDistrictMeta?.administrativeRegion} &bull; Area: {selectedDistrictMeta?.areaKm2.toLocaleString()} km²
            </p>
          </div>

          {selectedRecord ? (
            <div className="mt-4 space-y-4">
              {/* Classification Badges */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={cn(
                    "flex flex-col rounded-md border p-2.5 text-xs",
                    selectedRecord.isMismatchCandidate
                      ? "border-drought-soil/60 bg-drought-soil/10 text-drought-soilLight"
                      : "border-drought-border bg-drought-bg/60 text-drought-textMuted"
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                    Mismatch Candidate
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold">
                    {selectedRecord.isMismatchCandidate ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-drought-soil" />
                        <span>FLAGGED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 opacity-50" />
                        <span>Not Mismatched</span>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex flex-col rounded-md border p-2.5 text-xs",
                    selectedRecord.isRootzoneStressed
                      ? "border-drought-alert/60 bg-drought-alert/10 text-drought-alertLight"
                      : "border-drought-border bg-drought-bg/60 text-drought-textMuted"
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                    Root-Zone Stress
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold">
                    {selectedRecord.isRootzoneStressed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-drought-alert" />
                        <span>STRESSED (z ≤ -1)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 opacity-50" />
                        <span>Normal Moisture</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Indicator Values Table */}
              <div className="rounded-md border border-drought-border bg-drought-bg/40 p-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-drought-textMuted">
                  {selectedSeason} {selectedYear} Measurements
                </span>
                <div className="mt-2 space-y-2.5 text-xs">
                  {/* Rainfall */}
                  <div className="flex items-center justify-between border-b border-drought-border/40 pb-1.5">
                    <div>
                      <div className="font-medium text-drought-text">Seasonal Rainfall</div>
                      <div className="font-mono text-[10px] text-drought-textDim">
                        CHIRPS spatial mean depth
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-drought-waterLight">
                        {selectedRecord.rainfallMm} mm
                      </div>
                      <div className="font-mono text-[10px] text-drought-textMuted">
                        LOYO z: {selectedRecord.rainfallZScore >= 0 ? `+${selectedRecord.rainfallZScore}` : selectedRecord.rainfallZScore}
                      </div>
                    </div>
                  </div>

                  {/* NDVI */}
                  <div className="flex items-center justify-between border-b border-drought-border/40 pb-1.5">
                    <div>
                      <div className="font-medium text-drought-text">Canopy NDVI</div>
                      <div className="font-mono text-[10px] text-drought-textDim">
                        MODIS MOD13Q1 median
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-drought-vegetationLight">
                        {selectedRecord.ndviMean}
                      </div>
                      <div className="font-mono text-[10px] text-drought-textMuted">
                        LOYO z: {selectedRecord.ndviZScore >= 0 ? `+${selectedRecord.ndviZScore}` : selectedRecord.ndviZScore}
                      </div>
                    </div>
                  </div>

                  {/* EVI */}
                  <div className="flex items-center justify-between border-b border-drought-border/40 pb-1.5">
                    <div>
                      <div className="font-medium text-drought-text">Enhanced Veg. Index (EVI)</div>
                      <div className="font-mono text-[10px] text-drought-textDim">
                        MODIS MOD13Q1 median
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-drought-vegetationLight">
                        {selectedRecord.eviMean}
                      </div>
                      <div className="font-mono text-[10px] text-drought-textMuted">
                        LOYO z: {selectedRecord.eviZScore >= 0 ? `+${selectedRecord.eviZScore}` : selectedRecord.eviZScore}
                      </div>
                    </div>
                  </div>

                  {/* Rootzone SM */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-drought-text">Root-Zone Soil Moisture</div>
                      <div className="font-mono text-[10px] text-drought-textDim">
                        SMAP L4 (0–100 cm depth)
                      </div>
                    </div>
                    <div className="text-right">
                      {selectedRecord.isExcludedOutage ? (
                        <span className="font-mono text-[10px] text-drought-alertLight">
                          Outage Excluded
                        </span>
                      ) : (
                        <>
                          <div className="font-mono font-semibold text-drought-soilLight">
                            {selectedRecord.rootzoneSm} m³/m³
                          </div>
                          <div className="font-mono text-[10px] text-drought-textMuted">
                            LOYO z: {selectedRecord.rootzoneZScore >= 0 ? `+${selectedRecord.rootzoneZScore}` : selectedRecord.rootzoneZScore}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* LOYO Definition Callout */}
              <div className="rounded-md border border-drought-border/60 bg-drought-bg/60 p-2.5 text-[11px] leading-relaxed text-drought-textDim">
                <span className="font-mono font-semibold text-drought-text">
                  LOYO Standard:
                </span>{" "}
                Anomaly z-scores compare this district&apos;s {selectedSeason} {selectedYear} against the other 8 study years using sample standard deviation (ddof=1).
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center py-6 text-center text-xs text-drought-textDim">
              <Info className="h-6 w-6 text-drought-border" />
              <p className="mt-2">Select any district polygon on the map to inspect its satellite observations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
