// 🔎 Sélection d’un élément par attribut `data-cy`
Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
});

// 🔑 Connexion via l’interface utilisateur
Cypress.Commands.add("userLogin", () => {
  cy.visit(Cypress.env("frontendUrl") || "http://localhost:4200");
  cy.getBySel("nav-link-login").click();
  cy.get('input[formcontrolname="username"]').type("test2@test.fr");
  cy.get('input[formcontrolname="password"]').type("testtest");
  cy.contains("button", "Se connecter").click();
  cy.getBySel("nav-link-cart").should("be.visible");
});

// 🗑️ Supprime le premier produit du panier (UI)
Cypress.Commands.add("deleteFirstCartItem", () => {
  cy.get("body").then(($body) => {
    const deleteIcon = $body.find("img[src*='trash'], img[src*='delete']");

    if (deleteIcon.length > 0) {
      cy.wrap(deleteIcon).first().click();
    } else {
      throw new Error("❌ Aucun icône de suppression trouvé dans le panier");
    }
  });
});

// 🔐 Connexion API
Cypress.Commands.add("signIn", (username, password) => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl") || "http://localhost:8081"}/login`,
    body: { username, password }
  }).then((response) => {
    Cypress.env("token", response.body.token);
    return response.body.token;
  });
});

// 📦 Récupérer un produit disponible
Cypress.Commands.add("getAvailableProduct", () => {
  return cy.request("GET", `${Cypress.env("apiUrl") || "http://localhost:8081"}/products`)
    .then((response) => {
      const produit = response.body.find(p => p.availableStock > 0);
      expect(produit, "Produit disponible trouvé").to.exist;
      return produit;
    });
});

// 🛒 Ajouter un produit au panier
Cypress.Commands.add("addProductToCartAPI", (productId, quantity = 1) => {
  return cy.request({
    method: "PUT",
    url: `${Cypress.env("apiUrl") || "http://localhost:8081"}/orders/add`,
    headers: { Authorization: "Bearer " + Cypress.env("token") },
    body: { product: productId, quantity }
  });
});

// 🔁 Modifier la quantité
Cypress.Commands.add("updateCartQuantityAPI", (orderLineId, quantity) => {
  return cy.request({
    method: "PUT",
    url: `${Cypress.env("apiUrl") || "http://localhost:8081"}/orders/${orderLineId}/change-quantity`,
    headers: { Authorization: "Bearer " + Cypress.env("token") },
    body: { quantity }
  });
});

// 🗑️ Supprimer un produit du panier
Cypress.Commands.add("removeProductFromCartAPI", (orderLineId) => {
  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("apiUrl") || "http://localhost:8081"}/orders/${orderLineId}/delete`,
    headers: { Authorization: "Bearer " + Cypress.env("token") }
  });
});

// 📥 Récupérer le panier
Cypress.Commands.add("getCartAPI", () => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl") || "http://localhost:8081"}/orders`,
    headers: { Authorization: "Bearer " + Cypress.env("token") }
  });
});

// 🧹 Supprimer toutes les lignes du panier (optionnel)
Cypress.Commands.add("clearCartCompletely", () => {
  return cy.getCartAPI().then((response) => {
    const lines = response.body.orderLines || [];
    return Cypress.Promise.all(
      lines.map(line =>
        cy.removeProductFromCartAPI(line.id)
      )
    );
  });
});


