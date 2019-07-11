/// <reference types="Cypress" />

const submit = () =>
  cy
    .get("form")
    .contains("Sign up")
    .click();
const loggedInAs = username => cy.contains("[data-test=profile]", username);
const setupRegisterSuccessFor = username => {
  cy.server();
  const apiUrl = Cypress.env("apiUrl");
  cy.route({
    method: "POST",
    url: `${apiUrl}/users`,
    status: 201,
    response: { user: { token: "validToken", username } }
  });
};

describe("register", () => {
  beforeEach(() => {
    cy.visit("#!/register");
  });

  it("greets with Sign Up and links to login", () => {
    cy.contains("h1", "Sign Up");
    cy.contains("Have an account?").should("have.attr", "href", "/login");
  });

  it("requires username, email, password", () => {
    submit();
    cy.hasError("email can't be blank");
    cy.hasError("password can't be blank");
    cy.hasError(
      "username can't be blank and is too short (minimum is 1 character)"
    );
  });

  it("registers new user", () => {
    const username = "visitor";
    const email = "visitor@email.com";
    const password = "visiting";

    setupRegisterSuccessFor(username);

    cy.typeIntoField("username", username);
    cy.typeIntoField("email", email);
    cy.typeIntoField("password", password);
    submit();

    cy.assertAtHomePage();
    loggedInAs(username).should("be.visible");
  });
});
