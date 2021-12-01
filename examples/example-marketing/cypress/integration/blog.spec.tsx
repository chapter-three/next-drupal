/// <reference types="cypress"/>

context("Blog", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/blog")
  })

  it("should render articles", () => {
    cy.get("h1").contains("Latest Articles.")
    cy.get("[data-cy=node--article]").should("have.length", 5)

    cy.get("[data-cy=node--article] h2").contains(
      "Dynamic Routing and Static Generation"
    )
    cy.get("[data-cy=node--article] [data-cy=node--meta]").contains(
      "Posted by Arshad"
    )
    cy.get("[data-cy=node--article] [data-cy=node--meta]").contains(
      "June 13, 2021"
    )
  })
})

context("Translation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/es/blog")
  })

  it("should render articles", () => {
    cy.get("h1").contains("Últimas Publicaciones.")
    cy.get("[data-cy=node--article]").should("have.length", 5)

    cy.get("[data-cy=node--article] h2").contains(
      "Enrutamiento dinámico y Generación Estática"
    )
    cy.get("[data-cy=node--article] [data-cy=node--meta]").contains(
      "Posted by Arshad"
    )
    cy.get("[data-cy=node--article] [data-cy=node--meta]").contains(
      "June 14, 2021"
    )
  })
})

export {}
