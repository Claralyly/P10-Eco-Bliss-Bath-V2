describe("API - Panier", () => {
  const apiUrl = "http://localhost:8081";
  let productId;
  let orderLineId;

  // 🔐 Connexion et récupération d’un produit disponible
  before(() => {
    cy.signIn("test2@test.fr", "testtest").then(() => {
      cy.getAvailableProduct().then((produit) => {
        productId = produit.id;
      });
    });
  });

  // 🛒 Ajout d’un produit au panier
  it("Ajoute un produit au panier et vérifie sa présence", () => {
    cy.addProductToCartAPI(productId, 1).then((response) => {
      expect(response.status).to.eq(200);
      const line = response.body.orderLines.find(l => l.product.id === productId);
      expect(line, "Ligne de commande trouvée").to.exist;
      orderLineId = line.id;
    });
  });

  // 🔁 Modification de la quantité
  it("Modifie la quantité du produit dans le panier", () => {
    cy.updateCartQuantityAPI(orderLineId, 3).then((response) => {
      expect(response.status).to.eq(200);
      const updatedLine = response.body.orderLines.find(l => l.id === orderLineId);
      expect(updatedLine, "Ligne mise à jour trouvée").to.exist;
      expect(updatedLine.quantity).to.eq(3);
    });
  });

  // 🗑️ Suppression du produit
  it("Supprime le produit du panier", () => {
    cy.removeProductFromCartAPI(orderLineId).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  // ✅ Vérifie que la ligne supprimée n’est plus présente
  it("Vérifie que la ligne supprimée n’est plus dans le panier", () => {
    cy.getCartAPI().then((response) => {
      const remaining = response.body.orderLines || [];
      const stillThere = remaining.find(l => l.id === orderLineId);
      expect(stillThere).to.not.exist;
    });
  });
});

