import { PORT } from "./setup";
import { Matchers, Pact } from "@pact-foundation/pact";
import { FetchTags, SetTags } from "../src/pages/home";
import assert from "assert";
import path from "path";
import { LogError } from "../src/pages/fragments/forms";
import { FetchUserFeed } from "../src/pages/home";
import { SetArticles } from "../src/pages/fragments/articles";

const {
  eachLike,
  like,
  iso8601DateTimeWithMillis,
  boolean,
  integer
} = Matchers;

const provider = new Pact({
  consumer: "RealWorldApp Hyperapp Client",
  provider: "RealWorld API",
  port: PORT,
  dir: path.resolve(__dirname, "pacts"),
  log: path.resolve(__dirname, "logs", "pact.log"),
  logLevel: "ERROR"
});

describe("Real World API Home Page", () => {
  before(async function() {
    this.timeout(5000);
    await provider.setup();
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
        body: {
          tags: eachLike("tag")
        }
      }
    });

    const dispatch = await runFx(FetchTags);
    assert.deepStrictEqual(dispatch.invokedWith, [SetTags, { tags: ["tag"] }]);
  });

  it("return tag list error", async () => {
    await provider.addInteraction({
      state: "failing tags",
      uponReceiving: "request for tags",
      withRequest: {
        method: "GET",
        path: "/api/tags"
      },
      willRespondWith: {
        status: 422,
        headers: { "Content-Type": "application/json" },
        body: {
          errors: eachLike("unexpected error")
        }
      }
    });

    const dispatch = await runFx(FetchTags);
    assert.deepStrictEqual(dispatch.invokedWith, [
      LogError,
      { errors: ["unexpected error"] }
    ]);
  });

  it("get a list of articles from users we follow", async () => {
    await provider.addInteraction({
      state: "articles in followed users feed",
      uponReceiving: "request for articles",
      withRequest: {
        method: "GET",
        path: "/api/articles/feed",
        query: "limit=10&offset=0"
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          Authorization: like("Token placeholder")
        },
        body: {
          articles: eachLike({
            slug: like("sample-title-xyz"),
            title: like("Sample Title"),
            description: like("Some Description"),
            body: like("# Article Header"),
            tagList: eachLike("tag"),
            createdAt: iso8601DateTimeWithMillis("2019-07-09T16:09:25.138Z"),
            favorited: boolean(true),
            favoritesCount: integer(0),
            author: {
              username: like("Some Author"),
              bio: like("Some bio"),
              image: like(
                "https://avatars3.githubusercontent.com/u/12631?s=400&v=4"
              ),
              following: boolean(true)
            }
          }),
          articlesCount: integer(1)
        }
      }
    });

    const dispatch = await runFx(
      FetchUserFeed({ pageIndex: 0, token: "placeholder" })
    );
    const [action, {articles, articlesCount}] = dispatch.invokedWith;
    assert.deepStrictEqual(action, SetArticles);
    assert.deepStrictEqual(articles.length, 1);
    assert.deepStrictEqual(articlesCount, 1);
  });
});
