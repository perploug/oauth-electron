jest.mock("oauth", () => ({
  OAuth: jest.fn(),
}));
jest.mock("query-string", () => ({
  parse: jest.fn(),
}));

import Oauth from "../../../lib/oauth1";
import { OAuth as OAuth1 } from "oauth";
import { faker } from "@faker-js/faker";
import { parse as _parse } from "query-string";

describe("oauth should", () => {
  test("construct using library", async () => {
    let info = {
        requestUrl: faker.datatype.uuid(),
        accessUrl: faker.datatype.uuid(),
        key: faker.datatype.uuid(),
        secret: faker.datatype.uuid(),
        version: faker.datatype.uuid(),
        authCallback: faker.datatype.uuid(),
        signatureMethod: faker.datatype.uuid(),
      },
      expectedResult = { some: faker.datatype.uuid() };
    OAuth1.mockImplementation(() => expectedResult);

    let result = new Oauth(info);
    expect(OAuth1).toBeCalledWith(
      info.requestUrl,
      info.accessUrl,
      info.key,
      info.secret,
      info.version,
      info.authCallback,
      info.signatureMethod
    );
    expect(result.oauth).toEqual(expectedResult);
    expect(result.info).toEqual(info);
  });

  test("getRequestTokens returns tokens", async () => {
    let token = faker.datatype.uuid(),
      tokenSecret = faker.datatype.uuid();
    let oauthMockResult = {
      getOAuthRequestToken: jest.fn((cb) => cb(undefined, token, tokenSecret)),
    };
    OAuth1.mockImplementation(() => oauthMockResult);
    let result = new Oauth({});
    let tokens = await result.getRequestTokens();
    expect(tokens).toEqual({ token, tokenSecret });
  });

  test("getRequestTokens returns rejection if error", async () => {
    let error = faker.datatype.uuid();
    let oauthMockResult = {
      getOAuthRequestToken: jest.fn((cb) => cb(error, undefined, undefined)),
    };
    OAuth1.mockImplementation(() => oauthMockResult);
    let result = new Oauth({});
    expect(result.getRequestTokens()).rejects.toEqual(error);
  });

  test("getAuthTokens returns rejection if error", async () => {
    let request = {
        token: faker.datatype.uuid(),
        tokenSecret: faker.datatype.uuid(),
      },
      resultTokens = {
        token: faker.datatype.uuid(),
        tokenSecret: faker.datatype.uuid(),
      },
      url = faker.datatype.uuid(),
      query = {
        oauth_verifier: faker.datatype.uuid(),
      };

    const oauthMockResult = {
      getOAuthAccessToken: jest.fn((_, __, ___, cb) =>
        cb(undefined, resultTokens.token, resultTokens.tokenSecret)
      ),
    };

    _parse.mockReturnValue(query);
    OAuth1.mockImplementation(() => oauthMockResult);
    let result = new Oauth({});

    expect(await result.getAccessToken(url, request)).toEqual(resultTokens);
    expect(oauthMockResult.getOAuthAccessToken).toBeCalledWith(
      request.token,
      request.tokenSecret,
      query.oauth_verifier,
      expect.anything()
    );
    expect(_parse).toBeCalledWith(url);
  });
});
