// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // base_url: 'http://localhost:4200',
  api_base_url: 'http://localhost:8080',
  // OAUTH2_REDIRECT_URI: 'http://localhost:4200/oauth2/redirect',
  // GOOGLE_AUTH_URL: this.API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + this.OAUTH2_REDIRECT_URI,
  ACCESS_TOKEN: 'accessToken'
};
