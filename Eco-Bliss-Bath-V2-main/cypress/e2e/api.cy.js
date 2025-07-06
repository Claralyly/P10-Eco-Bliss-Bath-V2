// 🔧 Fonction utilitaire pour exécuter des requêtes avec authentification
function requestWithAuth(method, url, body = {}) {
  return cy.request({
    method: method,
    url: url,
    headers: { Authorization: "Bearer " + Cypress.env("token") },
    body: body,
    failOnStatusCode: false
  });
}

// 🔒 Tests de l’API commandes sans authentification
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

// 🔐 Tests API commandes avec authentification
describe("API - Commandes avec authentification", () => {
  const productId = 7; // Produit à tester

  before(() => {
    cy.request("POST", "http://localhost:8081/login", {
      username: "test2@test.fr",
      password: "testtest"
    }).then((response) => {
      expect(response.status).to.eq(200);
      Cypress.env("token", response.body.token);
    });
  });

  it("doit retourner la liste des commandes", () => {
    requestWithAuth("GET", "http://localhost:8081/orders").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
    });
  });

  it("ajoute un produit disponible au panier", () => {
    requestWithAuth("PUT", "http://localhost:8081/orders/add", {
      product: productId,
      quantity: 1
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("ne doit pas permettre l’ajout d’un produit en rupture de stock", () => {
    requestWithAuth("PUT", "http://localhost:8081/orders/add", {
      product: 99, // Produit supposé en rupture
      quantity: 1
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});

// 📦 Test de récupération d’un produit par ID
describe("API - Produits", () => {
  const productId = 7;

  it("doit retourner les détails d’un produit par ID", () => {
    cy.request("GET", `http://localhost:8081/products/${productId}`).then((response) => {
      expect(response.status).to.eq(200);

      const product = response.body;
      expect(product).to.have.property("id", productId);
      expect(product).to.have.property("name").and.to.be.a("string").and.not.to.be.empty;
      expect(product).to.have.property("price").and.to.be.a("number").and.to.be.greaterThan(0);
      expect(product).to.have.property("availableStock").and.to.be.a("number");

      if (product.availableStock < 0) {
        throw new Error(`❌ Stock négatif détecté pour le produit ${product.id} : ${product.availableStock}`);
      }
    });
  });
});

// ⭐ Test sur l'ajout d’un avis
describe("API - Avis", () => {
  before(() => {
    cy.request("POST", "http://localhost:8081/login", {
      username: "test2@test.fr",
      password: "testtest"
    }).then((response) => {
      expect(response.status).to.eq(200);
      Cypress.env("token", response.body.token);
    });
  });

  it("ajoute un avis sur un produit", () => {
    requestWithAuth("POST", "http://localhost:8081/reviews", {
      title: "Super produit",
      comment: "J’adore !",
      rating: 5
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
