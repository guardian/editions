# Backend

## Installling

Follow the steps in the project [readme](https://github.com/guardian/editions/blob/master/README.md).

## Running locally

### Janus

Ensure you have Janus credentials for `cmsFronts`.

### Env vars

You will need a `.env` file from another developer to run the backend.

`stage` is `prod` due to the fact that you get more results that way! The CAPI key is the canonical testing key ... if this, for whatever reason, doesn't work in future you can change it to a valid one.

### Run

```bash
yarn preview
```

You can now access the backend on `https://localhost:3131/`

The routing is done in `index.ts` - go and find some routes to hit!
