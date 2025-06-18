describe("Smoke Tests - Vérifications essentielles", () => {

    beforeEach(() => {
      cy.visit("http://localhost:8081");
      cy.log("Page visitée !");
    });
  
    it("Vérifie la présence des champs et boutons de connexion", () => {
      cy.getBySel("nav-link-login").click();
      cy.log("Accès à la page de connexion");
      cy.getBySel("login-input-username").should("exist").and("be.visible");
      cy.getBySel("login-input-password").should("exist").and("be.visible");
      cy.getBySel("login-submit").should("exist").and("be.visible");
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
  
  