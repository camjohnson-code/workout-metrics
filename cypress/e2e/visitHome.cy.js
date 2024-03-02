describe('Landing Page', () => {
  beforeEach(() => {
    cy.intercept(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/%2C%20.json?access_token=pk.eyJ1IjoiY2Ftam9obnNvbi1jb2RlIiwiYSI6ImNsczVoZmQ5cTFoNzEyaWxkMHExZGxocnkifQ.HbZsLy0fXhbkSKTmVAIS0w',
      {
        response: 200,
        fixture: 'quote',
      }
    ).as('mapbox');
    cy.intercept(
      'https://api.weatherapi.com/v1/forecast.json?key=3b20c29161a847a880110041242502&q=0,0&days=1&aqi=no&alerts=no',
      {
        response: 200,
        fixture: 'weather',
      }
    ).as('weather');
    cy.intercept('http://localhost:3001/api/v1/quote', {
      response: 200,
      fixture: 'quote',
    }).as('quote');

    cy.visit('http://localhost:3000/');
  });

  it('Visits the landing page', () => {
    cy.get('.title').contains('WorkoutMetrics.fit');
    cy.get('.subtitle').contains(
      'Empower your training with insightful metrics'
    );
    cy.get('.strava-connect-btn');
    cy.get('.down-icon').click();
    cy.get('.features-images').children().should('have.length', 3);

    cy.get('.features-text')
      .find('h2.feature-heading')
      .contains('Unique tools for all your data visualization');

    cy.get('.features-text')
      .find('p.feature-subtitle')
      .contains(
        'Use our tools to track your data at a glance. Then share your achievements easily'
      );

    cy.get('.features-text')
      .find('ul')
      .children()
      .should('have.length', 3)
      .then(($li) => {
        cy.wrap($li[0]).find('svg').should('exist');
        cy.wrap($li[0])
          .find('p')
          .contains('Heatmaps - See where you’ve traveled');

        cy.wrap($li[1]).find('svg').should('exist');
        cy.wrap($li[1]).find('p').contains('Charts - Your stats, visualized');

        cy.wrap($li[2]).find('svg').should('exist');
        cy.wrap($li[2])
          .find('p')
          .contains('Easy share - Showcase your achievements easily');
      });

    cy.get('.faq').find('h3').contains('Frequently Asked Questions');
    cy.get('section.questions-section')
      .find('div.szh-accordion')
      .children()
      .should('have.length', 5)
      .each(($child) => {
        cy.wrap($child).should('have.class', '');

        const itemDiv = $child.find('div.szh-accordion__item');
        cy.wrap(itemDiv).should('exist');

        const headingH3 = itemDiv.find('h3.szh-accordion__item-heading');
        cy.wrap(headingH3).should('exist');

        const button = headingH3.find('button.szh-accordion__item-btn');
        cy.wrap(button).should('exist');

        const contentDiv = itemDiv.find('div.szh-accordion__item-content');
        cy.wrap(contentDiv).should('exist');
      });

    cy.get('.footer p').should('contain', '© Cameron Johnson, 2024.');
    cy.get('.footer img.strava-power-btn').should('exist');

    cy.get('header.header.visible')
      .find('a.header-link')
      .should('have.length', 3)
      .then(($links) => {
        cy.wrap($links.eq(2)).click();
        cy.wrap($links.eq(1)).click();
        cy.wrap($links.eq(0)).click();
      });

    cy.get('header')
      .should('have.class', 'header')
      .and('not.have.class', 'visible');
  });
});
