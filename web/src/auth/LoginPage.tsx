import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthContext';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';

export function LoginPage() {
  const { t } = useI18n();
  const { register, login, loginGuest } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const errMsg = (code: string): string => {
    if (code === 'nickname_taken') return t.nicknameTaken;
    if (code === 'bad_credentials') return t.badCredentials;
    if (code === 'password_short') return t.passwordShort;
    return t.authFailed;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'register') await register(nickname, password);
      else await login(nickname, password);
      navigate('/app');
    } catch (err) {
      setError(errMsg((err as Error).message));
    } finally {
      setBusy(false);
    }
  };

  const guest = async () => {
    setBusy(true);
    try {
      await loginGuest();
      navigate('/app');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute right-5 top-5">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm rounded-2xl border bg-card p-7">
        <div className="text-center">
          <div className="text-2xl font-bold tracking-tight">
            CHEM<span className="text-muted-foreground">VERSE</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t.loginTagline}</p>
        </div>

        <a
          href="/api/auth/google"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-white py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
        >
          <span className="font-bold text-[#4285f4]">G</span> {t.signInGoogle}
        </a>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          ·
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="flex flex-col gap-2.5" onSubmit={submit}>
          <Input placeholder={t.nickname} value={nickname} autoComplete="username" onChange={(e) => setNickname(e.target.value)} />
          <Input
            type="password"
            placeholder={t.password}
            value={password}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="mt-1">
            {mode === 'register' ? t.signUp : t.signIn}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'login' ? 'register' : 'login'));
            setError(null);
          }}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === 'login' ? t.noAccount : t.haveAccount} <span className="font-medium text-foreground">{mode === 'login' ? t.signUp : t.signIn}</span>
        </button>

        <Button variant="outline" onClick={guest} disabled={busy} className="mt-5 w-full">
          {t.continueGuest}
        </Button>
      </div>
    </div>
  );
}
