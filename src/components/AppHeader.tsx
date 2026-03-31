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

      {/* Quick links */}
      <div className="max-w-4xl mx-auto px-4 pb-2 flex items-center gap-4">
        <Link
          href="/festivals"
          className="text-white/70 hover:text-white text-xs font-lora transition-colors"
        >
          <span className="font-noto-telugu">పండుగలు</span>
          <span className="ml-1">Festivals</span>
        </Link>
        <Link
          href="/muhurtam"
          className="text-white/70 hover:text-white text-xs font-lora transition-colors"
        >
          <span className="font-noto-telugu">ముహూర్తం</span>
          <span className="ml-1">Muhurtam</span>
        </Link>
        <Link
          href="/nakshatra"
          className="text-white/70 hover:text-white text-xs font-lora transition-colors"
        >
          <span className="font-noto-telugu">నక్షత్రం</span>
          <span className="ml-1">Nakshatra</span>
        </Link>
        <Link
          href="/reminders"
          className="text-white/70 hover:text-white text-xs font-lora transition-colors"
        >
          <span className="font-noto-telugu">పితృ స్మరణ</span>
          <span className="ml-1">Reminders</span>
        </Link>
      </div>
    </header>
  );
}
