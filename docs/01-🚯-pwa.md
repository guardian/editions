# PWA

## Status: Rejected

## Context

This needs to work cross platform.

The UX will be rendered in browser, which may not appear native.

## Decision

To implement Editions as a progressive web app, delivered in a native wrapper. The native wrapper will contain a webview, that renders the PWA.

The wrapper will handle required features that are not supported by PWAs such as background fetch, scheduled downloads and push notification handling.

## Consequences

Because some key PWA features are not currently supported in Safari or WKWebView (e.g. service workers), the native wrapper will need to handle functionality such as offline browsing and universal links in iOS.
