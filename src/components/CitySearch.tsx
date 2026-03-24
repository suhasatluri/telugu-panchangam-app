"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCity, setCity } from "@/lib/cache";
import type { CityInfo } from "@/lib/cache";

interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
  timezone: string;
}

export default function CitySearch() {
  const [city, setCityState] = useState<CityInfo | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCityState(getCity());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setResults(
            Array.isArray(json.data) ? json.data : [json.data]
          );
        }
      }
    } catch {
      // Geocoding failed — ignore silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInput = useCallback(
    (value: string) => {
      setQuery(value);
      setIsOpen(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(value), 300);
    },
    [search]
  );

  const selectCity = useCallback(
    (result: GeocodeResult) => {
      const newCity: CityInfo = {
        name: result.displayName.split(",")[0],
        lat: result.lat,
        lng: result.lng,
        tz: result.timezone,
      };
      setCity(newCity);
      setCityState(newCity);
      setQuery("");
      setIsOpen(false);
      setResults([]);
      window.location.reload();
    },
    []
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-label/30 hover:bg-label/10 transition-colors text-sm text-text-secondary"
      >
        <span className="text-base">&#x1f4cd;</span>
        <span className="font-lora">{city?.name ?? "Melbourne"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-72 bg-cream border border-label/20 rounded-lg shadow-lg z-50">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search city..."
            autoFocus
            className="w-full px-3 py-2 bg-transparent border-b border-label/20 text-sm text-text-primary placeholder:text-label/50 focus:outline-none"
          />
          {isLoading && (
            <div className="px-3 py-2 text-sm text-label">
              Searching...
            </div>
          )}
          {results.length > 0 && (
            <ul className="max-h-48 overflow-y-auto">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => selectCity(r)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-label/10 text-text-primary transition-colors"
                  >
                    {r.displayName}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div className="px-3 py-2 text-sm text-label">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
