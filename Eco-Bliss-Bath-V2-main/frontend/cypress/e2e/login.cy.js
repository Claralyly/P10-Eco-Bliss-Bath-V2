describe("API - Connexion utilisateur", () => {
    it("doit permettre la connexion avec des identifiants valides", () => {
      cy.request("POST", "http://localhost:8081/login", {
        username: "test2@test.fr",
        password: "testtest"
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("token").and.be.a("string");
        Cypress.env("token", response.body.token); // Stocke le token pour les prochains tests
      });
    });
  
    it("doit refuser la connexion avec un utilisateur inconnu", () => {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        failOnStatusCode: false,
        body: {
          username: "fakeuser@test.fr",
          password: "wrongpass"
        }
      }).then((response) => {
        expect(response.status).to.eq(401); // Erreur attendue : utilisateur inconnu
      });
    });
  
    it("ne doit pas permettre la connexion sans mot de passe", () => {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        failOnStatusCode: false,
        body: {
          username: "test2@test.fr"
        }
      }).then((response) => {
        expect(response.status).to.eq(400); // Erreur attendue : champ manquant
      });
    });
  });
  