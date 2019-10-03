# Backend

## Running locally

### Janus

Ensure you have Janus credentials for `cmsFronts`.

### Env vars

Then ensure you have some environment variables set, to do it in your current shell just run:

```
export stage=prod && export psurl=https://preview.content.guardianapis.com/content/print-sent && export CAPI_KEY=test;
```

`stage` is `prod` due to the fact that you get more results that way! The CAPI key is the canonical testing key ... if this, for whatever reason, doesn't work in future you can change it to a valid one.

### Install node dependencies.

```bash
nvm use
yarn
```

### Run

```bash
yarn preview
```

You can now access the backend on `https://localhost:3131/`

The routing is done in `index.ts` - go and find some routes to hit!
