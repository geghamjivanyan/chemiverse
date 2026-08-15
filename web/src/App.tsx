import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppLayout } from './app/AppLayout';
import { HubPage } from './app/HubPage';
import { TablePage } from './app/TablePage';
import { LabPage } from './app/LabPage';
import { SearchPage } from './app/SearchPage';
import { SubstancePage } from './app/SubstancePage';
import { NotebookPage } from './app/NotebookPage';
import { BooksPage } from './app/BooksPage';
import { BookPage } from './app/BookPage';
import { LearnPage, ProfilePage } from './app/StubPages';
import { ElementPage } from './element/ElementPage';
import { LoginPage } from './auth/LoginPage';
import { LandingPage } from './landing/LandingPage';
import { useAuth } from './auth/AuthContext';

function ElementRedirect() {
  const { symbol } = useParams<{ symbol: string }>();
  return <Navigate to={`/app/element/${symbol}`} replace />;
}

export function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-2xl font-bold tracking-tight">
          CHEM<span className="text-muted-foreground">VERSE</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/app" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/app" replace /> : <LoginPage />} />
      <Route path="/element/:symbol" element={user ? <ElementRedirect /> : <ElementPage />} />
      <Route path="/app" element={user ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<HubPage />} />
        <Route path="table" element={<TablePage />} />
        <Route path="element/:symbol" element={<ElementPage embedded />} />
        <Route path="substance/:qid" element={<SubstancePage />} />
        <Route path="lab" element={<LabPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="notebook" element={<NotebookPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
