"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass, Layers, BarChart3, Database, ShieldAlert, BookOpen, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Overview", icon: BookOpen },
  { href: "/research", label: "Research", icon: Info },
  { href: "/methodology", label: "Methodology", icon: Layers },
  { href: "/geospatial-explorer", label: "Explore Map", icon: Compass },
  { href: "/findings", label: "Findings", icon: BarChart3 },
  { href: "/seasonal-analysis", label: "Seasonal", icon: Clock },
  { href: "/data", label: "Data", icon: Database },
  { href: "/reproducibility", label: "Reproducibility", icon: Layers },
  { href: "/limitations", label: "Limitations", icon: ShieldAlert },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-drought-border bg-drought-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Tag */}
        <Link
          href="/"
          className="group flex flex-col focus:outline-none"
          aria-label="The Invisible Drought homepage"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-drought-vegetation opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-drought-vegetation"></span>
            </span>
            <span className="font-serif text-lg font-medium tracking-tight text-drought-text group-hover:text-drought-highlight transition-colors sm:text-xl">
              THE INVISIBLE DROUGHT
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-wider text-drought-textMuted uppercase">
            Karnataka, India &bull; 2016–2024
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium tracking-wide transition-all",
                  isActive
                    ? "bg-drought-surface text-drought-vegetationLight border border-drought-borderLight"
                    : "text-drought-textMuted hover:bg-drought-surface/60 hover:text-drought-text"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/geospatial-explorer"
            className="flex items-center gap-1.5 rounded border border-drought-vegetation/40 bg-drought-vegetation/10 px-3 py-1.5 font-mono text-xs font-medium text-drought-vegetationLight transition-all hover:bg-drought-vegetation/20 hover:border-drought-vegetation hover:shadow-glow-green"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Explore Map</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="rounded p-2 text-drought-textMuted hover:bg-drought-surface hover:text-drought-text"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-drought-border bg-drought-secondary px-4 py-4 lg:hidden">
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-drought-surface text-drought-vegetationLight border border-drought-border"
                      : "text-drought-textMuted hover:bg-drought-surface hover:text-drought-text"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 opacity-75" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/geospatial-explorer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded bg-drought-vegetation/20 border border-drought-vegetation/40 px-3 py-2 font-mono text-xs font-medium text-drought-vegetationLight"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Geospatial Data</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
