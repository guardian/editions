# Editions Webview

Current examples at: https://richieahb.github.io/editions-webview/

Currently, for the editions app, we build our article webviews on the fly. In future there should probably be some better tooling around this that allows us to run a nice little parcel build and throw our article data into the webview via injected JS. Until then, and while we're still concatenating strings, this gives a nice API around creating tagged components and adding non-global styles to them similar to `styled-components` and some naive `react` combined.

Feel free to never use this code or - if it ever gets used - rip it out when something better comes along. Hopefully the similarity to components will make porting it to a JSX type thing easier in future - but it may not.

Best place to look to understand this API is `./lib.ts` (there are lots of comments) and the associated test for it. Or just poke around in some of the components.

TL;DR - this is a big stopgap
