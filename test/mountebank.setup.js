const { exec, execSync } = require("child_process");
const waitOn = require('wait-on');
const normalize = s => s.replace(/[^a-z0-9]/gi, "_");

before(function() {
  console.log("Starting mountebank");
  exec("mb start");
});

beforeEach(async function() {
  await waitOn({resources: ['http://localhost:2525/']});
  console.log("Mountebank ready");
  await exec('curl -X "DELETE" http://localhost:2525/imposters');
  console.log("Deleted old imposters");
  await exec("curl -d@mountebank.json http://localhost:2525/imposters");
  console.log("Mountebank proxy configured");
});

afterEach(async function() {
  await exec(
    `mb save --savefile stubs/"${normalize(
      this.currentTest.title
    )}".json --removeProxies`
  );
  console.log("Saving stubs");
});

after(async function() {
  console.log("Stopping mountebank");
  await exec("mb stop");
});



// const mode = Cypress.env("mode");
//
// beforeEach(function() {
//   // do it in before so that we can debug after the test runs
//   // debug URL: http://localhost:2525/imposters
//   if(mode == "record" || mode == "stub") {
//     cy.exec('curl -X "DELETE" http://localhost:2525/imposters');
//     cy.on("window:before:load", win => {
//       win.apiUrl = Cypress.env("apiUrl");
//     });
//   }
//
//   if (mode === "record") {
//     cy.exec(
//       "curl -d@cypress/support/mountebank.json http://localhost:2525/imposters"
//     );
//   } else if (mode === "stub") {
//     cy.exec(
//       `curl -X "PUT" -d@cypress/support/stubs/"${normalize(
//         this.currentTest.title
//       )}".json http://localhost:2525/imposters`
//     );
//   }
//
// });
//
// afterEach(function() {
//   if (mode === "record") {
//     cy.exec(
//       `mb save --savefile cypress/support/stubs/"${normalize(
//         this.currentTest.title
//       )}".json --removeProxies`
//     );
//   }
// });
