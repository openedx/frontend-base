import { Suspense } from 'react';
import { Outlet } from 'react-router';

export default function DefaultMain() {
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}
