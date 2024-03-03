import { setLocalStorage } from './localStorageSetup.js';

describe('Explore the dashboard', () => {
  beforeEach(() => {
    cy.intercept(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/Highlands%20Ranch%2C%20Colorado.json?access_token=pk.eyJ1IjoiY2Ftam9obnNvbi1jb2RlIiwiYSI6ImNsczVoZmQ5cTFoNzEyaWxkMHExZGxocnkifQ.HbZsLy0fXhbkSKTmVAIS0w',
      {
        response: 200,
        fixture: 'quote',
      }
    ).as('mapbox');

    cy.intercept(
      'https://api.weatherapi.com/v1/forecast.json?key=3b20c29161a847a880110041242502&q=39.549724,-104.969566&days=1&aqi=no&alerts=no',
      {
        response: 200,
        fixture: 'weather',
      }
    ).as('userWeather');

    cy.intercept(
      'https://api.weatherapi.com/v1/forecast.json?key=3b20c29161a847a880110041242502&q=0,0&days=1&aqi=no&alerts=no',
      {
        response: 200,
        fixture: 'weather',
      }
    ).as('weather');

    // Check the fixture before running the test. If the date in the fixture isn't today, a new, un-stubbed fetch will be called
    cy.intercept(
      'https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/quote',
      {
        response: 200,
        fixture: 'quote',
      }
    ).as('quote');
  });

  it('Views the dashboard', () => {
    cy.visit('https://workout-metrics.vercel.app/dashboard', {
      onBeforeLoad: (win) => {
        setLocalStorage(win);
      },
    });

    cy.get('.dashboard').children().should('have.length', 8);
    cy.get('.cell-1').find('h1').should('contain', 'Date');
    cy.get('.cell-2').find('h1').should('contain', 'Last Activity');
    cy.get('.cell-3').find('h1').should('contain', 'Achievements YTD');
    cy.get('.cell-4').find('h1').should('contain', "Today's high");
    cy.get('.cell-5').find('h1').should('contain', 'Relative Effort');
    cy.get('.cell-6').find('h1').should('contain', 'Longest Activity in 2024');
    cy.get('.cell-7').find('h1').should('contain', 'Activity Streak');
    cy.get('.cell-8')
      .find('h1')
      .should('contain', 'Your Daily Kick in the Butt');
    cy.get('.quote').should(
      'contain',
      'Health is the vital principle of bliss, and exercise, of health.'
    );
  });
});
