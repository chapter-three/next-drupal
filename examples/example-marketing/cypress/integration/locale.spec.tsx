/// <reference types="cypress"/>

context("Home", () => {
  beforeEach(() => {
    cy.visit("")
  })

  it("should switch locale when clicking on the locale switcher", () => {
    cy.get("[data-cy=local-switcher-en]").contains("en")
    cy.get("[data-cy=local-switcher-es]").contains("es")

    cy.get("[data-cy=paragraph-hero] h1").contains("Build Something Amazing")
    cy.get("[data-cy=local-switcher-es]").click()
    cy.url().should("include", "/es")
    cy.get("[data-cy=paragraph-hero] h1").contains("Construye Algo Asombroso")
  })
})

export {}
