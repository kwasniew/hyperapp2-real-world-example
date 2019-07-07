import { Http } from "../web_modules/hyperapp-fx.js";
import { preventDefault } from "../shared/events.js";
import { GLOBAL_FEED, TAG_FEED } from "./feeds.js";
import { mapValues } from "../shared/object.js";

const API_ROOT = "https://conduit.productionready.io/api";

const Loading = state => ({ ...state, isLoading: true });
const LoadingFinished = state => ({ ...state, isLoading: false });

const SetArticles = (state, { articles }) => ({ ...state, articles });

export const FetchArticles = Http({
  url: API_ROOT + "/articles",
  action: SetArticles
});

const SetTags = (state, { tags }) => ({ ...state, tags });

export const FetchTags = Http({
  url: API_ROOT + "/tags",
  action: SetTags
});

export const ChangeTab = (state, {name, type}) => {
  const updateFeed = feed => {
    if (feed.type === type) {
      feed.active = true;
      feed.visible = true;
    } else {
      feed.active = false;
      if(feed.type === TAG_FEED) {
        feed.visible = false;
      }
    }
    if(name) {
      feed.name = name;
    }
    return feed;
  };
  const feeds = mapValues(updateFeed)(state.feeds);
  return [{ ...state, feeds }, preventDefault];
};

export const LoadHomePage = page => state => [
  { ...state, page, articles: [], currentPage: 0, tags: [], tab: GLOBAL_FEED },
  [FetchArticles, FetchTags]
];
