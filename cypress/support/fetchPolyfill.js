let polyfill;

before(() => {
    // const polyfillUrl = "https://unpkg.com/whatwg-fetch@3.0.0/dist/fetch.umd.js";
    const polyfillUrl = "https://unpkg.com/unfetch@4.1.0/polyfill/index.js";
    cy.request(polyfillUrl).then(response => {
        polyfill = response.body;
    });
});

Cypress.on("window:before:load", win => {
    delete win.fetch;
    win.eval(polyfill);
});
