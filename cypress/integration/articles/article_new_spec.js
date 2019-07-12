describe("new article", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/#!/editor");
  });

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

  it("create new article", () => {
    cy.typeIntoField("title", "JS microlibs");
    cy.typeIntoField("description", "This is article about using microlibs");
    cy.typeIntoField(
      "body",
      "# Title{enter}## Header{enter}Avoid bloated JS frameworks"
    );
    cy.typeIntoField(
      "tags",
      "javascript{enter}mistake{enter}frameworks{enter}"
    );
    assertTags("javascript", "mistake", "frameworks");
    deleteTag("mistake");
    assertTags("javascript", "frameworks");
    publishArticle();
    cy.assertAtHomePage();
  });
});
