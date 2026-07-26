import { useState } from 'react';
import { reduceDigits } from '@/numerology/analyzer';
import type { AnalysisResult } from '@/numerology/analyzer';
import { useLocale } from '@/context/LocaleContext';
import { PROBLEM_OPTIONS, suggestRemedies, type LifeProblem, type RemedySuggestion } from '@/numerology/remedy';
import { Sparkles, Wand2, Coins, HeartPulse, Heart, Briefcase, BrainCircuit, ArrowRight } from 'lucide-react';

const problemIcon: Record<LifeProblem, typeof Coins> = {
  money: Coins,
  health: HeartPulse,
  relationships: Heart,
  career: Briefcase,
  peace: BrainCircuit,
};

const problemLabelKey: Record<LifeProblem, string> = {
  money: 'problemMoney',
  health: 'problemHealth',
  relationships: 'problemRelationships',
  career: 'problemCareer',
  peace: 'problemPeace',
};

export default function RemedyEngine({ result }: { result: AnalysisResult }) {
  const { t } = useLocale();
  const [problem, setProblem] = useState<LifeProblem | null>(null);
  const [remedies, setRemedies] = useState<RemedySuggestion[]>([]);
  const [generating, setGenerating] = useState(false);

  const generate = (p: LifeProblem) => {
    setProblem(p);
    setGenerating(true);
    setTimeout(() => {
      setRemedies(suggestRemedies(result, p));
      setGenerating(false);
    }, 450);
  };

  return (
    <div className="lux-card p-6 animate-fade-up border-gold-400/30">
      <div className="flex items-center gap-2 mb-1">
        <Wand2 className="w-5 h-5 text-gold-300" />
        <h3 className="font-display text-2xl text-cream-50">{t('aiRemedy')}</h3>
      </div>
      <p className="text-sm text-cream-200/70 mb-5">
        {t('remedyDescription')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PROBLEM_OPTIONS.map((opt) => {
          const Icon = problemIcon[opt.id];
          const active = problem === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => generate(opt.id)}
              className={`group relative flex flex-col items-center gap-1.5 p-3.5 rounded-xl border transition-all duration-300 ${
                active
                  ? 'border-gold-400 bg-gold-400/15 shadow-[0_0_20px_-4px_rgba(202,161,93,0.5)]'
                  : 'border-gold-500/20 bg-espresso-950/40 hover:border-gold-400/50 hover:bg-espresso-900/60'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${active ? 'text-gold-300' : 'text-cream-200/60 group-hover:text-gold-300/80'}`} />
              <span className={`text-xs font-medium text-center leading-tight ${active ? 'text-cream-50' : 'text-cream-200/80'}`}>
                {t(problemLabelKey[opt.id])}
              </span>
            </button>
          );
        })}
      </div>

      {generating && (
        <div className="mt-6 flex items-center gap-3 text-cream-200/70 animate-fade-up">
          <div className="w-4 h-4 rounded-full border-2 border-gold-300/40 border-t-gold-300 animate-spin" />
          <span className="text-sm">{t('calculating')}</span>
        </div>
      )}

      {!generating && remedies.length > 0 && (
        <div className="mt-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold-300" />
            <h4 className="font-display text-lg text-cream-50">{t('recommendedCombos')}</h4>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {remedies.map((r, i) => {
              const comboTotal = reduceDigits(Number(r.combo));
              const compatibility = result.rootInfo
                ? result.rootInfo.lucky.includes(comboTotal)
                  ? 'favorable'
                  : result.rootInfo.bad.includes(comboTotal)
                  ? 'caution'
                  : 'neutral'
                : null;
              const compatibilityLabel = compatibility ? t(compatibility) : t('comboCompatibilityUnknown');
              const compatibilityClass = compatibility === 'favorable'
                ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30'
                : compatibility === 'caution'
                  ? 'bg-rose-400/15 text-rose-300 border-rose-400/30'
                  : 'bg-gold-400/15 text-gold-300 border-gold-400/30';

              return (
                <div
                  key={i}
                  className="group relative p-4 rounded-xl bg-gradient-to-br from-espresso-900/80 to-espresso-950/80 border border-gold-500/25 hover:border-gold-400/50 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl font-semibold text-gold-300 tracking-wider">
                      {r.combo}
                    </span>
                    <ArrowRight className="w-4 h-4 text-cream-200/40 group-hover:text-gold-300 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-cream-200/50">
                    {t('remedyComboSummary')}
                  </p>
                  <div className="mt-2 grid gap-2 text-sm text-cream-200/80">
                    <div className="flex items-center justify-between rounded-xl bg-espresso-950/50 px-3 py-2">
                      <span>{t('comboTotalLabel')}</span>
                      <span className="font-medium text-cream-100">{comboTotal}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-espresso-950/50 px-3 py-2">
                      <span>{t('comboCompatibilityLabel')}</span>
                      <span className={`text-[11px] uppercase tracking-[0.18em] rounded-full px-2 py-1 ${compatibilityClass}`}>
                        {compatibilityLabel}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-espresso-950/40 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-cream-200/50">{t('comboBenefitLabel')}</p>
                    <p className="mt-2 text-sm text-cream-200/80 leading-relaxed">{r.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-cream-200/50 italic">
            {t('guidanceNote')}
          </p>
        </div>
      )}
    </div>
  );
}
