describe('Log in and add a workout', () => {
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

    cy.intercept('https://www.strava.com/api/v3/activities', {
      response: 200,
      fixture: 'postedActivity',
    }).as('postedActivity');

    cy.visit('http://localhost:3000/');
  });

  it('Adds a workout using the form', () => {
    cy.get('.button-holder').click().visit('http://localhost:3000/redirect');
    cy.get('.sidebar-link').eq(3).click();
    cy.get('.upload-title').contains('Missing an activity?');
    cy.get('.upload-subtitle').contains('Add your activity and we’ll add it to your Strava profile.');
    cy.get('.form').should('exist').children().should('have.length', 3);
    cy.get('.upload-instruction').contains('Upload your file below. You can also add one manually here.');
    cy.get('.dropzone').should('exist');
    cy.get('.submit-button').should('exist');
    cy.get('.manual-link').click();
    cy.get('.manual-upload-instruction').contains('Have a file? You can add it here.');
    cy.get('#distance').type('5').should('have.value', '5');
    cy.get('#distance-unit').select('Miles').should('have.value', 'miles');
    cy.get('#elevation').type('1000').should('have.value', '1000');
    cy.get('#elevation-unit').select('Feet').should('have.value', 'feet');
    cy.get('#hours').type('1').should('have.value', '1');
    cy.get('#minutes').type('0').should('have.value', '0');
    cy.get('#seconds').type('15').should('have.value', '15');
    cy.get('#type').select('Run').should('have.value', 'run');
    cy.get('#title').type('Afternoon Run').should('have.value', 'Afternoon Run');
    cy.get('#date').type('2024-01-01').should('have.value', '2024-01-01');
    cy.get('#time').type('12:00').should('have.value', '12:00');
    cy.get('#description').type('It was a cold and dark run').should('have.value', 'It was a cold and dark run');
    cy.get('.manual-form-submit').should('not.have.class', 'disabled').click();
    cy.get('.submitted-message').contains('Submitted! Return to the home page.');
  });
});