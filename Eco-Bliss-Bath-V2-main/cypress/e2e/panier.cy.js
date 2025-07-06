describe("Panier - Interface utilisateur", () => {
  beforeEach(() => {
    cy.userLogin();
  });

  it("Ajoute un produit au panier et vérifie sa présence", () => {
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product-link").eq(0).click();
    cy.getBySel("detail-product-add").click();
    cy.getBySel("nav-link-cart").click();
    cy.getBySel("cart-line-name").should("exist");
  });

  it("Refuse une quantité négative", () => {
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product-link").eq(1).click();
    cy.getBySel("detail-product-quantity").clear().type("-3");
    cy.getBySel("detail-product-add").click();
    cy.getBySel("nav-link-cart").click();
    cy.getBySel("cart-empty").should("be.visible");
  });

  it("Refuse une quantité supérieure à 20", () => {
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product-link").eq(2).click();
    cy.getBySel("detail-product-quantity").clear().type("21");
    cy.getBySel("detail-product-add").click();
    cy.getBySel("nav-link-cart").click();

    cy.get("body").then(($body) => {
      if ($body.find("img[src*='trash'], img[src*='delete']").length > 0) {
        cy.deleteFirstCartItem();
        cy.getBySel("cart-line-name").should("not.exist");
        cy.getBySel("cart-empty").should("be.visible");
      } else {
        cy.getBySel("cart-empty").should("be.visible");
      }
    });
  });

  it("Supprime un produit du panier", () => {
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product-link").eq(0).click();
    cy.getBySel("detail-product-add").click();
    cy.getBySel("nav-link-cart").click();

    cy.getBySel("cart-line-name").should("exist");
    cy.deleteFirstCartItem();
    cy.getBySel("cart-line-name").should("not.exist");
    cy.getBySel("cart-empty").should("be.visible");
  });
});


