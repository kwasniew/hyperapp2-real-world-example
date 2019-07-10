import { html } from "../shared/html.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { API_ROOT } from "../config.js";
import { authHeader } from "../shared/authHeader.js";
import { LogError } from "../shared/errors.js";
import { profile} from "./links.js";
import {
    ArticleList,
    loadingArticles
} from "./fragments/articles.js";
import { pages } from "../shared/selectors.js";
import { FetchArticles } from "./fragments/articles.js";
import {profileFavorited, SETTINGS} from "./links.js";

// Actions & Effects
const SetProfile = (state, { profile }) => ({ ...state, profile });

const FetchProfile = ({ username, token }) =>
    Http({
        url: API_ROOT + "/profiles/" + encodeURIComponent(username),
        options: { headers: authHeader(token) },
        action: SetProfile,
        error: LogError
    });

export const AUTHOR_FEED = "author";
export const FAVORITED_FEED = "favorited";

const FetchAuthorFeed = ({ page, username, token }) =>
    FetchArticles(
        `/articles?author=${encodeURIComponent(username)}&limit=5&offset=${page *
        5}`,
        token
    );
const FetchFavoritedFeed = ({ page, username, token }) =>
    FetchArticles(
        `/articles?favorited=${encodeURIComponent(username)}&limit=5&offset=${page *
        5}`,
        token
    );

const fetches = {
    [AUTHOR_FEED]: FetchAuthorFeed,
    [FAVORITED_FEED]: FetchFavoritedFeed
};

export const LoadPage = activeFeedType => page => (state, { username }) => {
    const newState = {
        page,
        user: state.user,
        profile: state.profile || { username },
        activeFeedType,
        ...loadingArticles
    };
    return [
        newState,
        [
            FetchProfile({ username, token: state.user.token }),
            fetches[activeFeedType]({page, username, token: state.user.token})
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

// Views
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

const EditProfileSettings = () => html`
  <a href=${SETTINGS} class="btn btn-sm btn-outline-secondary action-btn">
    <i class="ion-gear-a" /> Edit Profile Settings
  </a>
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
                                profile,
                                // username,
                                // image,
                                // bio,
                                // following,
                                activeFeedType,
                                articles,
                                isLoading,
                                articlesCount,
                                currentPageIndex
                            }) => html`
  <div class="profile-page">
    <div>
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              ${profile.image
    ? html`
                    <img
                      class="user-img"
                      src=${profile.image}
                      alt=${profile.username}
                    />
                  `
    : ""}
              <h4>${profile.username}</h4>
              <p>${profile.bio}</p>

              ${user.username === profile.username
    ? EditProfileSettings()
    : FollowUserButton({
        username: profile.username,
        following: profile.following
    })}
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
            ${ArticleList({
    articles,
    isLoading,
    pages: pages({ count: articlesCount, currentPageIndex })
})}
          </div>
        </div>
      </div>
    </div>
  </div>
`;
