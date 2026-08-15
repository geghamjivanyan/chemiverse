import { GraduationCap, LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useI18n } from '../i18n';
import { useAuth } from '../auth/AuthContext';

function Stub({ icon, title }: { icon: ReactNode; title: string }) {
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
      <div className="opacity-40">{icon}</div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm">{t.comingSoon}</p>
    </div>
  );
}

export function LearnPage() {
  const { t } = useI18n();
  return <Stub icon={<GraduationCap className="size-10" />} title={t.navLearn} />;
}

export function ProfilePage() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  return (
    <div className="mx-auto w-full max-w-md px-6 py-10">
      <h2 className="text-2xl font-semibold tracking-tight">{t.navProfile}</h2>
      {user && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border bg-card p-7 text-center">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-2xl font-semibold">
              {(user.name ?? '?').charAt(0)}
            </span>
          )}
          <div className="text-lg font-medium">{user.name}</div>
          {user.email && <div className="text-sm text-muted-foreground">{user.email}</div>}
          <Button variant="outline" onClick={logout} className="mt-2">
            <LogOut className="size-4" /> {t.logout}
          </Button>
        </div>
      )}
    </div>
  );
}
