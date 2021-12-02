/// <reference types="cypress"/>

context("About", () => {
  beforeEach(() => {
    cy.visit("/about")
  })

  it("should convert inline images to Next.js images", () => {
    cy.get("img[data-nimg='intrinsic']")
    cy.get("figcaption").contains("This is the caption")
  })
})

export {}
