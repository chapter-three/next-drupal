/// <reference types="cypress"/>
context("Custom fetcher", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should show articles", () => {
    cy.get("[data-cy=article]").should("not.be.empty")
  })
})

export {}
