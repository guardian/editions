# Yarn as an npm package manager

As part of the React Native upgrade from 0.72.12 to 0.72.15, there is a new requirement to set a package manager within the `package.json`. This can be seen here: https://react-native-community.github.io/upgrade-helper/?from=0.72.12&to=0.72.15

This sets `yarn` at 3.6.4. We currently use `yarn` at no set version, but do install globally so this usually will be around 1.2.2.

## How to upgrade

Firstly you need to be using a version of node greater than 14 - which we are for all packages. Then you need to:

```
corepack enable
corepack prepare yarn@3.6.4 --activate
yarn set version 3.6.4
yarn
```

This will create a `.yarnrc` file which will state the version of yarn being used. It will create a `.yarn` folder where a local version of yarn will be installed for use within that project.

## Why is this a good thing?

As we have seen with globally installed projects before it (e.g. node, ruby gems, cocoapods), often a "one size fits all" approach doesn't work. Each project has its own nuances and this can lead to unforeseen bugs. Having a specific tool for the job makes sense.

## What went wrong when applying it to Editions?

This change needs to be applied in Github Actions. The only extension that supports this, is the following: https://github.com/marketplace/actions/setup-yarn-berry

At the time of writing, this only has 6 stars. When trying to implement it, I kept getting inconsistent results. This is not necessarily the fault of this action, however, it was not clear what the issue is. This means we cannot use it with confidence to help validate and build our projects.

Additionally, some projects are more in maintenance mode than others, and changing the core package manager may lead to unexpected bugs. With the current support around these projects being bare bones, it is not prudent to make a change to the core packages it uses. Therefore, I would suggest a risk averse approach for the time being.

## Conclusion

Maturity within github actions doesn't seem quite there yet. If we were just managing 1 React Native project within the repo, I think it would be fine, but this may have an effect elsewhere. So for the time being, this wont be implemented.
