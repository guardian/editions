# Authentication

## Authorizer

 This class is responsible for primarily piecing together a means of:
  - authorizing with user input credentials
  - authorizing with cached credentials that should have been cached while running aforementioned user input authorizer.

 It also takes the caches as its dependencies in order that it can clear them when required.

 The `userDataCache` is used to cache the results of running either of the authorizers in order to use this data when a user is offline. It shouldn't be set manually and as such isn't passed to the auth functions.

 Finally, even if a user is authenticated against some service, they may not have access to a resource (e.g. Editions) hence `checkUserHasAccess`, which is used to generate an `accessAttempt` which is at least as restrictive as the original `attempt` for the initial auth service.

## AccessController

An Access controller is responsible for listening to its Authorizers each time a sign in happens it will try to upgrade the current access level. If it can't "upgrade" the access level it will keep it as it was.

An Access controller only requires one authorizer to have a valid `accessAttempt` in order to report as being valid itself.

An upgrade is defined as either moving from offline to online (online attempts are more important than offline) or moving from invalid to valid. Currently the model doesn't support unauthenticated a user with a second attempt at authentication.

This also handle sign outs too by simply reconciling all of the authorizer attempts into this "most online" and then "most valid" after an authorizer has signed out.

This will also run the "silent" authorizer methods from caches when some form of connectivity is passed to `handleConnectionStatusChanged`. Although this will only ever cause at most two "silent" auths. An online one and, if it comes before the online one, an offline one.

`attempts` are the results of whether they managed to find an account / data with an auth service, `accessAttempt` takes this and runs it through a checker to see whether it has access to Editions. A derivation of all of these get passed up to the `AccessController` as they happen

## Terrible diagram

`attempts` are the results of whether they managed to find an account / data with an auth service, `accessAttempt` takes this and runs it through a checker to see whether it has access to Editions. A derivation of all of these get passed up to the `AccessController` as they happen.

![Screen Shot 2019-10-04 at 10 38 58](https://user-images.githubusercontent.com/1652187/66197963-501a6980-e693-11e9-80a1-0e4b7d612a96.png)
