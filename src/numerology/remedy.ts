import type { AnalysisResult } from './analyzer';
import { reduceDigits } from './analyzer';
import { ROOT } from './data';

export type LifeProblem = 'money' | 'health' | 'relationships' | 'career' | 'peace';

export const PROBLEM_OPTIONS: { id: LifeProblem; label: string; blurb: string }[] = [
  { id: 'money', label: 'Money / Business', blurb: 'Cash flow, deals, wealth building' },
  { id: 'health', label: 'Health', blurb: 'Physical vitality & recovery' },
  { id: 'relationships', label: 'Relationships', blurb: 'Marriage, family, partnerships' },
  { id: 'career', label: 'Career Growth', blurb: 'Promotion, authority, stability' },
  { id: 'peace', label: 'Mental Peace', blurb: 'Calm, clarity, low anxiety' },
];

type RemedyCombo = {
  combo: string;
  problems: LifeProblem[];
  reason: string;
};

const REMEDY_LIBRARY: RemedyCombo[] = [
  { combo: '51', problems: ['money', 'career'], reason: 'Brings solid command over administration and management — directly counters career stagnation and cash blocks.' },
  { combo: '15', problems: ['money', 'career', 'relationships'], reason: "Raises the father's fame through your actions and opens administrative authority — lifts both wealth and family standing." },
  { combo: '50', problems: ['money'], reason: 'A sharp business mind that naturally thinks in lakhs and crores — rebuilds liquid cash through trade and calculated speculation.' },
  { combo: '05', problems: ['money'], reason: 'Accumulates liquid cash easily through business and calculated speculation — counters emotional spending and cash leakage.' },
  { combo: '31', problems: ['career', 'money'], reason: 'Pushes toward a high-paying professional career, advisory role or consultancy — breaks career stagnation and lifts income.' },
  { combo: '13', problems: ['career'], reason: 'Excellent education and high respect within your circle — builds the professional foundation promotions depend on.' },
  { combo: '37', problems: ['relationships', 'peace', 'money'], reason: 'A complete, magnetic personality that draws people in and converts knowledge into life-changing wealth.' },
  { combo: '73', problems: ['relationships', 'peace'], reason: 'Magnetic identity and the ability to extract benefits from knowledge — stabilises relationships and self-worth.' },
  { combo: '38', problems: ['relationships', 'career', 'money'], reason: 'Mediator and peacemaker energy — resolves conflicts and earns commissions by bridging warring parties.' },
  { combo: '83', problems: ['relationships', 'money'], reason: 'Mediator commissions and conflict resolution — turns broken relationships into income opportunities.' },
  { combo: '57', problems: ['relationships', 'peace', 'career'], reason: 'Natural speaker and PR expert — people seek you out for advice, building the network that career growth needs.' },
  { combo: '75', problems: ['peace', 'relationships'], reason: 'Expressive warmth that draws a crowd — eases isolation and rebuilds social confidence.' },
  { combo: '25', problems: ['health', 'money'], reason: "Natural healing ('Shafa') power in the hands — success in medicine, occult or healing work, often through travel." },
  { combo: '52', problems: ['health'], reason: 'Healing hands and occult success — counters chronic illness patterns and opens recovery through travel.' },
  { combo: '78', problems: ['peace', 'health', 'money'], reason: 'High idealistic values and raw willpower to survive any bankruptcy or crisis through sheer inner strength.' },
  { combo: '87', problems: ['peace', 'money'], reason: 'Self-made revival energy — the willpower to rebuild from ashes after any financial or emotional collapse.' },
  { combo: '23', problems: ['peace', 'health'], reason: 'The Hidden Shield — enemies and rivals exhaust themselves against you without ever landing real harm.' },
  { combo: '32', problems: ['peace'], reason: 'Invisible protection from rivals — removes the constant low-grade anxiety of being attacked or undermined.' },
  { combo: '17', problems: ['career', 'money'], reason: 'Government connection and MNC/WFH stability — money flow never fully stops, providing a secure baseline.' },
  { combo: '71', problems: ['career', 'peace'], reason: 'MNC salary and work-from-home comfort — stabilises income and removes daily workplace friction.' },
  { combo: '47', problems: ['career', 'money'], reason: 'Brilliant, honest mind with dramatic overnight success spikes — breaks stagnation with sudden breakthroughs.' },
  { combo: '56', problems: ['money', 'career'], reason: 'Strong business mind with a home near a high-energy landmark — keeps you connected to opportunity zones.' },
  { combo: '65', problems: ['money'], reason: 'Business instinct plus landmark proximity — counters cash blocks by keeping you in high-traffic zones.' },
  { combo: '58', problems: ['career', 'money'], reason: 'Calculated mathematical mind fit for banking and corporate finance — channels wealth into structured growth.' },
  { combo: '85', problems: ['career', 'money'], reason: 'Lakhs-and-crores thinking with a finance career fit — replaces emotional spending with structured wealth building.' },
  { combo: '68', problems: ['career', 'money'], reason: 'Strategic corporate management mastery — lifts authority and opens wealth channels through the opposite sex.' },
  { combo: '69', problems: ['career', 'money'], reason: 'Masterful management and corporate planning — breaks career ceilings through strategic positioning.' },
  { combo: '91', problems: ['career', 'money', 'relationships'], reason: "The 'Rasukhdar' — a highly influential local figure who owns exactly what they set out to acquire." },
  { combo: '19', problems: ['career', 'money'], reason: 'Highly professional, independent freedom lover — breaks dependency and builds self-owned assets.' },
  { combo: '96', problems: ['career', 'money'], reason: 'Corporate executive wealth through sharp management — counters stagnation with strategic authority.' },
];

export type RemedySuggestion = {
  combo: string;
  reason: string;
};

export function suggestRemedies(
  result: AnalysisResult,
  problem: LifeProblem,
): RemedySuggestion[] {
  const rootNum = result.rootInfo?.rootNum;
  const rootData = rootNum != null ? ROOT[rootNum] : undefined;

  const presentCombos = new Set(result.couples);

  const candidates = REMEDY_LIBRARY.filter((r) => r.problems.includes(problem));

  const scored = candidates.map((r) => {
    let score = 0;
    if (presentCombos.has(r.combo)) score -= 100;
    if (rootData) {
      const total = reduceDigits(Number(r.combo));
      if (rootData.lucky.includes(total)) score += 3;
      else if (rootData.bad.includes(total)) score -= 5;
    }
    score += Math.random() * 0.5;
    return { r, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const picked = scored.filter((s) => s.score > -50).slice(0, 4);

  return picked.map((s) => ({ combo: s.r.combo, reason: s.r.reason }));
}
