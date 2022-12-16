jest.mock("../../lib/oauth1-login", () => jest.fn());
jest.mock("../../lib/oauth2-login", () => jest.fn());
import loginOauth1 from "../../lib/oauth1-login";
import loginOauth2 from "../../lib/oauth2-login";
import { oauth1, oauth2 } from "../..";

describe("index should", () => {
  test("export oauth1 login", async () => {
    expect(oauth1).toBe(loginOauth1);
  });
  test("export oauth2 login", async () => {
    expect(oauth2).toBe(loginOauth2);
  });
});
