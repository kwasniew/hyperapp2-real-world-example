import html from "hyperlit";
import markdown from "snarkdown";
import { Http } from "@kwasniew/hyperapp-fx";
import { API_ROOT } from "../config.js";
import { authHeader } from "../shared/authHeader.js";
import { profile, editor, HOME, LOGIN, REGISTER } from "./links.js";
import { format } from "../shared/date.js";
import { LogError } from "./fragments/forms.js";
import { RedirectAction } from "../lib/router.js";
import { FetchArticle } from "./fragments/article.js";

// Actions & Effects
const DeleteComment = (id) => (state) => ({
  ...state,
  comments: state.comments.filter((comment) => comment.id !== id),
});

const SubmitDeleteComment = (id) => (state) => [
  state,
  Http({
    url: API_ROOT + "/articles/" + state.slug + "/comments/" + id,
    options: {
      method: "DELETE",
      headers: {
        ...authHeader(state.user.token),
      },
    },
    action: DeleteComment(id),
    error: LogError,
  }),
];

const AddComment = (state, { comment }) => ({
  ...state,
  commentText: "",
  comments: [comment, ...state.comments],
});

const SubmitComment = (state) => [
  state,
  Http({
    url: API_ROOT + "/articles/" + state.slug + "/comments",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(state.user.token),
      },
      body: JSON.stringify({ comment: { body: state.commentText } }),
    },
    action: AddComment,
    error: LogError,
  }),
];

const DeleteArticle = ({ slug, token }) =>
  Http({
    url: API_ROOT + "/articles/" + slug,
    options: { method: "DELETE", headers: authHeader(token) },
    action: RedirectAction(HOME),
    error: LogError,
  });

const SubmitDeleteArticle = (state) => [{ ...state }, DeleteArticle({ slug: state.slug, token: state.user.token })];

const SetComments = (state, { comments }) => ({ ...state, comments });

const FetchComments = ({ slug, token }) => {
  return Http({
    url: API_ROOT + "/articles/" + slug + "/comments",
    options: { headers: authHeader(token) },
    action: SetComments,
    error: LogError,
  });
};

export const LoadArticlePage = (page) => (state, { slug }) => {
  const newState = {
    page,
    slug,
    user: state.user,
    body: "",
    author: {},
    tagList: [],
    comments: [],
    commentText: "",
  };
  return [
    newState,
    FetchArticle({ slug, token: state.user.token }), FetchComments({ slug, token: state.user.token }),
  ];
};

// Selectors
const canModifySelector = (author) => (loggedInUser) => loggedInUser.token && author.username === loggedInUser.username;

// Views
const ArticleActions = ({ state }) => {
  const canModify = canModifySelector(state.author)(state.user);
  return canModify
    ? html`
        <span>
          <a data-test="edit" href=${editor(state.slug)} class="btn btn-outline-secondary btn-sm">
            <i class="ion-edit" /> Edit Article
          </a>

          <button data-test="delete" class="btn btn-outline-danger btn-sm" onclick=${SubmitDeleteArticle}>
            <i class="ion-trash-a" /> Delete Article
          </button>
        </span>
      `
    : html` <span /> `;
};

const ArticleMeta = ({ state }) => html`
  <div class="article-meta">
    <a href=${profile(state.author.username)}>
      <img data-test="avatar" src=${state.author.image} />
    </a>

    <div class="info">
      <a data-test="author" href=${profile(state.author.username)} class="author">
        ${state.author.username}
      </a>
      <span data-test="date" class="date">${format(state.createdAt)}</span>
    </div>

    ${ArticleActions({ state })}
  </div>
`;

const ArticleBanner = ({ state }) =>
  html`
    <div class="banner">
      <div class="container">
        <h1 data-test="title">${state.title}</h1>
        ${ArticleMeta({ state })}
      </div>
    </div>
  `;

const CommentInput = ({ state }) => html`
  <form class="card comment-form" onsubmit=${(_, event) => {event.preventDefault(); return SubmitComment}}>
    <div class="card-block">
      <textarea
        class="form-control"
        placeholder="Write a comment..."
        data-test="commentInput"
        value=${state.commentText}
        oninput=${(state, event) => ({...state, commentText: event.target.value})}
        rows="3"
      />
    </div>
    <div class="card-footer">
      ${state.user.image
        ? html`<img src=${state.user.image} class="comment-author-img" alt=${state.user.username} />`
        : ""}
      <button class="btn btn-sm btn-primary" type="submit">
        Post Comment
      </button>
    </div>
  </form>
`;

const DeleteButton = ({ comment, user }) => {
  const canModify = canModifySelector(comment.author)(user);
  return canModify
    ? html`
        <span class="mod-options">
          <i data-test="deleteComment" class="ion-trash-a" onclick=${SubmitDeleteComment(comment.id)} />
        </span>
      `
    : "";
};

const Comment = ({ comment, slug, user }) =>
  html`
    <div class="card" data-test="comment">
      <div class="card-block">
        <p data-test="commentText" class="card-text">${comment.body}</p>
      </div>
      <div class="card-footer">
        <a data-test="commentAuthor" href=${profile(comment.author.username)} class="comment-author">
          <img src=${comment.author.image} class="comment-author-img" alt=${comment.author.username} />
        </a>
        ${" "}
        <a href=${profile(comment.author.username)} class="comment-author">
          ${comment.author.username}
        </a>
        <span class="date-posted">${format(comment.createdAt)}</span>
        ${DeleteButton({ comment, slug, user })}
      </div>
    </div>
  `;

const CommentList = ({ comments, user, slug }) => {
  return html`
    <div>
      ${comments.map((comment) => Comment({ comment, slug, user }))}
    </div>
  `;
};

const CommentContainer = ({ state }) => html`
  <div class="col-xs-12 col-md-8 offset-md-2">
    ${state.user.token
      ? html`
          <div>
            ${CommentInput({ state })}
          </div>
        `
      : html`
          <p data-test="authPrompt">
            <a href=${LOGIN}>Sign in </a>
            or
            <a href=${REGISTER}> sign up </a>
            to add comments on this article.
          </p>
        `}
    ${CommentList({
      comments: state.comments,
      user: state.user,
      slug: state.slug,
    })}
  </div>
`;

export const ArticlePage = (state) =>
  state.title
    ? html`
        <div class="article-page">
          ${ArticleBanner({ state })}

          <div class="container page">
            <div class="row article-content">
              <div class="col-xs-12">
                <div data-test="markdown" innerHTML=${markdown(state.body)} />

                <ul class="tag-list">
                  ${state.tagList.map(
                    (tag) => html`
                      <li data-test="tag" class="tag-default tag-pill tag-outline">
                        ${tag}
                      </li>
                    `
                  )}
                </ul>
              </div>
            </div>

            <hr />

            <div class="article-actions" />

            <div class="row">
              ${CommentContainer({ state })}
            </div>
          </div>
        </div>
      `
    : "";
