## What is this?

Some parts of the app use hosted webapps that live as separate projects. They get compiled at build time and run time using the information from the `manifest.js` file alongside this document.

## How does it work?

-   In dev mode, it spins up the dev server and points the crossword webview to `http://localhost:{port}`
-   In prod, it bundles everything up and then moves the dist folder to the proper bundle. This gets bundled with the app.

This is done using the scripts declared in `package.json`

## How do I add an app?

Add it to the manifest. Android should auto link it. For iOS follow the Xcode-related steps here: https://medium.com/@caphun/react-native-load-local-static-site-inside-webview-2b93eb1c4225 and make sure you commit any changes to the iOS build files, as the actual bundles don't go in git.
