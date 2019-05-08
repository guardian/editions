# React Native

## Status: Accepted 

## Context 

The editions app needs to run and deliver background downloads functionality and a pleasant user experience across a variety of devices. The developers available to work on the project are not native apps developers and are all experienced React developers.

## Decision

To develop the editions app as a React Native application.

## Additional information

[Expo](https://expo.io/) was evaluated but rejected because:

- Integration with first party native code is difficult.
- The managed workflow wants to use its own notification backend.
- It has shipped excess library code which has caused app store review problems.
- All the cool hot reload stuff was doable in react native alone.

## Consequences

📱🤖 
