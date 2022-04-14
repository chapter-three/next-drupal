/// <reference types="cypress"/>
context("Custom formatter", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should show data from fieldImage", () => {
    cy.get("[data-cy=image]").should("not.be.empty")
  })
})

export {}
