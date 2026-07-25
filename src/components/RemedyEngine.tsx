import { useState } from 'react';
import type { AnalysisResult } from '@/numerology/analyzer';
import { PROBLEM_OPTIONS, suggestRemedies, type LifeProblem, type RemedySuggestion } from '@/numerology/remedy';
import { Sparkles, Wand2, Coins, HeartPulse, Heart, Briefcase, BrainCircuit, ArrowRight } from 'lucide-react';

const problemIcon: Record<LifeProblem, typeof Coins> = {
  money: Coins,
  health: HeartPulse,
  relationships: Heart,
  career: Briefcase,
  peace: BrainCircuit,
};

export default function RemedyEngine({ result }: { result: AnalysisResult }) {
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
        <h3 className="font-display text-2xl text-cream-50">AI Remedy Engine</h3>
      </div>
      <p className="text-sm text-cream-200/70 mb-5">
        What specific issue or goal are you facing right now? Pick one and the engine
        will calculate ideal number combinations that counteract the negative influences in your current number.
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
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {generating && (
        <div className="mt-6 flex items-center gap-3 text-cream-200/70 animate-fade-up">
          <div className="w-4 h-4 rounded-full border-2 border-gold-300/40 border-t-gold-300 animate-spin" />
          <span className="text-sm">Calculating remedy combinations against your current number…</span>
        </div>
      )}

      {!generating && remedies.length > 0 && (
        <div className="mt-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold-300" />
            <h4 className="font-display text-lg text-cream-50">Recommended Number Combinations</h4>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {remedies.map((r, i) => (
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
                <p className="mt-2 text-sm text-cream-200/80 leading-relaxed">{r.reason}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-cream-200/50 italic">
            These combinations are calculated to counter the negative influences detected in your current number.
            Use them as guidance for choosing a new number — not as a guarantee.
          </p>
        </div>
      )}
    </div>
  );
}
