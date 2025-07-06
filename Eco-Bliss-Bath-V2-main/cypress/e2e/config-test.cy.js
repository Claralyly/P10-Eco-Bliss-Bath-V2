describe("Vérification de la configuration Cypress", () => {
  it("Vérifie que apiUrl est bien défini", () => {
    expect(Cypress.env("apiUrl")).to.eq("http://localhost:8081");
  console.log("apiUrl =", Cypress.env("apiUrl"));

  });
});
