describe("new article", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/#!/editor");
  });

  const assertTagCount = x => cy.get(".tag-pill").should("have.length", x);
  const publishArticle = () => cy.contains("Publish Article").click();
  const deleteTag = name => cy.contains(name).find("i").click();
  const typeIntoField = (field, text) => cy.get(`[data-test=${field}]`).type(text);

  it("create new article", () => {
    typeIntoField("title", "JS microlibs");
    typeIntoField("description", "This is article about using microlibs");
    typeIntoField("body", "# Title{enter}## Header{enter}Avoid bloated JS frameworks");
    typeIntoField("tags", "javascript{enter}mistake{enter}frameworks{enter}");
    assertTagCount(3);
    deleteTag("mistake");
    assertTagCount(2);
    publishArticle();
    cy.hash().should("be.empty");
  });

});