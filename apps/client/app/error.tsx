'use client';

import { ErrorPage } from '@/views/error';
import { AppProviders } from './providers';

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const RouteError = ({ error, reset }: RouteErrorProps) => (
  <AppProviders>
    <ErrorPage error={error} reset={reset} />
  </AppProviders>
);

export default RouteError;
