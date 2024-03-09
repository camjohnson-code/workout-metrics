export const redirectToStravaAuthorization = () => {
  const clientId = process.env.REACT_APP_STRAVA_ID;
  const redirectUri = 'https://workout-metrics.vercel.app/redirect/';
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
    const redirectUri = 'https://workout-metrics.vercel.app/redirect';
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

    console.log('Data:', data);

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
    localStorage.removeItem('stravaAccessToken');
    localStorage.removeItem('stravaRefreshToken');
    console.log('Request failed');
    return;
  }

  const data = await response.json();
  addAthleteToAPI(data, accessToken, refreshToken, tokenExpiration);

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

export const addAthleteToAPI = async (athlete, accessToken, refreshToken, tokenExpiration) => {
  let response = await fetch(
    `https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${athlete.id}`
  );

  if (response.ok) {
    response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${athlete.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...athlete,
        stravaAccessToken: accessToken,
        stravaRefreshToken: refreshToken,
        tokenExpiration: tokenExpiration,
      }),
    });
  } else {
    response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...athlete,
        stravaAccessToken: accessToken,
        stravaRefreshToken: refreshToken,
        tokenExpiration: tokenExpiration,
      }),
    });
  }

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
      id: activity.id,
    };

    const response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/activities', {
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

export const getWeather = async (coordinates) => {
  const [longitude, latitude] = coordinates;
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  if (coordinates.length) {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
    );
    const data = await response.json();
    return {
      temp: data.forecast.forecastday[0].day.maxtemp_f,
      condition: data.current.condition.text,
    };
  }
};

export const getQuote = async () => {
  const response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/quote');
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
  }).then((response) => response.json());
};

export const addQuoteToAPI = async (quote) => {
  const response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/quote', {
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

export const fetchUserActivities = async (athlete, keywords, activityType) => {
  const response = await fetch(
    `https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/activities/${athlete.id}`
  );
  const data = await response.json();

  const allActivities = data.data;

  const filteredActivities = allActivities.filter((activity) => {
    const matchesKeyword = activity.name
      .toLowerCase()
      .includes(keywords.toLowerCase());
    const matchesType =
      activityType === 'all' ||
      activity.type.toLowerCase() === activityType.toLowerCase();
    return matchesKeyword && matchesType;
  });

  return filteredActivities;
};

export const getHallOfFameActivities = async (athlete) => {
  try {
    const response = await fetch(
      `https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/hallOfFame/${athlete.id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.activities;
  } catch (error) {
    return [];
  }
};

export const addFavoriteToHallOfFame = async (favorite) => {
  try {
    const response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/hallOfFame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favorite),
    });

    if (!response.ok) {
      throw new Error('Error adding favorite to Hall of Fame');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeFavoriteFromHallOfFame = async (activityId) => {
  const response = await fetch(
    `https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/hallOfFame/${activityId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Error removing favorite from Hall of Fame');
  }
};

export const getUserFromAPI = async (id) => {
  const response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${id}`);
  const data = await response.json();

  return data;
};

export const uploadFile = async (file, accessToken) => {
  const formData = new FormData();
  formData.append('file', file);

  const extension = file.name.split('.').pop().toLowerCase();
  formData.append('data_type', extension);

  try {
    const response = await fetch('https://www.strava.com/api/v3/uploads', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

export const postActivity = async (activityData, accessToken) => {
  try {
    const response = await fetch('https://www.strava.com/api/v3/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(activityData),
    });

    if (response.ok) return { ok: true };
    else return { ok: false };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
