/// <reference types="cypress" />

// 🔐 Connexion via API et récupération du token
Cypress.Commands.add("signIn", (username, password) => {
    return cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/login`,
      body: { username, password }
    }).then((response) => {
      Cypress.env("token", response.body.token);
      return response.body.token;
    });
  });
  
  // 🔎 Sélection d’un élément par attribut `data-cy`
  Cypress.Commands.add("getBySel", (selector, ...args) => {
    return cy.get(`[data-cy=${selector}]`, ...args);
  });
  
  // 🔑 Connexion utilisateur via interface UI
  Cypress.Commands.add("userLogin", () => {
    cy.visit(Cypress.env("frontendUrl")); // URL dynamique du frontend
    cy.getBySel("nav-link-login").click();
    cy.getBySel("login-input-username").type("test2@test.fr");
    cy.getBySel("login-input-password").type("testtest");
    cy.getBySel("login-submit").click();
    cy.getBySel("nav-link-cart").should("be.visible");
  });
  
  // 🛒 Ajout d’un produit au panier (interface)
  Cypress.Commands.add("addProductToCart", (productIndex = 4) => {
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product-link").eq(productIndex).click();
    cy.getBySel("detail-product-add").click();
    cy.getBySel("nav-link-cart").should("be.visible");
  });
  
  // 🛒 Ajout d’un produit au panier (API)
  Cypress.Commands.add("addProductToCartAPI", (productId, quantity = 1) => {
    return cy.request({
      method: "PUT",
      url: `${Cypress.env("apiUrl")}/orders/add`,
      headers: { Authorization: "Bearer " + Cypress.env("token") },
      body: { product: productId, quantity }
    });
  });
  
  // 🗑️ Suppression d’un produit du panier (UI)
  Cypress.Commands.add("clearCart", () => {
    cy.getBySel("nav-link-cart").click();
    cy.getBySel("cart-line-delete").should("be.visible").click({ multiple: true });
    cy.getBySel("cart-empty").should("be.visible");
  });
  
  // 🗑️ Suppression d’un produit du panier (API)
  Cypress.Commands.add("removeProductFromCartAPI", (productId) => {
    return cy.request({
      method: "DELETE",
      url: `${Cypress.env("apiUrl")}/orders/${productId}/remove`,
      headers: { Authorization: "Bearer " + Cypress.env("token") }
    });
  });
  
  // 📝 Ajout d’un avis produit (API)
  Cypress.Commands.add("addReview", (title, comment, rating) => {
    return cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/reviews`,
      headers: { Authorization: "Bearer " + Cypress.env("token") },
      body: { title, comment, rating }
    });
  });
  
  // 🔎 Récupération des avis produits
  Cypress.Commands.add("getReviews", () => {
    return cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/reviews`
    });
  });
  