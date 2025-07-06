describe("Smoke Tests - Vérifications essentielles", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("frontendUrl") || "http://localhost:4200");
    cy.log("Page visitée !");
  });

  it("Vérifie la présence des champs et boutons de connexion", () => {
    cy.getBySel("nav-link-login").click();
    cy.log("Accès à la page de connexion");
    cy.get('input[formcontrolname="username"]').should("exist").and("be.visible");
    cy.get('input[formcontrolname="password"]').should("exist").and("be.visible");
    cy.contains("button", "Se connecter").should("exist").and("be.visible");
  });

  it("Vérifie la présence du bouton Ajouter au panier après connexion", () => {
    cy.userLogin();
    cy.log("Connexion réussie");
    cy.getBySel("nav-link-products").click();
    cy.log("Accès à la liste des produits");
    cy.getBySel("product-link").eq(0).click();
    cy.log("Produit sélectionné");
    cy.getBySel("detail-product-add").should("exist").and("be.visible");
  });

  it("Vérifie la présence du champ de disponibilité du produit", () => {
    cy.getBySel("nav-link-products").click();
    cy.log("Accès aux produits");
    cy.getBySel("product-link").eq(0).click();
    cy.log("Produit sélectionné");
    cy.getBySel("detail-product-stock").should("exist").and("be.visible");
  });
});

  