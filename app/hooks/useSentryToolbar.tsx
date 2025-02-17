import { useEffect } from 'react';

interface SentryToolbarConfig {
  organizationSlug: string;
  projectIdOrSlug: string;
}

declare global {
  interface Window {
    SentryToolbar?: any;
  }
}

export function useSentryToolbar(config: SentryToolbarConfig) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existingScript = document.querySelector('script[data-sentry-toolbar]');
    if (existingScript) {
      window.SentryToolbar?.init(config);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js';
    script.async = true;
    script.setAttribute('data-sentry-toolbar', 'true');
    
    script.onload = () => {
      window.SentryToolbar?.init(config);
    };

    document.body.appendChild(script);

    return () => {
      if (existingScript) return;
      const scriptToRemove = document.querySelector('script[data-sentry-toolbar]');
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }
    };
  }, [config]);
}