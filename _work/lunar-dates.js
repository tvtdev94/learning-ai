// Prints Vietnamese lunar holiday dates (Tết and Trung thu) for the homepage season table.
// Vietnamese lunar calendar rules, computed on Hanoi time (UTC+7):
//   1. A month starts on the local day that contains the new moon.
//   2. Month 11 is the month that contains the December solstice.
//   3. When 13 months lie between two month-11 starts, the first month after month 11
//      with no principal solar term (sun longitude crossing a multiple of 30°) is a leap month.
// New moons follow Meeus, Astronomical Algorithms, ch. 49; sun longitude follows ch. 25.
// Run: node _work/lunar-dates.js [fromYear] [toYear]
'use strict';
const TZ = 7 / 24, DT = 70 / 86400; // UTC+7, and ΔT (TT − UT) of about 70 s for the 2020s–2040s
const rad = d => d * Math.PI / 180, sin = d => Math.sin(rad(d));

function newMoonJDE(k) {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = 2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3;
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4;
  const Om = 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3;
  jde += -0.4072 * sin(Mp) + 0.17241 * E * sin(M) + 0.01608 * sin(2 * Mp) + 0.01039 * sin(2 * F)
    + 0.00739 * E * sin(Mp - M) - 0.00514 * E * sin(Mp + M) + 0.00208 * E * E * sin(2 * M)
    - 0.00111 * sin(Mp - 2 * F) - 0.00057 * sin(Mp + 2 * F) + 0.00056 * E * sin(2 * Mp + M)
    - 0.00042 * sin(3 * Mp) + 0.00042 * E * sin(M + 2 * F) + 0.00038 * E * sin(M - 2 * F)
    - 0.00024 * E * sin(2 * Mp - M) - 0.00017 * sin(Om) - 0.00007 * sin(Mp + 2 * M)
    + 0.00004 * sin(2 * Mp - 2 * F) + 0.00004 * sin(3 * M) + 0.00003 * sin(Mp + M - 2 * F)
    + 0.00003 * sin(2 * Mp + 2 * F) - 0.00003 * sin(Mp + M + 2 * F) + 0.00003 * sin(Mp - M + 2 * F)
    - 0.00002 * sin(Mp - M - 2 * F) - 0.00002 * sin(3 * Mp + M) + 0.00002 * sin(4 * Mp);
  const A = [[299.77, 0.107408, 0.000325], [251.88, 0.016321, 0.000165], [251.83, 26.651886, 0.000164],
    [349.42, 36.412478, 0.000126], [84.66, 18.206239, 0.00011], [141.74, 53.303771, 0.000062],
    [207.14, 2.453732, 0.00006], [154.84, 7.30686, 0.000056], [34.52, 27.261239, 0.000047],
    [207.19, 0.121824, 0.000042], [291.34, 1.844379, 0.00004], [161.72, 24.198154, 0.000037],
    [239.56, 25.513099, 0.000035], [331.55, 3.592518, 0.000023]];
  A.forEach(([a, b, c], i) => { jde += c * sin(a + b * k - (i === 0 ? 0.009173 * T2 : 0)); });
  return jde;
}
// Apparent geocentric sun longitude in degrees at a Julian day (UT).
function sunLongitude(jd) {
  const T = (jd + DT - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) + (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
  const Om = 125.04 - 1934.136 * T;
  return (((L0 + C - 0.00569 - 0.00478 * sin(Om)) % 360) + 360) % 360;
}
// Local (UTC+7) day number of a JD: the JD of local midnight that starts that day.
const localDay = jd => Math.floor(jd + TZ + 0.5);
const dayToDate = day => new Date((day - 2440588) * 86400000).toISOString().slice(0, 10);
const jdOf = (y, m, d) => Date.UTC(y, m - 1, d) / 86400000 + 2440587.5;

// Local day numbers of month starts around a date.
function monthStartsAround(jd, before, after) {
  const k0 = Math.floor((jd - 2451550.09766) / 29.530588861);
  const out = [];
  for (let k = k0 - before; k <= k0 + after; k++) out.push(localDay(newMoonJDE(k) - DT));
  return out;
}
// Local day of the December solstice of year y (sun longitude 270°).
function solsticeDay(y) {
  let jd = jdOf(y, 12, 21);
  for (let i = 0; i < 50; i++) { let d = 270 - sunLongitude(jd); d = ((d + 180) % 360) - 180; jd += d / 360 * 365.2422; if (Math.abs(d) < 1e-7) break; }
  return localDay(jd);
}
// Principal term inside [start, next): the sun crosses a multiple of 30° between the two local midnights.
const midnightJD = day => day - 0.5 - TZ;
const hasPrincipalTerm = (s, e) => Math.floor(sunLongitude(midnightJD(s)) / 30) !== Math.floor(sunLongitude(midnightJD(e)) / 30);

// Months of the lunar year that ends at month 11 of Gregorian year y: [{start, month, leap}].
function lunarMonths(y) {
  const starts = monthStartsAround(jdOf(y - 1, 12, 1), 2, 16);
  const m11 = sol => { const s = solsticeDay(sol); for (let i = 0; i < starts.length - 1; i++) if (starts[i] <= s && s < starts[i + 1]) return i; throw new Error('no month 11'); };
  const a = m11(y - 1), b = m11(y), n = b - a;
  let leap = -1;
  if (n === 13) for (let i = a + 1; i < b; i++) if (!hasPrincipalTerm(starts[i], starts[i + 1])) { leap = i; break; }
  const months = []; let label = 11;
  for (let i = a; i < b; i++) {
    if (i === leap) { months.push({ start: starts[i], month: months[months.length - 1].month, leap: true }); continue; }
    months.push({ start: starts[i], month: label, leap: false }); label = label % 12 + 1;
  }
  return months;
}
const find = (ms, month) => ms.find(m => m.month === month && !m.leap);

const from = +(process.argv[2] || 2026), to = +(process.argv[3] || 2040), rows = [];
for (let y = from; y <= to; y++) {
  const ms = lunarMonths(y);
  rows.push({ year: y, tet: dayToDate(find(ms, 1).start), trungThu: dayToDate(find(ms, 8).start + 14) });
}
console.log(JSON.stringify(rows));
