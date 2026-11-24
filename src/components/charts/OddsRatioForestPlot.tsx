"use client";

import React, { useState } from "react";
import { MODEL_ESTIMATES } from "@/lib/constants/research";
import { ModelEstimate } from "@/types/research";
import { Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function OddsRatioForestPlot() {
  const [selectedModel, setSelectedModel] = useState<ModelEstimate>(MODEL_ESTIMATES[0]);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredModels = MODEL_ESTIMATES.filter((m) => {
    if (filterCategory === "all") return true;
    return m.category === filterCategory;
  });

  // Scale bounds for plot (log scale representation)
  // Min CI ~ 1.18, Max CI ~ 24.1
  const minVal = 0.8;
  const maxVal = 26.0;

  // Logarithmic position calculation
  const getLogPosition = (val: number) => {
    const minLog = Math.log(minVal);
    const maxLog = Math.log(maxVal);
    const valLog = Math.log(Math.max(minVal, Math.min(maxVal, val)));
    return ((valLog - minLog) / (maxLog - minLog)) * 100;
  };

  const nullLinePos = getLogPosition(1.0);

  return (
    <div className="rounded-xl border border-drought-border bg-drought-secondary/90 p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-drought-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-drought-vegetation">
            Statistical Inference Forest Plot
          </span>
          <h3 className="font-serif text-xl font-medium text-drought-text">
            Adjusted Odds Ratios & Robustness Comparisons
          </h3>
          <p className="mt-0.5 text-xs text-drought-textMuted">
            Primary population-averaged GEE model versus sensitivity and subgroup specifications.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          {[
            { id: "all", label: "All Models" },
            { id: "primary", label: "Primary" },
            { id: "sensitivity", label: "Sensitivity" },
            { id: "seasonal", label: "Seasonal" },
            { id: "specification", label: "Specification" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                "rounded px-2.5 py-1 transition-colors",
                filterCategory === cat.id
                  ? "bg-drought-surface border border-drought-vegetation/50 text-drought-vegetationLight"
                  : "text-drought-textDim hover:text-drought-text"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forest Plot Area */}
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[620px]">
          {/* Axis Scale Header */}
          <div className="relative mb-2 h-6 border-b border-drought-border/60 text-[10px] font-mono text-drought-textDim">
            <span className="absolute -translate-x-1/2" style={{ left: `${getLogPosition(1.0)}%` }}>
              1.0 (Null)
            </span>
            <span className="absolute -translate-x-1/2" style={{ left: `${getLogPosition(2.0)}%` }}>
              2.0
            </span>
            <span className="absolute -translate-x-1/2" style={{ left: `${getLogPosition(5.0)}%` }}>
              5.0
            </span>
            <span className="absolute -translate-x-1/2" style={{ left: `${getLogPosition(10.0)}%` }}>
              10.0
            </span>
            <span className="absolute -translate-x-1/2" style={{ left: `${getLogPosition(20.0)}%` }}>
              20.0
            </span>
          </div>

          {/* Model Rows */}
          <div className="relative space-y-4 py-2">
            {/* Dotted Vertical Null Reference Line (OR = 1.0) */}
            <div
              className="absolute top-0 bottom-0 z-0 w-px border-r border-dashed border-drought-alert/60 pointer-events-none"
              style={{ left: `${nullLinePos}%` }}
            />

            {filteredModels.map((model) => {
              const leftPos = getLogPosition(model.ciLower);
              const rightPos = getLogPosition(model.ciUpper);
              const centerPos = getLogPosition(model.oddsRatio);
              const isSelected = selectedModel.id === model.id;

              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={cn(
                    "group relative z-10 flex cursor-pointer flex-col rounded-lg border p-3 transition-all",
                    isSelected
                      ? "border-drought-vegetation/70 bg-drought-surface shadow-subtle"
                      : "border-drought-border/60 bg-drought-bg/60 hover:border-drought-borderLight hover:bg-drought-surface/40"
                  )}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      {model.isPrimary && (
                        <span className="rounded bg-drought-vegetation/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-drought-vegetationLight">
                          PRIMARY
                        </span>
                      )}
                      <span className="font-semibold text-drought-text group-hover:text-drought-highlight transition-colors">
                        {model.name}
                      </span>
                    </div>

                    <div className="font-mono text-xs">
                      <span className="font-bold text-drought-highlight">
                        OR {model.oddsRatio.toFixed(3)}
                      </span>
                      <span className="text-drought-textDim ml-1.5">
                        [95% CI: {model.ciLower.toFixed(3)}–{model.ciUpper.toFixed(3)}]
                      </span>
                      {model.pValueFormatted && (
                        <span className="text-drought-vegetationLight ml-2">
                          p = {model.pValueFormatted}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Bar Graphic */}
                  <div className="relative h-5 w-full">
                    {/* Confidence Interval Line */}
                    <div
                      className={cn(
                        "absolute top-1/2 h-0.5 -translate-y-1/2 rounded transition-colors",
                        model.isPrimary
                          ? "bg-drought-vegetationLight"
                          : model.id === "temporal-ar1"
                          ? "bg-drought-alertLight"
                          : "bg-drought-waterLight"
                      )}
                      style={{
                        left: `${leftPos}%`,
                        width: `${rightPos - leftPos}%`,
                      }}
                    />

                    {/* Left Cap */}
                    <div
                      className="absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 bg-drought-textMuted"
                      style={{ left: `${leftPos}%` }}
                    />

                    {/* Right Cap */}
                    <div
                      className="absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 bg-drought-textMuted"
                      style={{ left: `${rightPos}%` }}
                    />

                    {/* Point Estimate Diamond/Square */}
                    <div
                      className={cn(
                        "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 transition-transform group-hover:scale-125",
                        model.isPrimary
                          ? "bg-drought-vegetation shadow-glow-green"
                          : model.id === "temporal-ar1"
                          ? "bg-drought-alert"
                          : "bg-drought-water"
                      )}
                      style={{ left: `${centerPos}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Model Detailed Inspector */}
      {selectedModel && (
        <div className="mt-5 rounded-lg border border-drought-border bg-drought-bg/80 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-drought-vegetation" />
            <div className="text-xs">
              <span className="font-mono uppercase tracking-wider text-drought-textMuted">
                Model Specification & Interpretation Note
              </span>
              <h4 className="mt-0.5 font-serif text-sm font-medium text-drought-text">
                {selectedModel.name}
              </h4>
              <p className="mt-1 leading-relaxed text-drought-textMuted">
                {selectedModel.description}
              </p>
              {selectedModel.interpretationNotes && (
                <div className="mt-2 rounded border border-drought-border/80 bg-drought-surface/60 p-2 text-drought-highlight font-sans text-[11px] leading-relaxed">
                  <strong>Scientific Takeaway:</strong> {selectedModel.interpretationNotes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
