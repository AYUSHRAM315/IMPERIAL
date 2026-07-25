import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { Sparkles, Mail, Lock, User2, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const { t } = useLocale();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-mocha-500 shadow-lux mb-4">
            <Sparkles className="w-8 h-8 text-espresso-950" />
          </div>
          <h1 className="font-display text-4xl font-semibold text-cream-50 tracking-[0.2em]">IMPERIAL</h1>
          <p className="text-cream-200/70 mt-2 text-sm tracking-wide">Luxury Mobile Numerology Analyzer</p>
        </div>

        <div className="lux-card p-7">
          <div className="flex gap-2 p-1 rounded-xl bg-espresso-950/50 mb-6">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === m ? 'bg-gradient-to-b from-gold-400 to-gold-500 text-espresso-950' : 'text-cream-200/70 hover:text-cream-50'
                }`}
              >
                {m === 'signin' ? t('signIn') : t('createAccount')}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gold-400/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailAddress')}
                className="lux-input pl-11"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gold-400/70" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('password')}
                className="lux-input pl-11"
              />
            </div>

            {error && (
              <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={busy} className="lux-btn w-full">
              {busy ? t('pleaseWait') : (
                <>
                  {mode === 'signin' ? t('signIn') : t('createAccount')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-cream-200/50 mt-5">
            {mode === 'signin' ? `${t('dontHaveAccount')} ` : `${t('alreadyMember')} `}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className="text-gold-300 hover:text-gold-200 font-medium"
            >
              {mode === 'signin' ? t('signUp') : t('signIn')}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-cream-200/40 mt-6 flex items-center justify-center gap-1.5">
          <User2 className="w-3.5 h-3.5" />
          {t('privateHistory')}
        </p>
      </div>
    </div>
  );
}
