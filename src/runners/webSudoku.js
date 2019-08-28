/// <reference types="Cypress" />
import { solve } from "../sudoku";

context("Web Sudoku", () => {
  // Turn off uncaught exception handling, since websudoku.com's xhr-requests sometimes seem to fail
  Cypress.on("uncaught:exception", () => false);

  beforeEach(() => {
    cy.visit(
      "https://nine.websudoku.com/?level=" + Cypress._.random(1, 4, false)
    );
  });

  afterEach(() => {
    cy.contains("How am I doing?")
      .click()
      .wait(2500);

    cy.get("body")
      .screenshot()
      .wait(2500);
  });

  Cypress._.times(1000, i => {
    it("Let's play #" + (i + 1), () => {
      cy.get("#puzzle_grid td input").then($inputs => {
        const puzzle = Array.from($inputs).map(e => parseInt(e.value) || 0);

        for (let { position, solution } of solve(puzzle)) {
          cy.wrap($inputs[position], { log: false })
            .clear({ log: false })
            .then($input => {
              if (solution) {
                cy.wrap($input, { log: false }).type(solution, { log: false });
              }
            });
        }
      });
    });
  });
});
