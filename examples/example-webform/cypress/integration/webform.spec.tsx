/// <reference types="cypress"/>

context("client side webform", () => {
  beforeEach(() => {
    cy.visit("/client-side")
  })

  it("should allow users to submit client side webform", () => {
    cy.get("[name=name]").type("First Last")
    cy.get("[name=email]").type("first@example.com")
    cy.get("[name=team]").select("Sales")
    cy.get("[name=subject]").type("Cypress")
    cy.get("[name=message]").type("This is my message.")
    cy.get("[data-cy=btn-submit]").click()

    cy.contains("Your message has been sent. Thank you.")
  })
})

context("server side webform", () => {
  beforeEach(() => {
    cy.visit("/server-side")
  })

  it("should allow users to submit client side webform", () => {
    cy.get("[name=name]").type("First Last")
    cy.get("[name=email]").type("first@example.com")
    cy.get("[name=team]").select("Sales")
    cy.get("[name=subject]").type("Cypress")
    cy.get("[name=message]").type("This is my message.")
    cy.get("[data-cy=btn-submit]").click()

    cy.contains("Your message has been sent. Thank you.")
  })
})

export {}
