export const redirectToStravaAuthorization = () => {
  const clientId = process.env.REACT_APP_STRAVA_ID;
  const redirectUri = 'http://localhost:3000/redirect/';
  const responseType = 'code';
  const approvalPrompt = 'auto';
  const scope = 'activity:write,read,activity:read_all';

  const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&approval_prompt=${approvalPrompt}&scope=${scope}`;

  window.location.href = authorizationUrl;
};

export const handleAuthorizationCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    const clientId = process.env.REACT_APP_STRAVA_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    const redirectUri = 'http://localhost:3000/redirect';
    const grantType = 'authorization_code';

    const tokenUrl = `https://www.strava.com/oauth/token`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: grantType,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    localStorage.setItem('stravaAccessToken', data.access_token);
    localStorage.setItem('stravaRefreshToken', data.refresh_token);
  }
};

export const getAthleteData = async () => {
  const accessToken = localStorage.getItem('stravaAccessToken');
  const refreshToken = localStorage.getItem('stravaRefreshToken');

  const response = await fetch('https://www.strava.com/api/v3/athlete', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.log('Request failed');
    return;
  }

  const data = await response.json();
  addAthleteToAPI(data);

  return data;
};

export const getAthleteActivities = async () => {
  const accessToken = localStorage.getItem('stravaAccessToken');
  const refreshToken = localStorage.getItem('stravaRefreshToken');
  let page = 1;
  let activities = [];

  while (true) {
    const requests = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}&per_page=200&page=${page}`
    );
    const data = await requests.json();

    if (!data.length) break;

    activities = activities.concat(data);
    page++;
  }

  localStorage.removeItem('stravaAccessToken');
  localStorage.removeItem('stravaRefreshToken');

  addActivitiesToAPI(activities);

  return activities;
};

export const addAthleteToAPI = async (athlete) => {
  const response = await fetch('http://localhost:3001/api/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(athlete),
  });

  const data = await response.json();

  return data;
};

export const addActivitiesToAPI = async (activities) => {
  for (let activity of activities) {
    const newActivity = {
      userId: activity.athlete.id,
      name: activity.name,
      distance: activity.distance,
      type: activity.type,
      start_date: activity.start_date,
      start_latlng: activity.start_latlng,
      time: activity.moving_time,
    };

    const response = await fetch('http://localhost:3001/api/v1/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newActivity),
    });

    if (!response.ok) {
      console.log('Response status:', response.status);
    }

    const data = await response.json();
  }
};

export const getWeather = (coordinates) => {
  const [longitude, latitude] = coordinates;
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  if (coordinates.length) {
    return fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
    )
      .then((response) => response.json())
      .then((data) => {
        return {
          temp: data.current.temp_f,
          condition: data.current.condition.text,
        };
      });
  }
};

export const getQuote = async () => {
  const response = await fetch('http://localhost:3001/api/v1/quote');
  const data = await response.json();

  return data;
};

export const fetchQuote = async (url) => {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.REACT_APP_QUOTE_API_KEY,
    },
  })
    .then((response) => response.json())
};

export const addQuoteToAPI = async (quote) => {
  console.log('posting quote:', quote);
  const response = await fetch('http://localhost:3001/api/v1/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quote),
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  else {
    const data = await response.json();
    return data;
  }
};
