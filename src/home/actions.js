import { Http } from "../web_modules/hyperapp-fx.js";
import { preventDefault } from "../shared/events.js";
import { GLOBAL_FEED, TAG_FEED } from "./feeds.js";
import { mapValues } from "../shared/object.js";

const API_ROOT = "https://conduit.productionready.io/api";

const SetArticles = (state, { articles }) => ({
  ...state,
  isLoading: false,
  articles
});

export const FetchFeed = path =>
  Http({
    url: API_ROOT + path,
    action: SetArticles
  });

export const FetchGlobalFeed = FetchFeed("/articles");
export const FetchTagFeed = tag => FetchFeed(`/articles?tag=${tag}`);

const SetTags = (state, { tags }) => ({ ...state, tags });

export const FetchTags = Http({
  url: API_ROOT + "/tags",
  action: SetTags
});

const FetchArticles = state => {
  const activeFeed = state.feeds.find(feed => feed.type === state.active);
  if (activeFeed.type === GLOBAL_FEED) {
    return FetchGlobalFeed;
  } else if (activeFeed.type === TAG_FEED) {
    return FetchTagFeed(activeFeed.name);
  } else {
    return null;
  }
};

export const ChangeTab = (state, { name, type }) => {
  const updateFeed = feed => {
    if (feed.type === type) {
      feed.visible = true;
    } else if (feed.type === TAG_FEED) {
      feed.visible = false;
    }
    if (name) {
      feed.name = name;
    }
    return feed;
  };
  const feeds = state.feeds.map(updateFeed);
  const newState = {
    ...state,
    active: type,
    feeds,
    articles: [],
    isLoading: true
  };
  return [newState, [preventDefault, FetchArticles(newState)]];
};

export const LoadHomePage = page => state => [
  { ...state, page, articles: [], currentPage: 0, tags: [], isLoading: true },
  [FetchArticles(state), FetchTags]
];
