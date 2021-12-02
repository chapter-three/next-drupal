/// <reference types="cypress"/>

context("simple search", () => {
  beforeEach(() => {
    cy.visit("/simple")
  })

  it("should allow users to search for articles", () => {
    cy.get("[name=keywords]").type("static")
    cy.get("[data-cy=btn-submit]").click()

    cy.get("[data-cy=search-result]").should("have.length.gt", 1)
  })

  it("should show empty message for no results", () => {
    cy.get("[name=keywords]").type("llama")
    cy.get("[data-cy=btn-submit]").click()

    cy.get("[data-cy=search-no-results]").should("be.visible")
    cy.get("[data-cy=search-result]").should("not.exist")
  })
})

context("advanced search", () => {
  beforeEach(() => {
    cy.visit("/advanced")
  })

  it("should allow users to use fulltext for searching", () => {
    cy.get("[name=fulltext]").type("san f")
    cy.get("[data-cy=btn-submit]").click()

    cy.get("[data-cy=search-result]").should("have.length.gt", 1)
  })

  it("should allow users to use facets for searching", () => {
    cy.get("[name=field_location]").eq(1).check()
    cy.get("[name=field_status]").eq(2).check()
    cy.get("[data-cy=btn-submit]").click()

    cy.get("[data-cy=search-result]").should("have.length", 1)
  })
})

export {}
