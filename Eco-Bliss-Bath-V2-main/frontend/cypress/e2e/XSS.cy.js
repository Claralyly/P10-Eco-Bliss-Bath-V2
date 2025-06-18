describe("API - Tests de sécurité XSS", () => {
    let productId = 7; // ID du produit utilisé pour les tests
  
    before(() => {
      cy.request("POST", "http://localhost:8081/login", {
        username: "test2@test.fr",
        password: "testtest"
      }).then((response) => {
        Cypress.env("token", response.body.token);
      });
    });
  
    // Test d’injection XSS dans un avis produit
    it("Ne doit pas accepter du code HTML ou JavaScript dans les avis", () => {
      const xssPayload = `<script>alert('XSS')</script>`;
  
      cy.request({
        method: "POST",
        url: "http://localhost:8081/reviews",
        headers: { Authorization: "Bearer " + Cypress.env("token") },
        body: {
          title: "Avis Test",
          comment: xssPayload, // Injection XSS
          rating: 5
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.eq(200); // Vérifie que l’injection est bloquée
        expect(response.body).to.not.contain(xssPayload); // Vérifie que le texte XSS n’est pas stocké
      });
    });
  
    // Test d’injection XSS dans un champ produit
    it("Ne doit pas accepter du code malveillant dans un champ produit", () => {
      const xssPayload = `<img src=x onerror=alert('XSS')>`;
  
      cy.request({
        method: "POST",
        url: "http://localhost:8081/products",
        headers: { Authorization: "Bearer " + Cypress.env("token") },
        body: {
          name: xssPayload,
          price: 20,
          availableStock: 5
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.eq(200); // Vérifie que l’injection est bloquée
        expect(response.body).to.not.contain(xssPayload); // Vérifie que le texte XSS n’est pas enregistré
      });
    });
  
    // Test d’injection XSS dans un champ utilisateur
    it("Ne doit pas accepter du code malveillant dans les informations utilisateur", () => {
      const xssPayload = `<script>alert('XSS')</script>`;
  
      cy.request({
        method: "POST",
        url: "http://localhost:8081/register",
        body: {
          username: xssPayload,
          email: "xss@test.com",
          password: "securepassword"
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.eq(200); // L'application doit refuser l'inscription avec XSS
        expect(response.body).to.not.contain(xssPayload); // Vérification que l’injection n’est pas sauvegardée
      });
    });
  
    // Vérification que les pages empêchent le rendu XSS
    it("Vérifie que les pages ne rendent pas du code XSS", () => {
      cy.visit("http://localhost:8081/products"); // Accès à la page des produits
  
      cy.document().its("documentElement.innerHTML").should((html) => {
        expect(html).to.not.contain(`<script>alert('XSS')</script>`); // Vérifie que le code XSS n’est pas exécuté
      });
    });
  });
  