describe('Log in and see the dashboard', () => {
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

    cy.intercept('https://www.strava.com/api/v3/athlete/activities?access_token=null&per_page=200&page=1', {
      response: 200,
      fixture: 'activities',
    }).as('activities');

    cy.intercept('https://www.strava.com/api/v3/athlete/activities?access_token=null&per_page=200&page=2', {
      response: 200,
      fixture: 'noActivities',
    }).as('noActivities');

    cy.intercept('https://api.weatherapi.com/v1/forecast.json?key=3b20c29161a847a880110041242502&q=39.549724,-104.969566&days=1&aqi=no&alerts=no', {
      response: 200,
      fixture: 'weather',
    }).as('userWeather');

    cy.intercept('http://localhost:3001/api/v1/activities', {
      response: 200,
      fixture: 'activities',
    }).as('activities');

    cy.visit('http://localhost:3000/');
  });

  it('Navigates to the dashboard', () => {
    cy.get('.button-holder').click().visit('http://localhost:3000/redirect');
    cy.get('.dashboard').children().should('have.length', 8);
    cy.get('.cell-1').find('h1').should('contain', 'Date');
    cy.get('.cell-2').find('h1').should('contain', 'Last Activity');
    cy.get('.cell-3').find('h1').should('contain', 'Achievements YTD'); 
    cy.get('.cell-4').find('h1').should('contain', "Today's high");
    cy.get('.cell-5').find('h1').should('contain', 'Relative Effort');
    cy.get('.cell-6').find('h1').should('contain', 'Longest Activity in 2024');
    cy.get('.cell-7').find('h1').should('contain', 'Activity Streak');
    cy.get('.cell-8').find('h1').should('contain', 'Your Daily Kick in the Butt');
    cy.get('.quote').should('contain', 'Health is the vital principle of bliss, and exercise, of health.');
  });
});
