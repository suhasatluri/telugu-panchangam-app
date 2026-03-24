"use client";

import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import CitySearch from "./CitySearch";

export default function AppHeader() {
  return (
    <header className="bg-header-grad">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: App title */}
        <Link href="/" className="flex flex-col">
          <span className="font-noto-telugu text-white text-lg leading-tight">
            తెలుగు పంచాంగం
          </span>
          <span className="font-playfair italic text-white/80 text-xs">
            Telugu Panchangam
          </span>
        </Link>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <CitySearch />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
