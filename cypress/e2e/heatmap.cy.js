import { setLocalStorage } from './localStorageSetup.js';

describe('Log in and see the heatmap', () => {
  beforeEach(() => {
    cy.intercept(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/%2C%20.json?access_token=pk.eyJ1IjoiY2Ftam9obnNvbi1jb2RlIiwiYSI6ImNsczVoZmQ5cTFoNzEyaWxkMHExZGxocnkifQ.HbZsLy0fXhbkSKTmVAIS0w',
      {
        response: 200,
        fixture: 'mapbox',
      }
    ).as('mapbox');

    cy.intercept(
      'https://api.mapbox.com/styles/v1/camjohnson-code/cls6uhj8200ff01pv28gsgdry/emp5ym3fdp2orvhyjcgjp16k9/sprite@2x.json?access_token=pk.eyJ1IjoiY2Ftam9obnNvbi1jb2RlIiwiYSI6ImNsczVoZmQ5cTFoNzEyaWxkMHExZGxocnkifQ.HbZsLy0fXhbkSKTmVAIS0w',
      {
        response: 200,
        fixture: 'mapbox',
      }
    );
    cy.intercept(
      'https://api.mapbox.com/styles/v1/camjohnson-code/cls6uhj8200ff01pv28gsgdry?sdk=js-3.1.2&access_token=pk.eyJ1IjoiY2Ftam9obnNvbi1jb2RlIiwiYSI6ImNsczVoZmQ5cTFoNzEyaWxkMHExZGxocnkifQ.HbZsLy0fXhbkSKTmVAIS0w',
      {
        response: 200,
        fixture: 'mapbox',
      }
    );
    cy.intercept(
      'https://api.mapbox.com/v4/mapbox.mapbox-terrain-dem-v1.json?secure&access_token=pk.eyJ1IjoiY2Ftam9obnNvbi1jb2RlIiwiYSI6ImNsczVoZmQ5cTFoNzEyaWxkMHExZGxocnkifQ.HbZsLy0fXhbkSKTmVAIS0w',
      {
        response: 200,
        fixture: 'mapbox',
      }
    );
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

  it('Navigates to the dashboard', () => {
    cy.visit('https://workout-metrics.vercel.app/heatmap', {
      onBeforeLoad: (win) => {
        setLocalStorage(win);
      },
    });
    cy.get('.heatmap-container').should('exist');
  });
});
