import { html } from "../shared/html.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { API_ROOT } from "../config.js";
import { authHeader } from "../shared/authHeader.js";
import { LogError } from "../shared/errors.js";
import { profile, profileFavorited } from "../shared/pages.js";

const SetProfile = (state, { profile }) => ({ ...state, ...profile });

const FetchProfile = ({ username, token }) =>
  Http({
    url: API_ROOT + "/profiles/" + encodeURIComponent(username),
    options: { headers: authHeader(token) },
    action: SetProfile,
    error: LogError
  });

const OWN = "own";
const FAVORITED = "favorited";

export const LoadProfilePage = page => (state, { username }) => {
  const newState = { page, user: state.user, mode: OWN };
  return [newState, FetchProfile({ username, token: state.user.token })];
};

export const LoadProfileFavoritedPage = page => (state, { username }) => {
  const newState = { page, user: state.user, mode: FAVORITED };
  return [newState, FetchProfile({ username, token: state.user.token })];
};

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

const Tabs = ({ username, mode }) =>
  html`
    <ul class="nav nav-pills outline-active">
      <li class="nav-item">
        <a
          class=${mode === OWN ? "nav-link active" : "nav-link"}
          href=${profile(username)}
        >
          My Articles
        </a>
      </li>

      <li class="nav-item">
        <a
          class=${mode === FAVORITED ? "nav-link active" : "nav-link"}
          href=${profileFavorited(username)}
        >
          Favorited Articles
        </a>
      </li>
    </ul>
  `;

export const ProfilePage = ({ user, username, image, bio, following, mode }) => html`
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
                    ${Tabs({ username, mode })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      : ""}
  </div>
`;
