describe("Connexion UI", () => {
  it("doit se connecter avec userLogin", () => {
    cy.userLogin();
    cy.getBySel("nav-link-cart").should("be.visible"); // ou adapte ce sélecteur à ton app
  });
});
