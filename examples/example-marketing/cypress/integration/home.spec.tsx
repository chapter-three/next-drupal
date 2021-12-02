/// <reference types="cypress"/>

context("Home", () => {
  beforeEach(() => {
    cy.visit("")
  })

  it("should render paragraphs", () => {
    cy.get("[data-cy=paragraph-hero] h1").contains("Build Something Amazing")
    cy.get("[data-cy=paragraph-hero] p").contains(
      "Must today firm from bag. Investment try cold a when capital. Everything wait person service."
    )
    cy.get("[data-cy=paragraph-hero] [alt=Hero]").should("be.visible")

    cy.get("[data-cy=paragraph-feature] h2").contains("Marketing Strategy")
    cy.get("[data-cy=paragraph-feature] img[alt=Feature]").should("be.visible")

    cy.get("[data-cy=paragraph-faq] h2").contains("Frequently Asked Questions")
    cy.get("[data-cy=paragraph-faq] h3").contains(
      "Move weight here just either attorney?"
    )
  })

  it("should render menu items", () => {
    cy.get("[data-cy=navbar-menu] a").contains("Home")
    cy.get("[data-cy=navbar-menu] a").contains("Blog")
    cy.get("[data-cy=navbar-menu] a").contains("Properties")
    cy.get("[data-cy=navbar-menu] a").contains("About")
    cy.get("[data-cy=navbar-menu] a").contains("GitHub")
  })
})

context("Translation", () => {
  beforeEach(() => {
    cy.visit("/es")
  })

  it("should render paragraphs", () => {
    cy.get("[data-cy=paragraph-hero] h1").contains("Construye Algo Asombroso")
    cy.get("[data-cy=paragraph-hero] p").contains(
      "Dicta laboriosam magnam possimus ad. Ratione rem nihil nostrum dolore reiciendis enim."
    )
    cy.get("[data-cy=paragraph-hero] img[alt=Hero]").should("be.visible")

    cy.get("[data-cy=paragraph-feature] h2").contains("Marketing Strategy")
    cy.get("[data-cy=paragraph-feature] img[alt=Feature]").should("be.visible")

    cy.get("[data-cy=paragraph-faq] h2").contains("Frequently Asked Questions")
    cy.get("[data-cy=paragraph-faq] h3").contains(
      "Move weight here just either attorney?"
    )
  })

  it("should render menu items localized", () => {
    cy.get("[data-cy=navbar-menu] a").contains("Inicio")
    cy.get("[data-cy=navbar-menu] a").contains("Blog")
    cy.get("[data-cy=navbar-menu] a").contains("Propiedades")
    cy.get("[data-cy=navbar-menu] a").contains("Acerca")
    cy.get("[data-cy=navbar-menu] a").contains("GitHub")
  })
})

export {}
