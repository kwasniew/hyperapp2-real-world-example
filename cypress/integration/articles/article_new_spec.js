describe("new article", () => {
  const tags = () => cy.get(".tag-pill");
  const assertTags = (...names) => {
    names.map(name => cy.contains(".tag-pill", name));
    return tags().should("have.length", names.length);
  };
  const publishArticle = () => cy.contains("Publish Article").click();
  const deleteTag = name =>
    cy
      .contains(name)
      .find("[data-test=remove-tag]")
      .click();
  const listenToPublishArticle = () => {
    const apiUrl = Cypress.env("apiUrl");
    cy.server();
    cy.route({
      method: "POST",
      url: `${apiUrl}/articles`
    }).as("createArticle");
    cy.route({
      method: "PUT",
      url: `${apiUrl}/articles/*`
    }).as("updateArticle");
  };
  const waitForSlug = alias =>
    cy
      .wait("@createArticle")
      .its("responseBody.article.slug")
      .as(alias);

  const waitForArticleUpdate = slug =>
    cy
      .wait("@updateArticle")
      .its("responseBody.article.slug")
      .should("equal", slug);

  it("create and update article", () => {
    listenToPublishArticle();
    cy.login();
    cy.visit("/#!/editor");

    cy.typeIntoField("title", "JS microlibs");
    cy.typeIntoField("description", "This is article about using microlibs");
    cy.fillInField("body", "# Title\n## Header\nAvoid bloated JS frameworks");
    cy.typeIntoField(
      "tags",
      "javascript{enter}mistake{enter}frameworks{enter}"
    );
    assertTags("javascript", "mistake", "frameworks");
    deleteTag("mistake");
    assertTags("javascript", "frameworks");
    publishArticle();

    waitForSlug("createSlug");
    cy.assertAtHomePage();
    cy.get("@createSlug").then(slug => {
      cy.visit(`/#!/editor/${slug}`);
      cy.reload(); // page.js doesn't reload on hash change

      cy.element("title").should("have.value", "JS microlibs");
      cy.element("description").should(
        "have.value",
        "This is article about using microlibs"
      );
      cy.element("body").should(
        "have.value",
        "# Title\n## Header\nAvoid bloated JS frameworks"
      );
      assertTags("javascript", "frameworks");
      cy.typeIntoClearField("title", "Avoid bloated frameworks");

      publishArticle();
      waitForArticleUpdate(slug);
      cy.assertAtHomePage();
    });
  });
});
