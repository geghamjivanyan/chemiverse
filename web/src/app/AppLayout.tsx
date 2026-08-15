import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Atom, BookOpen, FlaskConical, Search, GraduationCap, NotebookPen, User, Hand, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { useAuth } from '../auth/AuthContext';
import { BenchProvider } from './BenchContext';
import { HandLayer } from '../input/HandLayer';

export function AppLayout() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [handsOn, setHandsOn] = useState(false);

  const nav = [
    { to: '/app', end: true, icon: Home, label: t.navHub },
    { to: '/app/table', icon: Atom, label: t.navTable },
    { to: '/app/books', icon: BookOpen, label: t.navBooks },
    { to: '/app/lab', icon: FlaskConical, label: t.navLab },
    { to: '/app/search', icon: Search, label: t.navSearch },
    { to: '/app/learn', icon: GraduationCap, label: t.navLearn },
    { to: '/app/notebook', icon: NotebookPen, label: t.navNotebook },
    { to: '/app/profile', icon: User, label: t.navProfile },
  ];
  const isActive = (to: string, end?: boolean) => (end ? pathname === to : pathname.startsWith(to));

  return (
    <BenchProvider>
      <div className="flex h-screen min-w-0 flex-col overflow-hidden">
        {/* горизонтальное верхнее меню */}
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <Link to="/app" className="flex shrink-0 items-center gap-2">
            <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">C</div>
            <span className="hidden font-semibold tracking-tight sm:inline">CHEMVERSE</span>
          </Link>

          <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1">
            {nav.map(({ to, end, icon: Icon, label }) => (
              <Link key={to} to={to} title={label}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition ${isActive(to, end) ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'}`}>
                <Icon className="size-4 shrink-0" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>

          <Button variant={handsOn ? 'default' : 'ghost'} size="sm" className="h-7 shrink-0 px-2" onClick={() => setHandsOn((v) => !v)}>
            <Hand className="size-4" />
            <span className="hidden sm:inline">{t.hands}</span>
          </Button>
          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-accent">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="size-7 rounded-lg object-cover" />
                ) : (
                  <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-sm font-semibold">
                    {(user?.isGuest ? t.guest : user?.name ?? '?').charAt(0)}
                  </span>
                )}
                <span className="hidden max-w-28 truncate text-sm font-medium md:inline">{user?.isGuest ? t.guest : user?.name}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-48">
              <DropdownMenuItem asChild>
                <Link to="/app/profile"><User /> {t.navProfile}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}><LogOut /> {t.logout}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {handsOn && <HandLayer onDisable={() => setHandsOn(false)} clickEnabled />}
    </BenchProvider>
  );
}
