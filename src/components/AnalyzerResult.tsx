import { useState } from 'react';
import type { AnalysisResult, CoupleReading } from '@/numerology/analyzer';
import { Sparkles, Star, Shield, AlertTriangle, Flame, Crown, Save, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RemedyEngine from '@/components/RemedyEngine';

const tierClass: Record<string, string> = {
  best: 'tier-best',
  neutral: 'tier-neutral',
  bad: 'tier-bad',
};

const tierBadge: Record<string, { label: string; cls: string }> = {
  best: { label: 'Favorable', cls: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' },
  neutral: { label: 'Neutral', cls: 'bg-gold-400/15 text-gold-300 border-gold-400/30' },
  bad: { label: 'Caution', cls: 'bg-rose-400/15 text-rose-300 border-rose-400/30' },
};

const weightTagClass: Record<string, string> = {
  top: 'bg-gold-400/20 text-gold-200 border-gold-400/40',
  high: 'bg-mocha-500/20 text-caramel-200 border-mocha-500/40',
  mid: 'bg-espresso-700/40 text-cream-200 border-gold-500/20',
  low: 'bg-espresso-950/50 text-cream-200/50 border-gold-500/10',
};

function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <div className="mt-3 grid sm:grid-cols-2 gap-3">
      {pros.length > 0 && (
        <ul className="space-y-1.5">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-cream-100/90">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-300/80" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {cons.length > 0 && (
        <ul className="space-y-1.5">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-cream-200/80">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rose-300/80" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CoupleCard({ cr, index }: { cr: CoupleReading; index: number }) {
  const tier = cr.data ? (cr.weightTag === 'top' ? 'best' : cr.weightTag === 'high' ? 'neutral' : 'neutral') : 'neutral';
  return (
    <div className={`lux-card p-4 ${tierClass[tier]} animate-fade-up`} style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-semibold text-gold-300">{cr.couple}</span>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${weightTagClass[cr.weightTag]}`}>
            {cr.weightLabel}
          </span>
        </div>
      </div>
      {cr.data ? (
        <>
          <h4 className="mt-2 font-display text-lg text-cream-50">{cr.data.title}</h4>
          <ProsCons pros={cr.data.pros} cons={cr.data.cons} />
        </>
      ) : (
        <p className="mt-2 text-sm text-cream-200/50 italic">No specific pair reading recorded for this combination.</p>
      )}
    </div>
  );
}

export default function AnalyzerResult({ result, mobile, dob }: { result: AnalysisResult; mobile: string; dob: string | null }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [label, setLabel] = useState('');
  const [showSave, setShowSave] = useState(false);

  const reversedCouples = [...result.coupleReadings].reverse();

  const save = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { error } = await supabase.from('analyses').insert({
      mobile,
      dob: dob || null,
      mobile_total: result.mobileTotal,
      result: result as unknown as Record<string, unknown>,
      label: label.trim() || null,
    });
    setSaving(false);
    if (!error) { setSaved(true); setShowSave(false); }
  };

  return (
    <div className="space-y-6">
      {/* Summary hero */}
      <div className="lux-card p-6 animate-fade-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400/70">Mobile Total</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-display text-5xl font-semibold text-cream-50">{result.mobileTotal}</span>
              {result.gateway && (
                <span className={`text-xs px-3 py-1 rounded-full border ${tierBadge[result.gateway.tier].cls}`}>
                  {tierBadge[result.gateway.tier].label} Gateway
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-cream-200/70 break-all">{result.digits}</p>
          </div>
          <div className="flex gap-2">
            {saved ? (
              <span className="lux-btn-ghost text-emerald-300 border-emerald-400/30"><Check className="w-4 h-4" /> Saved</span>
            ) : (
              <button onClick={() => setShowSave((s) => !s)} className="lux-btn-ghost">
                <Save className="w-4 h-4" /> Save Reading
              </button>
            )}
          </div>
        </div>

        {showSave && !saved && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2 animate-fade-up">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (e.g. Work number)"
              className="lux-input flex-1"
            />
            <button onClick={save} disabled={saving} className="lux-btn">
              {saving ? 'Saving…' : 'Confirm Save'}
            </button>
          </div>
        )}

        {result.gateway && (
          <div className={`mt-4 p-4 rounded-xl bg-espresso-950/40 ${tierClass[result.gateway.tier]}`}>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-gold-300" />
              <span className="text-sm font-medium text-cream-50">Master Gateway — couple {result.gateway.couple}</span>
            </div>
            <p className="text-sm text-cream-200/80">{result.gateway.desc}</p>
          </div>
        )}
      </div>

      {/* Root info */}
      {result.rootInfo && (
        <div className={`lux-card p-6 animate-fade-up ${tierClass[result.rootInfo.tier]}`}>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-gold-300" />
            <h3 className="font-display text-2xl text-cream-50">Root Number Match</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-cream-200/60">Root Number</p>
              <p className="font-display text-3xl text-gold-300">{result.rootInfo.rootNum}</p>
            </div>
            <div>
              <p className="text-cream-200/60">Ruling Planet</p>
              <p className="text-cream-50 font-medium">{result.rootInfo.planet}</p>
              <p className="text-cream-200/60 text-xs">The {result.rootInfo.persona}</p>
            </div>
            <div>
              <p className="text-cream-200/60">Mobile Total</p>
              <p className="font-display text-3xl text-cream-50">{result.mobileTotal}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${tierBadge[result.rootInfo.tier]?.cls || tierBadge.neutral.cls}`}>
                {tierBadge[result.rootInfo.tier]?.label || 'Neutral'}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-cream-100/90">{result.rootInfo.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">Lucky: {result.rootInfo.lucky.join(', ')}</span>
            <span className="px-2 py-1 rounded-full bg-gold-400/10 text-gold-300 border border-gold-400/20">Neutral: {result.rootInfo.neutral.join(', ')}</span>
            <span className="px-2 py-1 rounded-full bg-rose-400/10 text-rose-300 border border-rose-400/20">Caution: {result.rootInfo.bad.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Runs */}
      {result.runs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-300" />
            <h3 className="font-display text-2xl text-cream-50">Repeated Digit Alerts</h3>
          </div>
          {result.runs.map((r, i) => (
            <div key={i} className="lux-card p-5 tier-bad animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl text-rose-300">{r.digit.repeat(r.length)}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-400/15 text-rose-300 border border-rose-400/30">
                  {r.length}× repeat
                </span>
              </div>
              <h4 className="mt-2 font-display text-lg text-cream-50">{r.data.title}</h4>
              <ProsCons pros={r.data.pros} cons={r.data.cons} />
            </div>
          ))}
        </div>
      )}

      {/* Couples */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold-300" />
          <h3 className="font-display text-2xl text-cream-50">Pair Readings</h3>
          <span className="text-xs text-cream-200/50">(master gateway first)</span>
        </div>
        {reversedCouples.map((cr, i) => (
          <CoupleCard key={i} cr={cr} index={i} />
        ))}
      </div>

      {/* AI Remedy Engine */}
      <RemedyEngine result={result} />
    </div>
  );
}
