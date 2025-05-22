/// <reference types="cypress" />

describe('EEG Dashboard QA Tests', () => {
  const baseUrl = 'https://neuro-dash-simulator.replit.app/';

  it('Clinician dashboard shows Export CSV', () => {
    cy.visit(baseUrl);
    cy.contains('Clinician').click();
    cy.contains('Access Dashboard').click();
    cy.wait(2000);
    cy.contains('Export CSV').should('exist');
    cy.contains('Patient Information').should('exist');
  });

  it('Should call exportToCSV and trigger download', () => {
    cy.visit(baseUrl);
    cy.contains('Clinician').click();
    cy.contains('Access Dashboard').click();
    cy.wait(2000);

    cy.window().then((win) => {
      cy.spy(win.URL, 'createObjectURL').as('createObjectURL');
    });

    cy.contains('Export CSV').click();
    cy.get('@createObjectURL').should('have.been.called');
  });

  it('EEG signal timestamp updates over time', () => {
    cy.visit(baseUrl);
    cy.contains('Clinician').click();
    cy.contains('Access Dashboard').click();
    cy.wait(2000);

    cy.contains('Last updated:')
      .invoke('text')
      .then((initialText) => {
        cy.wait(2000);
        cy.contains('Last updated:')
          .invoke('text')
          .should((newText) => {
            expect(newText).not.to.equal(initialText);
          });
      });
  });

  it('Pause button stops signal updates', () => {
    cy.visit(baseUrl);
    cy.contains('Clinician').click();
    cy.contains('Access Dashboard').click();
    cy.wait(2000);

    cy.contains('Last updated:')
      .invoke('text')
      .then((initialText) => {
        cy.contains('Pause').click();
        cy.wait(2000);
        cy.contains('Last updated:')
          .invoke('text')
          .should('equal', initialText);
      });
  });

  it('Shows signal alert when seizure mode is selected', () => {
    cy.visit(baseUrl);
    cy.contains('Clinician').click();
    cy.contains('Access Dashboard').click();
    cy.wait(2000);

    cy.get('button.w-32').click();
    cy.contains('Seizure').click();
    cy.contains('Signal Out of Range Detected', { timeout: 10000 }).should('exist');
  });

  it('Removes alert when switching back to Normal mode', () => {
    cy.visit(baseUrl);
    cy.contains('Clinician').click();
    cy.contains('Access Dashboard').click();
    cy.wait(2000);

    // Trigger the alert
    cy.get('button.w-32').click();
    cy.contains('Seizure').click();
    cy.contains('EEG values are outside the normal range', { timeout: 17000 }).should('exist');

    // Go back to normal mode
    cy.get('button.w-32').click();
    cy.contains('Normal').click();

    // Wait for alert to clear and verify
    cy.wait(20000); // Wait for state update/render
    cy.contains('EEG values are outside the normal range').should('not.exist');
  });

  it('Researcher dashboard hides Export CSV', () => {
    cy.visit(baseUrl);
    cy.contains('Researcher').click();
    cy.contains('Access Dashboard').click();
    cy.wait(2000);
    cy.contains('Export CSV').should('not.exist');
    cy.contains('Patient Information').should('exist');
  });
});
