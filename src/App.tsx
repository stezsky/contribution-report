import React, { useEffect, useMemo, useState } from 'react';
import ContributionReportPage from './pages/ContributionReportPage';
import ContributionDetailPage from './pages/ContributionDetailPage';
import { ChartIcon } from './components/icons';

type RouteState =
  | { type: 'report' }
  | {
      type: 'detail';
      month: string;
      developer: string;
    };

const parseHashRoute = (): RouteState => {
  const rawHash = window.location.hash || '#/';
  const normalized = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  const segments = normalized.replace(/^\/+/, '').split('/');

  if (segments[0] === 'details' && segments[1] && segments[2]) {
    return {
      type: 'detail',
      month: decodeURIComponent(segments[1]),
      developer: decodeURIComponent(segments[2])
    };
  }

  return { type: 'report' };
};

const ensureDefaultHash = () => {
  if (!window.location.hash) {
    window.location.replace('#/');
  }
};

const App: React.FC = () => {
  const [route, setRoute] = useState<RouteState>(() => parseHashRoute());

  useEffect(() => {
    ensureDefaultHash();
    const handleHashChange = () => {
      setRoute(parseHashRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const content = useMemo(() => {
    if (route.type === 'detail') {
      return (
        <ContributionDetailPage
          key={`${route.month}-${route.developer}`}
          month={route.month}
          developer={route.developer}
          onBack={() => {
            window.location.hash = '#/';
          }}
        />
      );
    }

    return <ContributionReportPage />;
  }, [route]);

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <header className="bg-primary text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <ChartIcon className="h-7 w-7 text-white" />
            </span>
            Contribution Reports
          </h1>
          <p className="text-sm text-slate-200 mt-2">
            Explore contribution metrics by squad, developer, and month.
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 mt-10 space-y-10">{content}</main>
    </div>
  );
};

export default App;
