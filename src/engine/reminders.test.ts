import { getTithiForDate, findTithiAnniversaries } from "./reminders";

const hyderabad = { lat: 17.385, lng: 78.4867, tz: "Asia/Kolkata" };

describe("getTithiForDate", () => {
  it("returns a valid TithiIdentity for a known date", () => {
    const result = getTithiForDate("2026-03-20", hyderabad.lat, hyderabad.lng, hyderabad.tz);
    expect(result.masaNumber).toBe(1); // Chaitra
    expect(result.paksha).toBe("shukla");
    expect(result.tithiNumber).toBe(2); // Dwitiya within paksha
    expect(result.masa.en).toBe("Chaitra");
    expect(result.tithi.en).toBe("Dwitiya");
    expect(result.description).toContain("Chaitra");
  });

  it("identifies Krishna paksha correctly", () => {
    const result = getTithiForDate("2026-02-15", hyderabad.lat, hyderabad.lng, hyderabad.tz);
    expect(result.paksha).toBe("krishna");
    expect(result.masa.en).toBe("Magha");
    expect(result.tithiNumber).toBeGreaterThanOrEqual(1);
    expect(result.tithiNumber).toBeLessThanOrEqual(15);
  });

  it("returns Telugu names", () => {
    const result = getTithiForDate("2026-03-27", hyderabad.lat, hyderabad.lng, hyderabad.tz);
    expect(result.tithi.te).toBeTruthy();
    expect(result.masa.te).toBeTruthy();
    expect(result.samvatsaram.te).toBeTruthy();
  });
});

describe("findTithiAnniversaries", () => {
  it("finds the same Tithi across years for a Chaitra date", () => {
    // Use a Chaitra/Vaisakha date (Apr-May) — easy to find
    const ti = getTithiForDate("2023-04-10", hyderabad.lat, hyderabad.lng, hyderabad.tz);
    const results = findTithiAnniversaries(
      ti, 2025, 2027,
      hyderabad.lat, hyderabad.lng, hyderabad.tz,
      "2026-03-25"
    );
    expect(results.length).toBeGreaterThanOrEqual(1);
    results.forEach((r) => {
      expect(r).toHaveProperty("date");
      expect(r).toHaveProperty("sunriseTime");
      expect(r).toHaveProperty("daysFromNow");
      expect(r).toHaveProperty("gregorianFormatted");
      expect(r).toHaveProperty("teluguFormatted");
    });
  });

  it("returns results sorted by year ascending", () => {
    const ti = getTithiForDate("2023-06-15", hyderabad.lat, hyderabad.lng, hyderabad.tz);
    const results = findTithiAnniversaries(
      ti, 2025, 2027,
      hyderabad.lat, hyderabad.lng, hyderabad.tz,
      "2026-03-25"
    );
    expect(results.length).toBeGreaterThanOrEqual(1);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].year).toBeGreaterThan(results[i - 1].year);
    }
  });

  it("sets isCurrentYear correctly", () => {
    const ti = getTithiForDate("2020-06-01", hyderabad.lat, hyderabad.lng, hyderabad.tz);
    const results = findTithiAnniversaries(
      ti, 2025, 2027,
      hyderabad.lat, hyderabad.lng, hyderabad.tz,
      "2026-03-25"
    );
    const currentYearResult = results.find((r) => r.year === new Date().getFullYear());
    if (currentYearResult) {
      expect(currentYearResult.isCurrentYear).toBe(true);
    }
    const otherResults = results.filter((r) => r.year !== new Date().getFullYear());
    otherResults.forEach((r) => expect(r.isCurrentYear).toBe(false));
  });

  it("uses calendar-year semantics for Magha/Phalguna (masas 11/12)", () => {
    // 2026-02-15 falls in Magha (masa 11). When the user asks for
    // anniversaries starting at 2026, the engine should look at
    // Jan/Feb 2026 — NOT Jan/Feb 2027 (which is the Parabhava
    // samvatsaram's Magha). Each year's result must land in that
    // calendar year, not the next one.
    const ti = getTithiForDate("2026-02-15", hyderabad.lat, hyderabad.lng, hyderabad.tz);
    expect(ti.masaNumber).toBe(11);

    const results = findTithiAnniversaries(
      ti, 2026, 2028,
      hyderabad.lat, hyderabad.lng, hyderabad.tz,
      "2026-04-07"
    );

    // Each year must have a matching entry whose Gregorian date falls
    // inside that calendar year (Jan/Feb), not the next.
    expect(results.length).toBeGreaterThanOrEqual(2);
    results.forEach((r) => {
      const [yyyy] = r.date.split("-").map(Number);
      expect(yyyy).toBe(r.year);
    });
  });
});
