// Fonction utilitaire pour exécuter des requêtes avec authentification
function requestWithAuth(method, url, body = {}) {
    return cy.request({
      method: method,
      url: url,
      headers: { Authorization: "Bearer " + Cypress.env("token") },
      body: body,
      failOnStatusCode: false
    });
  }
  
  // Tests de l’API commandes sans authentification
  describe("API - Commandes sans authentification", () => {
    it("doit retourner 401 lorsqu'on accède aux commandes sans être connecté", () => {
      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        failOnStatusCode: false 
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
  
  // Tests API avec authentification
  describe("API - Commandes avec authentification", () => {
    let productId = 7; // Produit à tester
  
    before(() => {
      cy.request("POST", "http://localhost:8081/login", {
        username: "test2@test.fr",
        password: "testtest"
      }).then((response) => {
        Cypress.env("token", response.body.token);
      });
    });
  
    it("doit retourner la liste des produits dans le panier", () => {
      requestWithAuth("GET", "http://localhost:8081/orders").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.exist;
      });
    });
  
    it("Ajoute un produit disponible au panier", () => {
      requestWithAuth("PUT", "http://localhost:8081/orders/add", { product: productId, quantity: 1 })
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });
  
    it("ne doit pas permettre l’ajout d’un produit en rupture de stock", () => {
      requestWithAuth("PUT", "http://localhost:8081/orders/add", { product: 99, quantity: 1 })
        .then((response) => {
          expect(response.status).to.eq(400);
        });
    });
  });
  
  // Test de récupération d’un produit par ID
  describe("API - Produits", () => {
    let productId = 7; // On teste un autre produit
  
    it("doit retourner les détails d’un produit par ID", () => {
      cy.request("GET", `http://localhost:8081/products/${productId}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id", productId);
        expect(response.body).to.have.property("name");
        expect(response.body).to.have.property("price").and.be.a("number");
        expect(response.body).to.have.property("availableStock").and.be.greaterThan(0);
      });
    });
  });
  
  // Test sur l'ajout d’un avis
  describe("API - Avis", () => {
    before(() => {
      cy.request("POST", "http://localhost:8081/login", {
        username: "test2@test.fr",
        password: "testtest"
      }).then((response) => {
        Cypress.env("token", response.body.token);
      });
    });
  
    it("Ajoute un avis sur un produit", () => {
      requestWithAuth("POST", "http://localhost:8081/reviews", {
        title: "Super produit",
        comment: "J’adore !",
        rating: 5
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
  