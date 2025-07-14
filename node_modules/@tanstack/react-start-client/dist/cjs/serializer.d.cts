import type * as React from 'react';
declare module '@tanstack/start-client-core' {
    interface SerializerExtensions {
        ReadableStream: React.JSX.Element;
    }
}
