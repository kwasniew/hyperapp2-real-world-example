import { ListErrors } from "./fragments/forms.js";
import { formFields } from "./fragments/forms.js";
import html from "hyperlit";
import { errorsList } from "./fragments/forms.js";
import { Http } from "@kwasniew/hyperapp-fx";
import { API_ROOT } from "../config.js";
import { FormError, Submitting } from "./fragments/forms.js";
import { HOME } from "./links.js";
import { authHeader } from "../shared/authHeader.js";
import { FetchArticle } from "./fragments/article.js";
import { RedirectAction } from "../lib/router.js";
import { NEW_EDITOR } from "./links.js";

// Actions & Effects
const AddTag = (state) => ({ ...state, currentTag: "", tagList: [...state.tagList, state.currentTag] });

const RemoveTag = (tag) => (state) => ({
  ...state,
  tagList: state.tagList.filter((t) => t !== tag),
});

const SaveArticle = ({ article, token, method, url }) =>
  Http({
    url,
    options: {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify({ article }),
    },
    errorResponse: "json",
    action: RedirectAction(HOME),
    error: FormError,
  });

const SubmitArticle = (state) => [
  Submitting(state),
  SaveArticle({
    article: {
      title: state.title,
      description: state.description,
      body: state.body,
      tagList: state.tagList,
    },
    token: state.user.token,
    url: API_ROOT + "/articles" + (state.page === NEW_EDITOR ? "" : `/${state.slug}`),
    method: state.page === NEW_EDITOR ? "POST" : "PUT",
  }),
];

export const LoadNewEditorPage = (page) => (state) => ({
  page,
  user: state.user,
  ...formFields,
  title: "",
  description: "",
  body: "",
  currentTag: "",
  tagList: [],
});

export const LoadEditorPage = (page) => (state, { slug }) => {
  const newState = LoadNewEditorPage(page)(state);
  return [newState, FetchArticle({ slug, token: state.user.token })];
};

// Views
export const EditorPage = ({ title, description, body, currentTag, tagList, errors, inProgress }) => html`
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          ${ListErrors({ errors: errorsList({ errors }) })}

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  data-test="title"
                  placeholder="Article Title"
                  value=${title}
                  oninput=${(state, event)=>({...state, title: event.target.value})}
                />
              </fieldset>

              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  data-test="description"
                  placeholder="What's this article about?"
                  value=${description}
                  oninput=${(state, event)=>({...state, description: event.target.value})}
                />
              </fieldset>

              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  data-test="body"
                  placeholder="Write your article (in markdown)"
                  value=${body}
                  oninput=${(state, event)=>({...state, body: event.target.value})}
                />
              </fieldset>

              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  data-test="tags"
                  placeholder="Enter tags"
                  value=${currentTag}
                  onkeyup=${(state, event) => {
                    return event.keyCode===13 ? [AddTag, currentTag] : state;
                    event.preventDefault();
                  }}
                  oninput=${(state, event)=>({...state, currentTag: event.target.value})}
                />

                <div class="tag-list">
                  ${tagList.map(
                    (tag) =>
                      html`
                        <span data-test="tag" class="tag-default tag-pill">
                          <i class="ion-close-round" data-test="remove-tag" onclick=${RemoveTag(tag)} />
                          ${tag}
                        </span>
                      `
                  )}
                </div>
              </fieldset>

              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                disabled=${inProgress}
                onclick=${(_, event) => {event.preventDefault(); return SubmitArticle}}
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
`;
