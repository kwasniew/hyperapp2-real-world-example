/// <reference types="Cypress" />

describe("articles", () => {
  context("anonymous", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("show active global feed only", () => {
      cy.contains("[data-test=feed]", "Global Feed").should(
        "have.class",
        "active"
      );
      cy.get("[data-test=feed]").should("have.length", 1);
    });
  });

  context("logged-in", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/");
    });

    it("show active Your Feed and inactive Global feed", () => {
      cy.contains("[data-test=feed]", "Your Feed").should(
        "have.class",
        "active"
      );
      cy.contains("[data-test=feed]", "Global Feed").should(
        "not.have.class",
        "active"
      );
      cy.get("[data-test=feed]").should("have.length", 2);

      cy.contains("[data-test=feed]", "Global Feed").click();
      cy.contains("[data-test=feed]", "Your Feed").should(
        "not.have.class",
        "active"
      );
      cy.contains("[data-test=feed]", "Global Feed").should(
        "have.class",
        "active"
      );
      cy.get("[data-test=feed]").should("have.length", 2);
    });

    it("toggle tag feed when active", () => {
      cy.get("[data-test=tag]")
        .first()
        .as("firstTag")
        .invoke("text")
        .then(text => {
          cy.get("@firstTag").click();
          cy.get("[data-test=feed]").should("have.length", 3);
          cy.contains("[data-test=feed]", "Global Feed").should(
            "not.have.class",
            "active"
          );
          cy.contains("[data-test=feed]", "Your Feed").should(
            "not.have.class",
            "active"
          );
          cy.contains("[data-test=feed]", text).should("have.class", "active");
        });
    });
  });
});
