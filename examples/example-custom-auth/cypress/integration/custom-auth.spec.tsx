/// <reference types="cypress"/>
context("Custom auth", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("should fetch unpublished nodes using auth", () => {
    cy.get("[data-cy=published-nodes]")
      .invoke("text")
      .then(($unpublished) => {
        cy.get("[data-cy=all-nodes]")
          .invoke("text")
          .then(($all) => {
            expect($all).not.equal($unpublished)
          })
      })
  })
})

export {}
