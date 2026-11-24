import React from "react";
import Link from "next/link";
import { PROJECT_METADATA, PANEL_METRICS, PRIMARY_GEE_RESULT } from "@/lib/constants/research";
import { KarnatakaDistrictMap } from "@/components/maps/KarnatakaDistrictMap";
import { ThreeDimensionsDiagram } from "@/components/charts/ThreeDimensionsDiagram";
import { OddsRatioForestPlot } from "@/components/charts/OddsRatioForestPlot";
import { SampleFlowDiagram } from "@/components/charts/SampleFlowDiagram";
import {
  Compass,
  ArrowRight,
  Database,
  Layers,
  BarChart3,
  ShieldAlert,
  CloudRain,
  Leaf,
  Waves,
  CheckCircle2,
  Calendar,
  Globe2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-16 lg:space-y-24 pb-16">
      {/* 5.2 HERO SECTION */}
      <section className="relative overflow-hidden border-b border-drought-border bg-gradient-to-b from-drought-secondary via-drought-bg to-drought-bg pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle Satellite Orbital Grid Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(139, 175, 114, 0.15) 0%, transparent 65%),
                              linear-gradient(rgba(40, 56, 47, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(40, 56, 47, 0.3) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Metadata Pill Banner */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="data-badge bg-drought-surface border-drought-border text-drought-highlight">
              <Globe2 className="h-3 w-3 text-drought-vegetation" />
              <span>Karnataka, India</span>
            </span>
            <span className="data-badge bg-drought-surface border-drought-border text-drought-textMuted">
              <Calendar className="h-3 w-3 text-drought-water" />
              <span>2016–2024 (9 Years)</span>
            </span>
            <span className="data-badge bg-drought-surface border-drought-border text-drought-textMuted">
              <Layers className="h-3 w-3 text-drought-soil" />
              <span>27 Historical Districts (GAUL 2015)</span>
            </span>
            <span className="data-badge bg-drought-vegetation/15 border-drought-vegetation/40 text-drought-vegetationLight">
              <span>918 Analyzed District-Seasons</span>
            </span>
            <span className="data-badge bg-drought-water/15 border-drought-water/40 text-drought-waterLight">
              <span>CHIRPS × MODIS × SMAP L4</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-drought-text leading-[1.1]">
                THE INVISIBLE <br />
                <span className="font-normal italic text-drought-highlight">DROUGHT</span>
              </h1>

              <p className="font-serif text-xl sm:text-2xl text-drought-textMuted italic font-light border-l-2 border-drought-soil pl-4">
                &ldquo;When rainfall tells one story, vegetation and soil may tell another.&rdquo;
              </p>

              <p className="text-sm sm:text-base text-drought-textMuted leading-relaxed max-w-2xl">
                An exploratory satellite-based environmental research study investigating whether seasonal rainfall–vegetation mismatches coincide with root-zone soil-moisture stress across Karnataka, India.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/geospatial-explorer"
                  className="flex items-center gap-2 rounded-md bg-drought-vegetation px-5 py-2.5 font-mono text-xs font-semibold text-drought-bg transition-all hover:bg-drought-vegetationLight hover:shadow-glow-green"
                >
                  <Compass className="h-4 w-4" />
                  <span>Launch Geospatial Explorer</span>
                </Link>

                <Link
                  href="/findings"
                  className="flex items-center gap-2 rounded-md border border-drought-border bg-drought-surface px-5 py-2.5 font-mono text-xs font-medium text-drought-text transition-colors hover:border-drought-borderLight hover:bg-drought-surfaceHover"
                >
                  <BarChart3 className="h-4 w-4 text-drought-soil" />
                  <span>View Primary Findings</span>
                </Link>

                <Link
                  href="/methodology"
                  className="flex items-center gap-1.5 font-mono text-xs text-drought-textDim hover:text-drought-text transition-colors"
                >
                  <span>Methodology</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right Metric Callout Card */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-drought-border bg-drought-surface/90 p-6 shadow-editorial backdrop-blur-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-drought-vegetationLight">
                  Headline Association Finding
                </span>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-drought-highlight">
                    OR 5.453
                  </span>
                  <span className="font-mono text-xs text-drought-textDim">
                    (Adjusted Odds Ratio)
                  </span>
                </div>

                <div className="mt-2 font-mono text-xs text-drought-textMuted">
                  95% Wald CI: [2.947, 10.091] &bull; p = 6.61 × 10⁻⁸
                </div>

                <p className="mt-4 text-xs leading-relaxed text-drought-textMuted border-t border-drought-border/60 pt-4">
                  Observations characterized by rainfall–vegetation mismatches exhibited approximately <strong>5.45 times the adjusted odds</strong> of concurrent SMAP L4 root-zone soil moisture stress compared with non-mismatch observations under the primary population-averaged GEE model.
                </p>

                {/* 3 Indicators Mini Status */}
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-drought-border/60 pt-4 text-center">
                  <div className="rounded bg-drought-bg/60 p-2">
                    <CloudRain className="h-4 w-4 mx-auto text-drought-waterLight" />
                    <div className="font-mono text-[10px] text-drought-textDim mt-1">Precipitation</div>
                    <div className="font-mono text-xs text-drought-waterLight font-semibold">z ≥ -0.5</div>
                  </div>
                  <div className="rounded bg-drought-bg/60 p-2">
                    <Leaf className="h-4 w-4 mx-auto text-drought-vegetationLight" />
                    <div className="font-mono text-[10px] text-drought-textDim mt-1">Vegetation</div>
                    <div className="font-mono text-xs text-drought-vegetationLight font-semibold">z ≤ -1.0</div>
                  </div>
                  <div className="rounded bg-drought-bg/60 p-2">
                    <Waves className="h-4 w-4 mx-auto text-drought-soilLight" />
                    <div className="font-mono text-[10px] text-drought-textDim mt-1">Root-Zone</div>
                    <div className="font-mono text-xs text-drought-soilLight font-semibold">z ≤ -1.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.3 RESEARCH OVERVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-drought-soil">
              The Scientific Problem
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-drought-text leading-tight">
              Precipitation alone does not tell the full hydrologic story.
            </h2>
            <p className="text-xs sm:text-sm text-drought-textMuted leading-relaxed">
              Standard meteorological drought definitions rely predominantly on accumulated precipitation deficits. However, precipitation alone does not capture the complex interactions governing soil water retention, high atmospheric vapor pressure deficit (VPD), agricultural irrigation withdrawal, and sub-surface moisture recharge.
            </p>
            <p className="text-xs sm:text-sm text-drought-textMuted leading-relaxed">
              A district may experience rainfall that appears climatologically normal, while remotely sensed vegetation canopy indices exhibit severe stress. This study investigates whether such anomalous disconnects systematically coincide with root-zone soil moisture stress.
            </p>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-drought-border bg-drought-secondary/90 p-6 sm:p-8">
            <span className="font-mono text-xs uppercase tracking-wider text-drought-vegetation">
              Core Research Question
            </span>
            <blockquote className="mt-3 font-serif text-xl sm:text-2xl text-drought-text font-light leading-snug">
              &ldquo;Can seasonal rainfall–vegetation mismatches across Karnataka districts identify periods that coincide with root-zone soil-moisture stress?&rdquo;
            </blockquote>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-drought-border pt-6 text-xs text-drought-textMuted">
              <div>
                <strong className="text-drought-highlight font-medium">What is Investigated:</strong>
                <p className="mt-1 leading-relaxed">
                  Periods where vegetation condition is unusually depressed (NDVI &amp; EVI LOYO z ≤ -1) despite rainfall not being unusually low (Rainfall LOYO z ≥ -0.5).
                </p>
              </div>
              <div>
                <strong className="text-drought-highlight font-medium">What is Evaluated:</strong>
                <p className="mt-1 leading-relaxed">
                  Statistical association with concurrent model/data-assimilation root-zone soil moisture stress (SMAP sm_rootzone LOYO z ≤ -1).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.4 RESEARCH AT A GLANCE (EXACT METRICS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-drought-border pb-4 mb-6">
          <span className="font-mono text-xs uppercase tracking-wider text-drought-textMuted">
            Key Empirical Parameters
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-drought-text">
            Research At A Glance
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg border border-drought-border bg-drought-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-textDim">
              Historical Districts
            </div>
            <div className="font-serif text-3xl font-bold text-drought-text mt-1">
              27
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              FAO GAUL 2015 Level 2
            </div>
          </div>

          <div className="rounded-lg border border-drought-border bg-drought-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-textDim">
              Observation Horizon
            </div>
            <div className="font-serif text-3xl font-bold text-drought-text mt-1">
              9 Years
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              2016–2024 Window
            </div>
          </div>

          <div className="rounded-lg border border-drought-border bg-drought-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-textDim">
              Meteorological Seasons
            </div>
            <div className="font-serif text-3xl font-bold text-drought-text mt-1">
              4 Seasons
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              Win, Pre, SWM, Post
            </div>
          </div>

          <div className="rounded-lg border border-drought-border bg-drought-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-textDim">
              Initial Panel Potential
            </div>
            <div className="font-serif text-3xl font-bold text-drought-text mt-1">
              972
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              27 × 9 × 4 Observations
            </div>
          </div>

          <div className="rounded-lg border border-drought-vegetation/50 bg-drought-vegetation/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-vegetationLight">
              Final Analytic Sample
            </div>
            <div className="font-serif text-3xl font-bold text-drought-vegetationLight mt-1">
              918
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              54 SMAP outages excluded
            </div>
          </div>

          <div className="rounded-lg border border-drought-soil/50 bg-drought-soil/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-soilLight">
              Mismatch Candidates
            </div>
            <div className="font-serif text-3xl font-bold text-drought-soilLight mt-1">
              40
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              4.36% of analyzed panel
            </div>
          </div>

          <div className="rounded-lg border border-drought-alert/50 bg-drought-alert/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-alertLight">
              Root-Zone Stress Events
            </div>
            <div className="font-serif text-3xl font-bold text-drought-alertLight mt-1">
              216
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              SMAP sm_rootzone z ≤ -1
            </div>
          </div>

          <div className="rounded-lg border border-drought-water/50 bg-drought-water/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-drought-waterLight">
              Earth Observation Datasets
            </div>
            <div className="font-serif text-3xl font-bold text-drought-waterLight mt-1">
              3
            </div>
            <div className="font-mono text-[10px] text-drought-textMuted mt-1">
              CHIRPS, MODIS, SMAP L4
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 THREE SCIENTIFIC DIMENSIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ThreeDimensionsDiagram />
      </section>

      {/* GEOSPATIAL EXPLORER PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-drought-border pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-drought-vegetation">
              Interactive Geospatial Intelligence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-drought-text">
              Karnataka District-Season Spatial Map
            </h2>
            <p className="mt-1 text-xs text-drought-textMuted">
              Inspect historical satellite observations across all 27 historical districts from 2016 to 2024.
            </p>
          </div>

          <Link
            href="/geospatial-explorer"
            className="mt-3 sm:mt-0 flex items-center gap-1.5 font-mono text-xs text-drought-vegetationLight hover:underline"
          >
            <span>Open Full Screen Explorer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <KarnatakaDistrictMap initialYear={2021} initialSeason="Winter" initialIndicator="mismatch" />
      </section>

      {/* PRIMARY STATISTICAL FINDINGS PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <OddsRatioForestPlot />
      </section>

      {/* SAMPLE ATTRITION FLOW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SampleFlowDiagram />
      </section>

      {/* SCIENTIFIC LIMITATIONS & TRANSPARENCY NOTICE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-drought-alert/40 bg-drought-secondary/90 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-drought-alertLight shrink-0 mt-1" />
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-drought-alertLight font-semibold">
                Core Scientific Limitations &amp; Boundary of Claims
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-drought-text">
                What this research establishes — and what it does not.
              </h3>
              <p className="text-xs sm:text-sm text-drought-textMuted leading-relaxed">
                This study establishes a strong, statistically significant adjusted association (OR 5.453) between seasonal rainfall–vegetation mismatches and SMAP L4 root-zone soil moisture stress across Karnataka. However, rigorous scientific transparency requires stating its explicit boundaries:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="rounded border border-drought-border bg-drought-bg/60 p-3">
                  <strong className="text-drought-text block font-mono text-[11px] mb-1">
                    1. No Causality
                  </strong>
                  Observational co-occurrence does not establish direction of physical causation between canopy indices and soil moisture.
                </div>
                <div className="rounded border border-drought-border bg-drought-bg/60 p-3">
                  <strong className="text-drought-text block font-mono text-[11px] mb-1">
                    2. No Crop Yield Claims
                  </strong>
                  NDVI and EVI are spectral vegetation proxies. The study does not measure farmer harvest losses or economic yield impact.
                </div>
                <div className="rounded border border-drought-border bg-drought-bg/60 p-3">
                  <strong className="text-drought-text block font-mono text-[11px] mb-1">
                    3. Residual Spatial Clustering
                  </strong>
                  Model residuals exhibit positive spatial autocorrelation (Moran&apos;s I = 0.3036, p = 0.0086), indicating spatial dependencies remain.
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/limitations"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-drought-alertLight hover:underline"
                >
                  <span>Review all 15 explicit scientific limitations</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-xl border border-drought-border bg-gradient-to-b from-drought-surface to-drought-secondary p-8 sm:p-12">
          <span className="font-mono text-xs uppercase tracking-wider text-drought-highlight">
            Explore The Complete Research Platform
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-drought-text mt-2 max-w-2xl mx-auto">
            Transparent Data, Open Methodology, and Reproducible Code
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-drought-textMuted max-w-xl mx-auto leading-relaxed">
            Access the complete data dictionary, step-by-step statistical formulas, seasonal subgroup analyses, and the 13-phase workflow pipeline.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/methodology"
              className="rounded bg-drought-vegetation px-5 py-2.5 font-mono text-xs font-semibold text-drought-bg hover:bg-drought-vegetationLight transition-colors shadow-glow-green"
            >
              Explore Research Methodology
            </Link>
            <Link
              href="/data"
              className="rounded border border-drought-border bg-drought-bg px-5 py-2.5 font-mono text-xs font-medium text-drought-text hover:bg-drought-surface transition-colors"
            >
              Browse Data Dictionary
            </Link>
            <Link
              href="/reproducibility"
              className="rounded border border-drought-border bg-drought-bg px-5 py-2.5 font-mono text-xs font-medium text-drought-text hover:bg-drought-surface transition-colors"
            >
              Replication Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
