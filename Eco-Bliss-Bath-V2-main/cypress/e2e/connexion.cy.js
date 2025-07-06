describe("UI - Connexion utilisateur", () => {
  const baseUrl = "http://localhost:4200";

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.contains("Connexion").click();
    cy.url().should("include", "/login");
  });

  it("devrait connecter l’utilisateur avec des identifiants valides", () => {
    cy.get('input[formcontrolname="username"]').type("test2@test.fr");
    cy.get('input[formcontrolname="password"]').type("testtest");
    cy.contains("button", "Se connecter").click();

    cy.contains("Mon panier").should("be.visible");
  });

  it("ne doit pas connecter l’utilisateur avec un mauvais identifiant", () => {
    cy.get('input[formcontrolname="username"]').type("fake@test.fr");
    cy.get('input[formcontrolname="password"]').type("wrongpass");
    cy.contains("button", "Se connecter").click();

    cy.contains("Mon panier").should("not.exist");
    cy.contains("Identifiants incorrects").should("be.visible");
  });

  it("ne doit pas connecter l’utilisateur sans identifiants", () => {
    cy.contains("button", "Se connecter").click();

    cy.contains("Merci de remplir correctement tous les champs").should("be.visible");
    cy.contains("Mon panier").should("not.exist");
  });
});
