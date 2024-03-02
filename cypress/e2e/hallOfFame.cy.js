describe('Log in and use the hall of fame', () => {
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

    cy.intercept(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/Highlands%20Ranch%2C%20Colorado.json?access_token=pk.eyJ1IjoiY2Ftam9obnNvbi1jb2RlIiwiYSI6ImNsczVoZmQ5cTFoNzEyaWxkMHExZGxocnkifQ.HbZsLy0fXhbkSKTmVAIS0w',
      {
        response: 200,
        fixture: 'userWeather',
      }
    ).as('userWeather');

    cy.intercept('http://localhost:3001/api/v1/quote', {
      response: 200,
      fixture: 'quote',
    }).as('quote');

    cy.intercept('https://c.strava.com/com.snowplowanalytics.snowplow/tp2', {
      response: 200,
      fixture: 'stravaLogin',
    }).as('stravaLogin');

    cy.intercept('https://www.strava.com/api/v3/athlete', {
      response: 200,
      fixture: 'athlete',
    }).as('athleteResponse');

    cy.intercept('http://localhost:3001/api/v1/users', {
      response: 200,
      fixture: 'athlete',
    }).as('athletePost');

    cy.intercept('http://localhost:3001/api/v1/users/132610471', {
      response: 200,
      fixture: 'athlete',
    }).as('athlete');

    cy.intercept(
      'https://www.strava.com/api/v3/athlete/activities?access_token=null&per_page=200&page=1',
      {
        response: 200,
        fixture: 'activities',
      }
    ).as('activitiesResponse');

    cy.intercept(
      'https://www.strava.com/api/v3/athlete/activities?access_token=null&per_page=200&page=2',
      {
        response: 200,
        fixture: 'noActivities',
      }
    ).as('noActivities');

    cy.intercept(
      'https://api.weatherapi.com/v1/forecast.json?key=3b20c29161a847a880110041242502&q=39.549724,-104.969566&days=1&aqi=no&alerts=no',
      {
        response: 200,
        fixture: 'weather',
      }
    ).as('userWeather');

    cy.intercept('http://localhost:3001/api/v1/activities', {
      response: 200,
      fixture: 'activities',
    }).as('userActivities');

    cy.intercept('http://localhost:3001/api/v1/hallOfFame/132610471', {
      response: 200,
      fixture: 'hallOfFame',
    }).as('hallOfFame');

    cy.intercept('http://localhost:3001/api/v1/activities/132610471', {
      response: 200,
      fixture: 'searchedHallOfFame',
    }).as('searchedHallOfFame');

    cy.intercept('POST', 'http://localhost:3001/api/v1/hallOfFame', {
      fixture: 'updatedHallOfFame.json',
    }).as('postHallOfFame');

    cy.visit('http://localhost:3000/');
  });

  it('Searches and favorites an activity', () => {
    cy.get('.button-holder').click().visit('http://localhost:3000/redirect');
    cy.get('.sidebar-link').eq(2).click();
    cy.get('p.search-text').contains(
      'Save memorable activities using the form above.'
    );
    cy.get('#keywords')
      .type('asdfasdfasdf')
      .should('have.value', 'asdfasdfasdf');
    cy.get('p.search-text').contains('Press submit to see your results.');
    cy.get('.form-submit-button').click();
    cy.get('p.search-text').contains(
      'No activities found. Try your search again.'
    );
    cy.get('#keywords').clear().should('have.value', '');
    cy.get('#keywords')
      .type('Afternoon Run')
      .should('have.value', 'Afternoon Run');
    cy.get('#activity-type').select('Run').should('have.value', 'run');
    cy.get('p.search-text').contains('Press submit to see your results.');
    cy.get('.form-submit-button').click();
    cy.get('.card-title').contains('Afternoon Run');
    cy.get('.card > svg').click();
    cy.get('#keywords').clear().should('have.value', '');
    cy.get('.card-container').children().should('have.length', 1);
  });
});
