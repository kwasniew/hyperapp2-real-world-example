import { html } from "../shared/html.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { API_ROOT } from "../config.js";
import { authHeader } from "../shared/authHeader.js";
import { LogError } from "../shared/errors.js";
import { profile, profileFavorited } from "../shared/pages.js";
import {
  FetchArticles,
  ArticleList,
  loadingArticles,
  AUTHOR_FEED,
  FAVORITED_FEED
} from "../shared/articles/index.js";
import { pages } from "../shared/selectors.js";

const SetProfile = (state, { profile }) => ({ ...state, ...profile });

const FetchProfile = ({ username, token }) =>
  Http({
    url: API_ROOT + "/profiles/" + encodeURIComponent(username),
    options: { headers: authHeader(token) },
    action: SetProfile,
    error: LogError
  });

export const LoadPage = activeFeedType => page => (state, { username }) => {
  const newState = {
    page,
    username,
    user: state.user,
    activeFeedType,
    ...loadingArticles
  };
  return [
    newState,
    [
      FetchProfile({ username, token: state.user.token }),
      FetchArticles(newState)
    ]
  ];
};
export const LoadProfilePage = LoadPage(AUTHOR_FEED);
export const LoadProfileFavoritedPage = LoadPage(FAVORITED_FEED);

const ChangeFollow = method => state => [
  state,
  Http({
    url:
      API_ROOT + "/profiles/" + encodeURIComponent(state.username) + "/follow",
    options: { method, headers: authHeader(state.user.token) },
    action: SetProfile,
    error: LogError
  })
];

const Follow = ChangeFollow("POST");
const Unfollow = ChangeFollow("DELETE");

const FollowUserButton = ({ username, following }) => html`
  <button
    onclick=${following ? Unfollow : Follow}
    class=${"btn btn-sm action-btn" +
      (following ? " btn-secondary" : " btn-outline-secondary")}
  >
    <i class="ion-plus-round" />
    ${" "} ${following ? "Unfollow" : "Follow"} ${username}
  </button>
`;

const Tabs = ({ username, activeFeedType }) =>
  html`
    <ul class="nav nav-pills outline-active">
      <li class="nav-item">
        <a
          class=${activeFeedType === AUTHOR_FEED
            ? "nav-link active"
            : "nav-link"}
          href=${profile(username)}
        >
          My Articles
        </a>
      </li>

      <li class="nav-item">
        <a
          class=${activeFeedType === FAVORITED_FEED
            ? "nav-link active"
            : "nav-link"}
          href=${profileFavorited(username)}
        >
          Favorited Articles
        </a>
      </li>
    </ul>
  `;

export const ProfilePage = ({
  user,
  username,
  image,
  bio,
  following,
  activeFeedType,
  articles,
  isLoading,
  articlesCount,
  currentPageIndex
}) => html`
  <div class="profile-page">
    ${username
      ? html`
          <div>
            <div class="user-info">
              <div class="container">
                <div class="row">
                  <div class="col-xs-12 col-md-10 offset-md-1">
                    <img class="user-img" src=${image} alt=${username} />
                    <h4>${username}</h4>
                    <p>${bio}</p>

                    ${user.username === username
                      ? ""
                      : FollowUserButton({ username, following })}
                  </div>
                </div>
              </div>
            </div>
            <div class="container">
              <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                  <div class="articles-toggle">
                    ${Tabs({ username, activeFeedType })}
                  </div>
                  ${ArticleList({
                    articles,
                    isLoading,
                    pages: pages({ count: articlesCount, currentPageIndex })
                  })}
                </div>
              </div>
            </div>
          </div>
        `
      : ""}
  </div>
`;
