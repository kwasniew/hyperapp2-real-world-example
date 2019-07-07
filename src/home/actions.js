import {Http} from "../web_modules/hyperapp-fx.js";

const API_ROOT = "https://conduit.productionready.io/api";

const Loading = state => ({...state, isLoading: true});
const LoadingFinished = state => ({...state, isLoading: false});

const SetArticles = (state, {articles}) => ({...state, articles});

export const FetchArticles = Http({
    url: API_ROOT + '/articles',
    action: SetArticles
});

