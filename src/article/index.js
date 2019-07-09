import { html } from "../shared/html.js";
import markdown from "../web_modules/snarkdown.js";
import { Http } from "../web_modules/@kwasniew/hyperapp-fx.js";
import { API_ROOT } from "../config.js";
import { authHeader } from "../shared/authHeader.js";

const SetArticle = (state, { article }) => ({ ...state, ...article });

const FetchArticle = ({ slug, token }) => {
  return Http({
    url: API_ROOT + "/articles/" + slug,
    options: { headers: authHeader(token) },
    action: SetArticle
  });
};

export const LoadArticlePage = page => (state, { slug }) => {
  const newState = {
    page,
    user: state.user,
    body: "",
    tagList: []
  };
  return [newState, FetchArticle({ slug, token: state.user.token })];
};

export const ArticlePage = ({ body, tagList }) => html`
  <div class="article-page">
    <div class="container page">
      <div class="row article-content">
        <div class="col-xs-12">
          <div innerHTML=${markdown(body)} />

          <ul class="tag-list">
            ${tagList.map(
              tag => html`
                <li class="tag-default tag-pill tag-outline">
                  ${tag}
                </li>
              `
            )}
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions" />
    </div>
  </div>
`;
