import { useState } from 'react';
import { LocaleProvider, useLocale } from '@/context/LocaleContext';
import Analyzer from '@/components/Analyzer';
import History from '@/components/History';
import { Sparkles, Wand2, History as HistoryIcon } from 'lucide-react';

type View = 'analyzer' | 'history';

function Shell() {
  const { locale, setLocale, t } = useLocale();
  const [view, setView] = useState<View>('analyzer');


  
  // Removed auth checks and AuthPage rendering

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-gold-500/15 bg-espresso-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-mocha-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-espresso-950" />
            </div>
            <span className="font-display text-2xl font-semibold text-cream-50 tracking-[0.15em]">IMPERIAL</span>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setView('analyzer')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                view === 'analyzer' ? 'bg-gold-500/15 text-gold-200' : 'text-cream-200/70 hover:text-cream-50'
              }`}
            >
              <Wand2 className="w-4 h-4" /> <span className="hidden sm:inline">{t('analyzeTab')}</span>
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                view === 'history' ? 'bg-gold-500/15 text-gold-200' : 'text-cream-200/70 hover:text-cream-50'
              }`}
            >
              <HistoryIcon className="w-4 h-4" /> <span className="hidden sm:inline">{t('historyTab')}</span>
            </button>
            {/* sign out removed - app no longer requires authentication */}
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as 'en' | 'hi')}
              className="rounded-lg border border-gold-500/20 bg-espresso-950/70 px-2 py-2 text-sm text-cream-100"
              title={t('language')}
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {view === 'analyzer' ? <Analyzer /> : <History />}
      </main>

      <footer className="border-t border-gold-500/10 py-5 text-center text-xs text-cream-200/40">
        IMPERIAL — a luxury numerology experience. Readings are for reflection and entertainment.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <Shell />
    </LocaleProvider>
  );
}
