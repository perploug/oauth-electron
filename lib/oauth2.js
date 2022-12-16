import { OAuth2 } from "oauth";

class Oauth {
  constructor(info) {
    this.info = info;

    this.oauth = new OAuth2(
      info.key,
      info.secret,
      info.baseSite,
      info.authorizePath,
      info.accessTokenPath
    );
  }

  getAuthUrl() {
    return this.oauth.getAuthorizeUrl({
      redirect_uri: this.info.redirectUrl,
      scope: this.info.scope,
      response_type: this.info.responseType || `code`,
    });
  }

  getTokens(code) {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthAccessToken(
        code,
        {
          redirect_uri: this.info.redirectUrl,
        },
        (error, _, __, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }
}

export default Oauth;
