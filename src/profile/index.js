import { html } from "../shared/html.js";

export const LoadProfilePage = page => (state, { username }) => {
    const newState = {
        page,
        user: state.user
    };
    return newState;
};

export const ProfilePage = ({username, image, bio}) => html`
  <div class="profile-page">
    ${username
      ? html`
          <div>
            <div class="user-info">
              <div class="container">
                <div class="row">
                  <div class="col-xs-12 col-md-10 offset-md-1">
                    <img
                      class="user-img"
                      src=${image}
                      alt=${username}
                    />
                    <h4>${username}</h4>
                    <p>${bio}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="container">
              <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                  <div class="articles-toggle"></div>
                </div>
              </div>
            </div>
          </div>
        `
      : ""}
  </div>
`;
