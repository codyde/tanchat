import * as Sentry from "@sentry/tanstackstart-react";

export function SentryTestButton() {
  const handleTestError = () => {
    throw new Error("Sentry Test Error - Frontend");
  };

  const handleTestTrace = async () => {
    await Sentry.startSpan(
      {
        name: "Test Sentry Span",
        op: "test",
      },
      async () => {
        // Simulate some async work
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Test span completed successfully");
      }
    );
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleTestError}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Test Sentry Error
      </button>
      <button
        type="button"
        onClick={handleTestTrace}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Sentry Trace
      </button>
    </div>
  );
} 