let polyfill;

before(() => {
    const polyfillUrl = "https://unpkg.com/whatwg-fetch@3.0.0/dist/fetch.umd.js";
    cy.request(polyfillUrl).then(response => {
        polyfill = response.body;
    });
});

Cypress.on("window:before:load", win => {
    delete win.fetch;
    win.eval(polyfill);
});
