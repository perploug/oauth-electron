import { OAuth } from "oauth";
import queryString from "query-string";

const tokenizerCallback = (resolve, reject) => (error, token, tokenSecret) => {
  if (error) return reject(error);
  resolve({ token, tokenSecret });
};

class Oauth {
  constructor(info) {
    this.info = info;
    this.oauth = new OAuth(
      info.requestUrl,
      info.accessUrl,
      info.key,
      info.secret,
      info.version,
      info.authCallback,
      info.signatureMethod
    );
  }

  getRequestTokens() {
    return new Promise((resolve, reject) =>
      this.oauth.getOAuthRequestToken(tokenizerCallback(resolve, reject))
    );
  }

  getAccessToken(url, requestTokens) {
    let verifier = queryString.parse(url).oauth_verifier;
    return new Promise((resolve, reject) =>
      this.oauth.getOAuthAccessToken(
        requestTokens.token,
        requestTokens.tokenSecret,
        verifier,
        tokenizerCallback(resolve, reject)
      )
    );
  }
}

export default Oauth;
