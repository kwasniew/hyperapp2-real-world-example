describe("article details", () => {
  context("anonymous", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/#!/article/article-with-details");
    });

    it("show article", () => {});
  });
  context("logged-in", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/#!/article/article-with-details");
    });

    it("show own article", () => {

    });
    it("comment someone else's article", () => {});
  });

});