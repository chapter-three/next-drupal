/// <reference types="cypress"/>

context("Properties", () => {
  beforeEach(() => {
    cy.visit("/properties")
  })

  it("should render view with meta and pager", () => {
    cy.get("[data-cy=view--results]").contains("Found 12 properties.")
    cy.get("[data-cy=node--property]").should("have.length", 4)
    cy.get("[data-cy=node--property]")
      .find("h4")
      .contains("484 Robert Crest Apt. 875")
    cy.get("[data-cy=pager-next]").should("not.be.disabled")
    cy.get("[data-cy=pager-previous]").should("be.disabled")

    cy.get("[data-cy=pager-next]").click()
    cy.get("[data-cy=node--property]").should("have.length", 4)
    cy.get("[data-cy=pager-next]").should("not.be.disabled")
    cy.get("[data-cy=pager-previous]").should("not.be.disabled")
  })

  it("should allow view to be filtered", () => {
    cy.get("select[name='location']").select("San Francisco, CA")
    cy.get("select[name='status']").select("For Sale")
    cy.get("select[name='beds']").select("4")
    cy.get("[data-cy=submit]").contains("Search").click()
    cy.get("[data-cy=node--property]").should("have.length", 1)
  })
})

export {}
