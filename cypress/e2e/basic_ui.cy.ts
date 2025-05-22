/// <reference types="cypress" />

describe('EEG Dashboard QA Tests', () => {
    const baseUrl = 'https://neuro-dash-simulator.replit.app/';
  
    it('Clinician dashboard shows Export CSV', () => {
      cy.visit(baseUrl);
  
      // Select Clinician role and access dashboard
      cy.contains('Clinician').click();
      cy.contains('Access Dashboard').click();
  
      // Wait and verify dashboard elements
      cy.wait(2000);
      cy.contains('Export CSV').should('exist');
      cy.contains('Patient Information').should('exist');
    });

    it('should call exportToCSV and trigger download', () => {
        cy.visit('https://neuro-dash-simulator.replit.app/');
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
        cy.visit('https://neuro-dash-simulator.replit.app/');
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
        cy.visit('https://neuro-dash-simulator.replit.app/');
        cy.contains('Clinician').click();
        cy.contains('Access Dashboard').click();
        cy.wait(2000);
      
        cy.contains('Last updated:')
          .invoke('text')
          .then((initialText) => {
            cy.contains('Pause').click(); // pauses updates
            cy.wait(2000);
            cy.contains('Last updated:')
              .invoke('text')
              .should('equal', initialText); // timestamp didn't change
          });
      });

      it('Shows signal alert when seizure mode is selected', () => {
        cy.visit('https://neuro-dash-simulator.replit.app/');
        cy.contains('Clinician').click();
        cy.contains('Access Dashboard').click();
        cy.wait(2000);
      
         // Open the dropdown (assumes there's only one dropdown on the page)
         cy.get('button.w-32').click(); // <- This targets the SelectTrigger

        // Choose the "Seizure" option
        cy.contains('Seizure').click();
        cy.contains('Signal Out of Range Detected', { timeout: 5000 }).should('exist');
        
        });
      
      
  
    it('Researcher dashboard hides Export CSV', () => {
      cy.visit(baseUrl);
  
      // Select Researcher role and access dashboard
      cy.contains('Researcher').click();
      cy.contains('Access Dashboard').click();
  
      // Wait and verify dashboard loads without export access
      cy.wait(2000);
      cy.contains('Export CSV').should('not.exist');
      cy.contains('Patient Information').should('exist');
    });
  });
  