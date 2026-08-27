export type RouteErrorBoundaryProps = {
  error: Error;
  retry: () => Promise<void>;
};
