describe("new article", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/#!/editor");
  });

  const tags = () => cy.get(".tag-pill");
  const assertTagCount = x => tags().should("have.length", x);
  const publishArticle = () => cy.contains("Publish Article").click();
  const deleteTag = name => cy.contains(name).find("i").click();

  it("create new article", () => {
    cy.typeIntoField("title", "JS microlibs");
    cy.typeIntoField("description", "This is article about using microlibs");
    cy.typeIntoField("body", "# Title{enter}## Header{enter}Avoid bloated JS frameworks");
    cy.typeIntoField("tags", "javascript{enter}mistake{enter}frameworks{enter}");
    assertTagCount(3);
    deleteTag("mistake");
    assertTagCount(2);
    publishArticle();
    cy.assertAtHomePage();
  });

});