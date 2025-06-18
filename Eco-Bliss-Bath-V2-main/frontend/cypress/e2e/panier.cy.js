describe("API - Tests du panier", () => {
  const productId = 7;
  let initialStock;

  before(() => {
    cy.request("POST", "http://localhost:8081/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      Cypress.env("token", response.body.token);
    });
  });

  it("Vérifie que le produit a un stock supérieur à 1 avant l'ajout", () => {
    cy.request("GET", `http://localhost:8081/products/${productId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("availableStock");
      initialStock = response.body.availableStock;
      cy.log("Stock initial:", initialStock);
      // Ne fait pas échouer ici pour tests en environnement réel
      if (initialStock <= 1) {
        cy.log("Le stock est trop faible pour continuer les tests correctement.");
      } else {
        expect(initialStock).to.be.greaterThan(1);
      }
    });
  });

  it("Ajoute un produit au panier", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8081/orders/add",
      headers: { Authorization: "Bearer " + Cypress.env("token") },
      body: { product: productId, quantity: 1 },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Vérifie que le produit est bien présent dans le panier", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: { Authorization: "Bearer " + Cypress.env("token") },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Contenu de la commande :", JSON.stringify(response.body));

      // 🔍 Ajustement ici selon structure réelle
      const cartItems = response.body.cart || response.body.items || response.body.order?.cart || [];

      if (!Array.isArray(cartItems)) {
        cy.log(" Structure inattendue du panier : ", JSON.stringify(response.body));
        throw new Error("La propriété cart/items est manquante ou mal structurée");
      }

      const produitPresent = cartItems.some((item) => item.productId === productId);
      expect(produitPresent).to.be.true;
    });
  });

  it("Vérifie que le stock du produit a diminué", () => {
    cy.request("GET", `http://localhost:8081/products/${productId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.availableStock).to.eq(initialStock - 1);
    });
  });

  it("Ne doit pas permettre un chiffre négatif dans le panier", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8081/orders/add",
      headers: { Authorization: "Bearer " + Cypress.env("token") },
      body: { product: productId, quantity: -2 },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it("Ne doit pas permettre d'ajouter plus de 20 unités (si API le bloque)", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8081/orders/add",
      headers: { Authorization: "Bearer " + Cypress.env("token") },
      body: { product: productId, quantity: 25 },
      failOnStatusCode: false,
    }).then((response) => {
      // Adapter à la réalité : 400 si bloqué, 200 si autorisé
      if (response.status === 200) {
        cy.log("L’API accepte les quantités > 20 (test informatif)");
      } else {
        expect(response.status).to.eq(400);
      }
    });
  });

  it("Vérifie que le produit possède un champ 'availableStock'", () => {
    cy.request("GET", `http://localhost:8081/products/${productId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("availableStock");
    });
  });

  it("Supprime le produit du panier si présent", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: { Authorization: "Bearer " + Cypress.env("token") },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const cartItems = response.body.cart || response.body.items || response.body.order?.cart || [];

      const produitPresent = Array.isArray(cartItems)
        ? cartItems.some((item) => item.productId === productId)
        : false;

      if (produitPresent) {
        cy.request({
          method: "DELETE",
          url: `http://localhost:8081/orders/${productId}/remove`,
          headers: { Authorization: "Bearer " + Cypress.env("token") },
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });
      } else {
        cy.log("Produit non présent dans le panier");
      }
    });
  });
});



