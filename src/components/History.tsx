import { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { supabase, type AnalysisRow } from '@/lib/supabase';
import { History as HistoryIcon, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import type { AnalysisResult } from '@/numerology/analyzer';
import AnalyzerResult from './AnalyzerResult';

const tierBadge: Record<string, { label: string; cls: string }> = {
  best: { label: 'Favorable', cls: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' },
  neutral: { label: 'Neutral', cls: 'bg-gold-400/15 text-gold-300 border-gold-400/30' },
  bad: { label: 'Caution', cls: 'bg-rose-400/15 text-rose-300 border-rose-400/30' },
};

export default function History() {
  const { t } = useLocale();
  const [rows, setRows] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AnalysisRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setRows(data as unknown as AnalysisRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await supabase.from('analyses').delete().eq('id', id);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-cream-50">
            {selected.label || `Reading for ${selected.mobile}`}
          </h2>
          <button onClick={() => setSelected(null)} className="lux-btn-ghost text-sm">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back
          </button>
        </div>
        <AnalyzerResult result={selected.result as unknown as AnalysisResult} mobile={selected.mobile} dob={selected.dob} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <HistoryIcon className="w-5 h-5 text-gold-300" />
        <h2 className="font-display text-3xl text-cream-50">Saved Readings</h2>
      </div>

      {loading ? (
        <p className="text-cream-200/60">{t('loading')}</p>
      ) : rows.length === 0 ? (
        <div className="lux-card p-10 text-center">
          <Sparkles className="w-8 h-8 text-gold-400/60 mx-auto mb-3" />
          <p className="text-cream-200/70">{t('noSavedReadings')}</p>
          <p className="text-cream-200/40 text-sm mt-1">{t('runAnalysisSave')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => {
            const tier = r.result.gateway?.tier || 'neutral';
            return (
              <div key={r.id} className="lux-card p-4 flex items-center gap-4 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-mocha-500 flex items-center justify-center font-display text-xl font-semibold text-espresso-950 shrink-0">
                  {r.mobile_total}
                </div>
                <button onClick={() => setSelected(r)} className="flex-1 text-left min-w-0">
                  <p className="text-cream-50 font-medium truncate">{r.label || `Mobile ${r.mobile}`}</p>
                  <p className="text-xs text-cream-200/50 truncate">{new Date(r.created_at).toLocaleString()}</p>
                </button>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${tierBadge[tier].cls} hidden sm:inline`}>
                  {tierBadge[tier].label}
                </span>
                <button onClick={() => remove(r.id)} className="p-2 rounded-lg text-cream-200/50 hover:text-rose-300 hover:bg-rose-500/10 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
