const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre className="text-red-500">{error.message}</pre>
    </div>
  );
};
export default ErrorFallback;
