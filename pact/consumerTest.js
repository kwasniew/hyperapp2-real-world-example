import { PORT } from "./setup.js";
import { Pact } from "@pact-foundation/pact";
import { FetchTags, SetTags } from "../src/pages/home.js";
import assert from "assert";
import path from "path";

const provider = new Pact({
  consumer: "RealWorldApp Hyperapp Client",
  provider: "RealWorld API",
  port: PORT,
  dir: path.resolve(__dirname, "pacts"),
  log: path.resolve(__dirname, "logs", "pact.log"),
  logLevel: "ERROR"
});

const EXPECTED_BODY = {
  tags: ["tag1", "tag2"]
};

describe("Real World API", () => {
  before(async function() {
    this.timeout(5000);
    await provider.setup();
    await provider.addInteraction({
      state: "list of tags",
      uponReceiving: "request for tags",
      withRequest: {
        method: "GET",
        path: "/api/tags"
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: EXPECTED_BODY
      }
    });
  });

  afterEach(() => provider.verify());

  after(() => provider.finalize());

  const runFx = async fx => {
    const dispatch = (action, value) => {
      dispatch.invokedWith = [action, value];
    };
    const [effect, props] = fx;
    await effect(dispatch, props);
    return dispatch;
  };

  it("get a list of tags", async () => {
    const dispatch = await runFx(FetchTags);
    assert.deepStrictEqual(dispatch.invokedWith, [SetTags, EXPECTED_BODY]);
  });
});
