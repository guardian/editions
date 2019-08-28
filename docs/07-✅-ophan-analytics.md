# Ophan Analytics

## Status: Accepted

## Context

We need a way to send analytics data to Ophan (internal analytics analysis tool). This includes at its MVP level, screen views and events. This needs to work across iOS and Android.

## Decision

```sequence
Ophan Analytics Library->Multiplatform Ophan: Thrift interface
Multiplatform Ophan->Native React Native Layer: Native iOS and Android modules
Native React Native Layer->Typescript Layer: Type definitions to mimic modules
Typescript Layer->App Code: Consume! 🍔
App Code-->Ophan Analytics Library: Sends events
```

### Key

**Ophan Analytics Library** - This is the current library that provides an interface to log events in Ophan.

**Multplatform Ophran** - Written in Kotlin, this uses the Ophan Analytics Library via its Thrift interface and exposes a subset of methods required by the apps.

**Native React Native Layer** - Takes the module created by Multiplatform Ophan and makes it "React Nativey" to expose methods to the JS.

**Typescript Layer** - Takes the React Native JS methods exposed and provides type definitions for them. This is what the App will use and it means we can capture errors at build time.

**App Code** - Consumes the typescript library where its needed.

## Alternatives

Google Analytics and Firebase Analytics are alternatives, however, Ophan is part of the business strategy going forward.

## Consequences

Logic split between step function defintion and lambdas.
