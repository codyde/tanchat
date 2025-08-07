import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";
import * as Sentry from "@sentry/tanstackstart-react";
import './global-middleware';
import { vercelAIIntegration } from "@sentry/node";

Sentry.init({
  dsn: "https://10405eed688aa2e2728fdd121af16908@o4508130833793024.ingest.us.sentry.io/4509648925032448",
  
  // Adds request headers and IP for users
  sendDefaultPii: true,

  integrations: [
    Sentry.vercelAIIntegration({
        recordInputs: true,
        recordOutputs: true,
      }),
  ],
  
  // Enable logs to be sent to Sentry
  _experiments: { enableLogs: true },
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  debug: true,
  profilesSampleRate: 1.0,
});

export default createStartHandler({
  createRouter,
})(defaultStreamHandler);