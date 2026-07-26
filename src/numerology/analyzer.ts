import { PAIR_MAP, TRIPLE_MAP, gatewayLookup, ROOT, type Entry, type GatewayTier } from './data';

export type WeightTag = 'top' | 'high' | 'mid' | 'low';

export type WeightLabelKey =
  | 'masterGateway'
  | 'masterGatewayStrongest'
  | 'personalZoneStrong'
  | 'personalZone'
  | 'networkPrefixLow';

export type CoupleReading = {
  couple: string;
  weightLabel: WeightLabelKey;
  weightTag: WeightTag;
  data: Entry | null;
};

export type AnalysisError = {
  error: 'invalidMobile' | 'oddDigitCount';
};

export type RunAlert = {
  digit: string;
  length: number;
  data: { title: string; pros: string[]; cons: string[] };
};

export type RootInfo = {
  rootNum: number;
  planet: string;
  persona: string;
  lucky: number[];
  neutral: number[];
  bad: number[];
  tier: GatewayTier | 'neutral';
  desc: string;
};

export type GatewayReading = {
  couple: string;
  tier: GatewayTier;
  desc: string;
};

export type AnalysisResult = {
  digits: string;
  couples: string[];
  mobileTotal: number;
  weights: { label: string; tag: WeightTag }[];
  gateway: GatewayReading | null;
  coupleReadings: CoupleReading[];
  runs: RunAlert[];
  rootInfo: RootInfo | null;
};

export function reduceDigits(n: number): number {
  let x = Math.abs(n);
  while (x > 9) {
    x = String(x).split('').reduce((a, d) => a + Number(d), 0);
  }
  return x;
}

function weightFor(i: number, total: number): { label: WeightLabelKey; tag: WeightTag } {
  if (total <= 2) return { label: 'masterGateway', tag: 'top' };
  const fromEnd = total - i;
  if (fromEnd === 1) return { label: 'masterGatewayStrongest', tag: 'top' };
  if (fromEnd === 2) return { label: 'personalZoneStrong', tag: 'high' };
  if (fromEnd === 3) return { label: 'personalZone', tag: 'mid' };
  return { label: 'networkPrefixLow', tag: 'low' };
}

export function analyzeNumber(mobileRaw: string, dob: string | null): AnalysisResult | AnalysisError {
  const digits = mobileRaw.replace(/\D/g, '');
  if (digits.length < 4) return { error: 'invalidMobile' };
  if (digits.length % 2 !== 0) return { error: 'oddDigitCount' };

  const couples: string[] = [];
  for (let i = 0; i < digits.length; i += 2) {
    couples.push(digits.slice(i, i + 2));
  }
  const total = couples.length;
  const weights = couples.map((_, idx) => weightFor(idx, total));

  // runs
  const runs: RunAlert[] = [];
  let i = 0;
  while (i < digits.length) {
    let j = i;
    while (j < digits.length && digits[j] === digits[i]) j++;
    const len = j - i;
    if (len >= 3) {
      const d = TRIPLE_MAP[digits[i]];
      if (d) runs.push({ digit: digits[i], length: len, data: d });
    }
    i = j;
  }

  const digitSum = digits.split('').reduce((a, d) => a + Number(d), 0);
  const mobileTotal = reduceDigits(digitSum);

  // gateway
  const lastCouple = couples[couples.length - 1];
  const lastNum = Number(lastCouple);
  const gw = gatewayLookup(lastNum);
  const gateway: GatewayReading | null = gw ? { couple: lastCouple, tier: gw.tier, desc: gw.desc } : null;

  // couple readings (in original order; UI will reverse)
  const coupleReadings: CoupleReading[] = couples.map((c, idx) => {
    const w = weights[idx];
    const rev = c.length === 2 ? c[1] + c[0] : c;
    const data = PAIR_MAP[c] || PAIR_MAP[rev] || null;
    return { couple: c, weightLabel: w.label, weightTag: w.tag, data };
  });

  // root
  let rootInfo: RootInfo | null = null;
  if (dob) {
    const d = new Date(dob + 'T00:00:00');
    const day = d.getDate();
    const rootNum = reduceDigits(day);
    const rd = ROOT[rootNum] || ROOT[reduceDigits(rootNum)];
    if (rd) {
      let tier: GatewayTier | 'neutral' = 'neutral';
      let desc = 'A steady, unremarkable match — no strong amplification in either direction.';
      if (rd.lucky.includes(mobileTotal)) { tier = 'best'; desc = 'This mobile total resonates well with the Root Number, amplifying growth and financial ease.'; }
      else if (rd.bad.includes(mobileTotal)) { tier = 'bad'; desc = rd.badDesc; }
      rootInfo = { rootNum, planet: rd.planet, persona: rd.persona, lucky: rd.lucky, neutral: rd.neutral, bad: rd.bad, tier, desc };
    }
  }

  return { digits, couples, mobileTotal, weights, gateway, coupleReadings, runs, rootInfo };
}
