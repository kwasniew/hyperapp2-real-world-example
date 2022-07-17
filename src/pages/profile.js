import html from "hyperlit";
import { Http } from "@kwasniew/hyperapp-fx";
import { API_ROOT } from "../config.js";
import { authHeader } from "../shared/authHeader.js";
import { LogError } from "./fragments/forms.js";
import { ArticleList, loadingArticles } from "./fragments/articles.js";
import { FetchArticles } from "./fragments/articles.js";
import { profile, profileFavorited, SETTINGS } from "./links.js";

// Actions & Effects
const SetProfile = (state, { profile }) => ({ ...state, profile });

const FetchProfile = ({ username, token }) =>
  Http({
    url: API_ROOT + "/profiles/" + encodeURIComponent(username),
    options: { headers: authHeader(token) },
    action: SetProfile,
    error: LogError,
  });

const AUTHOR_FEED = "author";
const FAVORITED_FEED = "favorited";

const FetchAuthorFeed = ({ page, username, token }) =>
  FetchArticles(`/articles?author=${encodeURIComponent(username)}&limit=5&offset=0`, token);
const FetchFavoritedFeed = ({ page, username, token }) =>
  FetchArticles(`/articles?favorited=${encodeURIComponent(username)}&limit=5&offset=0`, token);

const fetches = {
  [AUTHOR_FEED]: FetchAuthorFeed,
  [FAVORITED_FEED]: FetchFavoritedFeed,
};

export const LoadPage = (activeFeedType) => (page) => (state, { username }) => {
  const newState = {
    page,
    user: state.user,
    profile: state.profile || { username },
    activeFeedType,
    ...loadingArticles,
  };
  return [
    newState,
    FetchProfile({ username, token: state.user.token }),
    fetches[activeFeedType]({ page, username, token: state.user.token }),
  ];
};
export const LoadProfilePage = LoadPage(AUTHOR_FEED);
export const LoadProfileFavoritedPage = LoadPage(FAVORITED_FEED);

const ChangeFollow = (method) => (state) => [
  state,
  Http({
    url: API_ROOT + "/profiles/" + encodeURIComponent(state.profile.username) + "/follow",
    options: { method, headers: authHeader(state.user.token) },
    action: SetProfile,
    error: LogError,
  }),
];

const Follow = ChangeFollow("POST");
const Unfollow = ChangeFollow("DELETE");

// Views
const FollowUserButton = ({ username, following }) => html`
  <button
    data-test="changeFollow"
    onclick=${following ? Unfollow : Follow}
    class=${"btn btn-sm action-btn" + (following ? " btn-secondary" : " btn-outline-secondary")}
  >
    <i class="ion-plus-round" />
    ${" "} ${following ? "Unfollow" : "Follow"} ${username}
  </button>
`;

const EditProfileSettings = () => html`
  <a data-test="editSettings" href=${SETTINGS} class="btn btn-sm btn-outline-secondary action-btn">
    <i class="ion-gear-a" /> Edit Profile Settings
  </a>
`;

const Tabs = ({ username, activeFeedType }) =>
  html`
    <ul class="nav nav-pills outline-active">
      <li class="nav-item">
        <a
          data-test="feed"
          class=${activeFeedType === AUTHOR_FEED ? "nav-link active" : "nav-link"}
          href=${profile(username)}
        >
          My Articles
        </a>
      </li>

      <li class="nav-item">
        <a
          data-test="feed"
          class=${activeFeedType === FAVORITED_FEED ? "nav-link active" : "nav-link"}
          href=${profileFavorited(username)}
        >
          Favorited Articles
        </a>
      </li>
    </ul>
  `;

const isLoggedIn = ({ user }) => user.token;
const isOwnProfile = ({ user, profile }) => user.username === profile.username;

export const ProfilePage = ({ user, profile, activeFeedType, articles, isLoading }) => html`
  <div class="profile-page">
    <div>
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              ${profile.image
                ? html` <img data-test="avatar" class="user-img" src=${profile.image} alt=${profile.username} /> `
                : ""}
              <h4 data-test="username">${profile.username}</h4>
              <p data-test="bio">${profile.bio}</p>

              ${isLoggedIn({ user })
                ? isOwnProfile({ user, profile })
                  ? EditProfileSettings()
                  : FollowUserButton({
                      username: profile.username,
                      following: profile.following,
                    })
                : ""}
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              ${Tabs({ username: profile.username, activeFeedType })}
            </div>
            ${ArticleList({ articles, isLoading })}
          </div>
        </div>
      </div>
    </div>
  </div>
`;
