import { html } from "../shared/html.js";
import markdown from "../web_modules/snarkdown.js";

export const LoadArticlePage = page => state => {
  return {
    page,
    user: state.user,
    body: "test",
    tagList: ["test"]
  };
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
