const normalize = s => s.replace(/[^a-z0-9]/gi, "_");

const mode = Cypress.env("mode");

beforeEach(function() {
  // do it in before so that we can debug after the test runs
  // debug URL: http://localhost:2525/imposters
  if(mode == "record" || mode == "stub") {
    cy.exec('curl -X "DELETE" http://localhost:2525/imposters');
    cy.on("window:before:load", win => {
      win.apiUrl = Cypress.env("apiUrl");
    });
  }

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
