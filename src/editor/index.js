import { ListErrors } from "../shared/ListErrors.js";
import { formFields, ChangeFieldFromTarget } from "../shared/formFields.js";
import { html } from "../shared/html.js";
import { errorsList } from "../shared/selectors.js";

export const LoadEditorPage = page => state => {
  return {
    page,
    user: state.user,
    ...formFields,
    title: "",
    description: "",
    body: "",
    currentTag: "",
    tagList: []
  };
};

export const EditorPage = ({
  title,
  description,
  body,
  currentTag,
  tagList,
  errors,
  inProgress
}) => html`
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
                  placeholder="Article Title"
                  value=${title}
                  oninput=${ChangeFieldFromTarget("title")}
                />
              </fieldset>

              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="What's this article about?"
                  value=${description}
                  oninput=${ChangeFieldFromTarget("description")}
                />
              </fieldset>

              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  value=${body}
                  oninput=${ChangeFieldFromTarget("body")}
                />
              </fieldset>

              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Enter tags"
                  value=${currentTag}
                  oninput=${ChangeFieldFromTarget("currentTag")}
                />

                <div class="tag-list">
                  ${tagList.map(
                    tag =>
                      html`
                        <span class="tag-default tag-pill">
                          <i class="ion-close-round" /> ${tag}
                        </span>
                      `
                  )}
                </div>
              </fieldset>

              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                disabled=${inProgress}
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
