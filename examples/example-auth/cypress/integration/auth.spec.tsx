/// <reference types="cypress"/>

context("About", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should convert inline images to Next.js images", () => {
    cy.get("[name=username]").type("member")
    cy.get("[name=password]").type("member")
    cy.get("[data-cy=btn-submit]").click()

    cy.contains("You are now logged in as First Last (member@example.com)")
    cy.get("[data-cy=btn-logout]").should("be.visible")
  })
})

export {}
