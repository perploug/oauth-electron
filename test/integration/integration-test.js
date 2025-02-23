import { Application } from "spectron";
import electronPath from "electron";
import { join } from "path";

describe.skip("oauth electron", () => {
  let app;
  beforeAll(async () => {
    jest.setTimeout(10000);
    app = new Application({
      path: electronPath,
      args: [join(__dirname, "./app/main_oauth2.js")],
    });
    await app.start();
  });

  afterAll(async () => {
    if (app && app.isRunning()) await app.stop();
  });

  it("should load electron app for facebook oauth", async () => {
    await app.client.setValue("#email", process.env.FB_USERNAME);
    await app.client.setValue("#pass", process.env.FB_PASSWORD);
    await app.client.click("#loginbutton");
    await app.client.waitUntilTextExists("#result", "Success");
  });
});
