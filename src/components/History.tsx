import { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { History as HistoryIcon, Trash2, ChevronRight, Sparkles } from 'lucide-react';
import type { AnalysisResult } from '@/numerology/analyzer';
import AnalyzerResult from './AnalyzerResult';
import { getStoredJson, removeStoredItem, setStoredJson } from '@/utils/storage';

// Local storage key for saved analyses
const STORAGE_KEY = 'analyses';

export type AnalysisRow = {
  id: string;
  mobile: string;
  dob: string | null;
  mobile_total: number;
  result: AnalysisResult;
  label: string | null;
  created_at: string;
};

const tierBadgeClasses: Record<string, string> = {
  best: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  neutral: 'bg-gold-400/15 text-gold-300 border-gold-400/30',
  bad: 'bg-rose-400/15 text-rose-300 border-rose-400/30',
};
const tierLabelKey: Record<string, string> = {
  best: 'favorable',
  neutral: 'neutral',
  bad: 'caution',
};

export default function History() {
  const { t } = useLocale();
  const [rows, setRows] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AnalysisRow | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const parsed = getStoredJson<AnalysisRow[]>(STORAGE_KEY) ?? [];
      parsed.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      setRows(parsed);
    } catch {
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    const next = rows.filter((x) => x.id !== id);
    setStoredJson(STORAGE_KEY, next);
    setRows(next);
  };

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-cream-50">
            {selected.label || t('readingFor', { mobile: selected.mobile })}
          </h2>
          <button onClick={() => setSelected(null)} className="lux-btn-ghost text-sm">
            <ChevronRight className="w-4 h-4 rotate-180" /> {t('back')}
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
        <h2 className="font-display text-3xl text-cream-50">{t('savedReadings')}</h2>
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
                  <p className="text-cream-50 font-medium truncate">{r.label || t('mobileReadingLabel', { mobile: r.mobile })}</p>
                  <p className="text-xs text-cream-200/50 truncate">{new Date(r.created_at).toLocaleString()}</p>
                </button>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${tierBadgeClasses[tier]} hidden sm:inline`}>
                  {t(tierLabelKey[tier])}
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
