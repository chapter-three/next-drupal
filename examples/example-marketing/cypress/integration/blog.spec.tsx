/// <reference types="cypress"/>

context("Blog", () => {
  beforeEach(() => {
    cy.visit("/blog")
  })

  it("should render articles", () => {
    cy.get("h1").contains("Latest Articles.")
    cy.get("[data-cy=node--article]").should("have.length.gt", 1)

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
    cy.visit("/es/blog")
  })

  it("should render articles", () => {
    cy.get("h1").contains("Últimas Publicaciones.")
    cy.get("[data-cy=node--article]").should("have.length.gt", 1)

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

context("Blog node", () => {
  beforeEach(() => {
    cy.visit("/blog/learn-how-pre-render-pages-using-static-generation-nextjs")
  })

  it("should render article node", () => {
    cy.get("h1").contains(
      "Learn How to Pre-render Pages Using Static Generation with Next.js"
    )
    cy.get("[data-cy=node--article] [data-cy=node--body]").should(
      "not.be.empty"
    )
    cy.get("[data-cy=node--article] [data-cy=node--meta]").contains(
      "Posted by Arshad"
    )
    cy.get("[data-cy=node--article] [data-cy=node--meta]").contains(
      "June 13, 2021"
    )
  })
})

export {}
