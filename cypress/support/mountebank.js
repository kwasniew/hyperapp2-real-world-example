const normalize = s => s.replace(/[^a-z0-9]/gi, "_");

const mode = Cypress.env("MODE");

beforeEach(function() {
  // do it in before so that we can debug after the test runs
  // debug URL: http://localhost:2525/imposters
  cy.exec('curl -X "DELETE" http://localhost:2525/imposters');
  if (mode === "record") {
    cy.exec(
      "curl -d@cypress/support/mountebank.json http://localhost:2525/imposters"
    );
  } else if (mode === "stub") {
    cy.exec(
      `curl -X "PUT" -d@cypress/support/stubs/"${normalize(
        this.currentTest.title
      )}".json http://localhost:2525/imposters`
    );
  }

  // cy.on("window:before:load", e => {
  //   console.log(" before load ");
  //   window.API_ROOT = "http://localhost:3000/api";
  // });
  // cy.log("I run before every test in every spec file!!!!!!");
});

afterEach(function() {
  if (mode === "record") {
    cy.exec(
      `mb save --savefile cypress/support/stubs/"${normalize(
        this.currentTest.title
      )}".json --removeProxies`
    );
  }
});
