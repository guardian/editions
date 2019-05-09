# React Native

## Status: Accepted 

## Context 

The editions app needs to run and deliver background downloads functionality and a pleasant user experience across a variety of devices. The developers available to work on the project are not native apps developers and are all experienced React developers.

## Decision

To develop the editions app as a React Native application.

## Alternatives

[Expo](https://expo.io/) was evaluated but rejected because:

- Integration with first party native code is difficult.
- The managed workflow wants to use its own notification backend.
- It has shipped excess library code which has caused app store review problems.
- All the cool hot reload stuff was doable in react native alone.

[Flutter](https://flutter.dev/) was evaluated but rejected because:

- It reimplements the UI layer, posing significant risks to UX, UI and a11y. 
- it is primarily a UI Layer for Android and Fuschia. it doesn't generate usable markup on web.
- Smaller ecosystem than React Native

[Xamarin](https://visualstudio.microsoft.com/xamarin/) was evaluated but rejected because:

- Both this team and our department at large lacks C# experience
- No easy path to web

## Consequences

📱🤖 
