/// <reference types="cypress"/>

context("About", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/about")
  })

  it("should convert inline images to Next.js images", () => {
    cy.get("img[data-nimg='intrinsic']")
    cy.get("figcaption").contains("This is the caption")
  })
})

export {}
