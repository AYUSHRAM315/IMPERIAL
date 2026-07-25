import { useState } from 'react';
import { analyzeNumber, type AnalysisResult } from '@/numerology/analyzer';
import AnalyzerResult from './AnalyzerResult';
import { useLocale } from '@/context/LocaleContext';
import { Phone, CalendarDays, Wand2, RotateCcw } from 'lucide-react';

export default function Analyzer() {
  const { t } = useLocale();
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = analyzeNumber(mobile, dob || null);
    if ('error' in res) { setError(res.error); setResult(null); return; }
    setResult(res);
  };

  const reset = () => { setResult(null); setError(null); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {!result && (
        <div className="text-center mb-8 animate-fade-up">
          <h2 className="font-display text-4xl sm:text-5xl text-cream-50">{t('analyzeHeading')}</h2>
          <p className="mt-3 text-cream-200/70 max-w-xl mx-auto">
            {t('analyzeDescription')}
          </p>
        </div>
      )}

      {!result ? (
        <form onSubmit={run} className="lux-card p-6 sm:p-8 animate-fade-up space-y-5">
          <div>
            <label className="block text-sm text-cream-200/70 mb-2">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gold-400/70" />
              <input
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="e.g. 9876543210"
                className="lux-input pl-11 font-display text-lg tracking-wider"
              />
            </div>
            <p className="mt-1.5 text-xs text-cream-200/40">Digits only. Must contain an even number of digits.</p>
          </div>

          <div>
            <label className="block text-sm text-cream-200/70 mb-2">Date of Birth <span className="text-cream-200/40">(optional, for root-number match)</span></label>
            <div className="relative">
              <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gold-400/70" />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="lux-input pl-11"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button type="submit" className="lux-btn w-full text-base">
            <Wand2 className="w-5 h-5" /> {t('revealReading')}
          </button>
        </form>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl text-cream-50">{t('yourReading')}</h2>
            <button onClick={reset} className="lux-btn-ghost text-sm">
              <RotateCcw className="w-4 h-4" /> {t('newAnalysis')}
            </button>
          </div>
          <AnalyzerResult result={result} mobile={mobile} dob={dob || null} />
        </div>
      )}
    </div>
  );
}
