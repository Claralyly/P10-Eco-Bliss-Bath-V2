describe("Tests de sécurité - Injection XSS", () => {
  const apiUrl = "http://localhost:8081";
  const frontendUrl = "http://localhost:4200";
  let token;

  const xssPayloads = [
    { type: "avis", url: "/reviews", body: { title: "XSS", comment: `<script>alert('XSS')</script>`, rating: 5 } },
    { type: "produit", url: "/products", body: { name: `<img src=x onerror=alert('XSS')>`, price: 20, availableStock: 5 } },
    { type: "utilisateur", url: "/register", body: { username: `<script>alert('XSS')</script>`, email: "xss@test.com", password: "securepassword" } }
  ];

  before(() => {
    cy.request("POST", `${apiUrl}/login`, {
      username: "test2@test.fr",
      password: "testtest"
    }).then((response) => {
      token = response.body.token;
      Cypress.env("token", token);
    });
  });

  xssPayloads.forEach((payload) => {
    it(`Ne doit pas accepter du code XSS dans le champ ${payload.type}`, () => {
      const headers = payload.type !== "utilisateur" ? { Authorization: "Bearer " + token } : {};

      cy.request({
        method: "POST",
        url: `${apiUrl}${payload.url}`,
        headers,
        body: payload.body,
        failOnStatusCode: false
      }).then((response) => {
        const payloadString = Object.values(payload.body).join(" ");
        const isVulnerable = response.status === 200 && JSON.stringify(response.body).includes("<script");

        if (isVulnerable) {
          cy.log(`⚠️ Vulnérabilité XSS détectée dans ${payload.type}`);
        } else {
          cy.log(`✅ Pas de XSS détecté dans ${payload.type}`);
        }

        expect(isVulnerable, `⚠️ L'API ${payload.type} accepte du code XSS`).to.be.false;
      });
    });
  });

  it("Vérifie que les pages ne rendent pas du code XSS dans le DOM", () => {
    cy.visit(`${frontendUrl}/#/products`);

    cy.document().its("documentElement.innerHTML").should((html) => {
      const hasScript = html.includes("<script>alert('XSS')</script>") || html.includes("onerror=alert('XSS')");
      if (hasScript) {
        cy.log("⚠️ Code XSS détecté dans le DOM !");
      } else {
        cy.log("✅ Aucun code XSS détecté dans le DOM");
      }
      expect(hasScript, "⚠️ Le DOM contient du code XSS").to.be.false;
    });
  });
});

