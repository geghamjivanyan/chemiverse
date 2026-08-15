import { Link } from 'react-router-dom';
import { Compass, GraduationCap, FlaskConical, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { useAuth } from '../auth/AuthContext';
import { useBench } from './BenchContext';

export function HubPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { discovered } = useBench();

  const doors = [
    { to: '/app/table', icon: Compass, title: t.doorExplore, desc: t.doorExploreDesc },
    { to: '/app/learn', icon: GraduationCap, title: t.doorLearn, desc: t.doorLearnDesc },
    { to: '/app/lab', icon: FlaskConical, title: t.doorLab, desc: t.doorLabDesc },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {t.hubHi}
        {user?.name ? `, ${user.name}` : ''} 👋
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doors.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="group relative rounded-xl border bg-card p-6 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon className="size-7 text-muted-foreground transition-colors group-hover:text-foreground" />
            <h2 className="mt-5 text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            <ArrowRight className="absolute right-5 top-6 size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        <span className="font-mono text-base text-foreground">{discovered.size}</span> {t.moleculesOpened}
      </p>
    </div>
  );
}
