const apiUrl = Cypress.env("apiUrl");

Cypress.Commands.add("login", (user = Cypress.env("user")) =>
  cy
    .request("POST", `${apiUrl}/users/login`, {
      user: Cypress._.pick(user, ["email", "password"])
    })
    .its("body.user")
    .should("exist")
    .then(user => {
      localStorage.setItem("session", JSON.stringify(user));
      // with this user set, when we visit the page
      // the web application will have the user logged in
    })
);
Cypress.Commands.add("fastLogin", (user = Cypress.env("user")) =>
  cy.wrap(user).then(user => {
    localStorage.setItem("session", JSON.stringify(user));
    // with this user set, when we visit the page
    // the web application will have the user logged in
  })
);

Cypress.Commands.add("register", user =>
  cy
    .request({
      method: "POST",
      url: `${apiUrl}/users`,
      body: {
        user
      },
      failOnStatusCode: false
    })
    .its("body.user")
    .should("exist")
    .then(user => {
      localStorage.setItem("session", JSON.stringify(user));
      // with this user set, when we visit the page
      // the web application will have the user logged in
    })
);

Cypress.Commands.add("hasError", message =>
  cy.get(".error-messages").should("contain", message)
);

Cypress.Commands.add("typeIntoField", (name, text) =>
  cy.element(name).type(text)
);

Cypress.Commands.add("typeIntoClearField", (name, text) =>
  cy
    .element(name)
    .clear()
    .type(text)
);

Cypress.Commands.add("assertAtHomePage", () => cy.hash().should("be.empty"));

Cypress.Commands.add("element", name => cy.get(`[data-test=${name}]`));
Cypress.Commands.add("elementContains", (name, value) =>
  cy.contains(`[data-test=${name}]`, value)
);

// because typing long text is slow and causes weird issues with lost characters in SPA frameworks
Cypress.Commands.add(
  "fill",
  {
    prevSubject: "element"
  },
  (subject, value) => {
    cy.wrap(subject)
      .invoke("val", value)
      .trigger("input")
      .trigger("change");
  }
);
Cypress.Commands.add("fillInField", (name, text) => {
  cy.element(name).fill(text);
});

const feed = feedName => cy.elementContains("feed", feedName);
const assertFeedActive = feedName =>
  feed(feedName).should("have.class", "active");
const assertFeedInactive = feedName =>
  feed(feedName).should("not.have.class", "active");
const assertFeeds = (...feeds) => {
  cy.element("feed").should("have.length", feeds.length);
  feeds.map(feed => {
    Array.isArray(feed) ? assertFeedActive(feed[0]) : assertFeedInactive(feed);
  });
};
Cypress.Commands.add("assertFeeds", assertFeeds);

Cypress.Commands.add("record", testTitle => {
  cy.server({
    onRequest: request => {
      // console.log(request);
    },
    onResponse: response => {
      console.log({
        method: response.method,
        url: response.url,
        status: response.status,
        response: response.responseBody
      });

      const url = new URL(response.url);
      const pathname = decodeURIComponent(url.pathname + url.search);
      const hyphened = pathname.replace(/\//g, "-");
      const fileName = `${response.method}${hyphened}-${response.status}`;

      const code = `cy.route({
        method: "${response.method}",
        url: "${response.url}",
        status: ${response.status},
        response: "fixture:generated/${fileName}.json"
      })\n`;

      cy.now("writeFile", `cypress/fixtures/commands/${testTitle}.js`, code, {
        flag: "a+"
      });
      cy.now(
        "writeFile",
        `cypress/fixtures/generated/${testTitle + "-" + fileName}.json`,
        response.responseBody
      );
    }
  });
  cy.route("**");
});
