# Angular OAuth2 Demo

Minimal Angular OAuth2 demo App with Client Credentials Grant.

## How to run

1. clone project with git.
2. install dependencies: `npm install`.
3. build the app with server-side-rendering: `npm run build:ssr`.
4. start app: `npm run serve:ssr`
5. open browser, navigate to `http://localhost:3000`

## The App flow

When user navigate to the `/home`, before angular ssr rendering the page, the express server will check if the token exists in memory cache:

- if token cached and valid, pass the request to angular ssr
- if token not existed or expired, then re-generate the token and save to cache

Then angular ssr will start to render the page.

- for ssr, the guard will use `InMemoryStorageService` to get/set the token. If token not existed or expired, then get the token from server API. When the angular component has api call, the ssr interceptor will auto set the token header. After rendering finished, the redered html will send to client.
- for ssr-csr transmission, if token or api has transfered from ssr, then csr won't get the token or api from browser again.
- for pure csr flow, will use `localStorage` to get/set the token.

It's important to handle the error with the API:

- if get token failed from remote server, then only the page reload will retry to get token
- if api request failed, then won't save error response in state, the api call will execute in browser each tome

## Reference

- [Implement the Client Credentials Grant](https://auth0.com/docs/api-auth/tutorials/client-credentials)
