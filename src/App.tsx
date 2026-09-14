import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const LoginPage = lazy(async () => {
  const module = await import('./pages/LoginPage/LoginPage');
  return { default: module.LoginPage };
});

function ComingSoon({ title }: { title: string }) {
  return (
    <main className="coming-soon">
      <h1>{title}</h1>
      <p>This screen is not built yet.</p>
    </main>
  );
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<ComingSoon title="Sign up" />} />
      </Routes>
    </Suspense>
  );
}
