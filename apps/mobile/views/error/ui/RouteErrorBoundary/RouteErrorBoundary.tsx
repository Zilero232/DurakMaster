import type { RouteErrorBoundaryProps } from './RouteErrorBoundary.types';

import { ErrorScreen } from '../ErrorScreen';

export const RouteErrorBoundary = ({ error, retry }: RouteErrorBoundaryProps) => (
  <ErrorScreen
    error={error}
    onRetry={() => {
      void retry();
    }}
  />
);
