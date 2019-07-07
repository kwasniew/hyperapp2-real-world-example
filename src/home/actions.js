import {Http} from "../web_modules/hyperapp-fx.js";
import {preventDefault} from "../shared/events.js";
import {GLOBAL_FEED} from "./feeds.js";

const API_ROOT = "https://conduit.productionready.io/api";

const Loading = state => ({...state, isLoading: true});
const LoadingFinished = state => ({...state, isLoading: false});

const SetArticles = (state, {articles}) => ({...state, articles});

export const FetchArticles = Http({
    url: API_ROOT + '/articles',
    action: SetArticles
});

export const ChangeTab = (state, tab) => [({...state, tab}), preventDefault];

export const LoadHomePage = page => state => [{...state, page, articles: [], currentPage: 0, tab: GLOBAL_FEED}, FetchArticles];