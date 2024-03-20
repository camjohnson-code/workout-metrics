// Authorization functions
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

    localStorage.setItem('stravaAccessToken', data.access_token);
    localStorage.setItem('stravaRefreshToken', data.refresh_token);
    localStorage.setItem('tokenExpiration', data.expires_at);
  }
};

export const refreshAccessToken = async (refreshToken) => {
  const clientId = process.env.REACT_APP_STRAVA_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const grantType = 'refresh_token';

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: grantType,
    }),
  });

  const data = await response.json();

  return data;
};

// Athlete functions
export const getAthleteFromStrava = async () => {
  const accessToken = localStorage.getItem('stravaAccessToken');
  const refreshToken = localStorage.getItem('stravaRefreshToken');
  const tokenExpiration = localStorage.getItem('tokenExpiration');

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

  return {...data, accessToken, refreshToken, tokenExpiration};
};

export const getAthleteFromAPI = async (id) => {
  const response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${id}`);
  const data = await response.json();

  return data;
};

export const postAthleteToAPI = async (athlete) => {
  let response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${athlete.id}`);

  if (response.ok) updateAthleteInAPI(athlete);
  else {
    response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: athlete.id,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        city: athlete.city,
        state: athlete.state,
        weight: athlete.weight || undefined,
        profile: athlete.profile,
        stravaAccessToken: athlete.accessToken,
        stravaRefreshToken: athlete.refreshToken,
        tokenExpiration: athlete.tokenExpiration,
      }),
    });
  }

  const data = await response.json();

  return data;
};

export const updateAthleteInAPI = async (athlete) => {
  const response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${athlete.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stravaAccessToken: athlete.accessToken,
        tokenExpiration: parseInt(athlete.tokenExpiration),
      }),
    });

  const data = await response.json();

  return data;
}

export const deleteUserFromAPI = async (id) => {
  const response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error deleting user');
  }
}

// Activities functions
export const getAthleteActivitiesFromStrava = async (userAccessToken) => {
  const accessToken =
    userAccessToken || localStorage.getItem('stravaAccessToken');
  let page = 1;
  let activities = [];

  while (true) {
    const requests = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}&per_page=200&page=${page}`
    );
    const data = await requests.json();

    activities = activities.concat(data);

    if (data.length < 200) break;
    page++;
  }

  localStorage.removeItem('stravaAccessToken');
  localStorage.removeItem('stravaRefreshToken');
  localStorage.removeItem('tokenExpiration');

  return activities;
};

export const getUserActivitiesFromAPI = async (id) => {
  const response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/activities/${id}`);
  const data = await response.json();

  return data;
};

export const getFilteredActivitiesFromAPI = async (athlete, keywords, activityType) => {
  const activities = await fetch(
    `https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/activities/${athlete.id}`
  );
  const allActivities = await activities.json();
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

export const postActivityToAPI = async (activity) => {
    const newActivity = {
      userId: activity.athlete.id,
      name: activity.name,
      distance: activity.distance,
      type: activity.type,
      start_date: activity.start_date,
      start_latlng: activity.start_latlng,
      time: activity.moving_time,
      id: activity.id,
      moving_time: activity.moving_time,
      achievement_count: activity.achievement_count,
      kudos_count: activity.kudos_count,
      map: activity.map,
      maxSpeed: activity.max_speed,
      kilojoules: activity.kilojoules,
      total_elevation_gain: activity.total_elevation_gain,
    };

    const response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newActivity),
    });

    if (!response.ok) console.log('Response status:', response.status);

    const data = await response.json();
    return data;
};

export const uploadFileToStrava = async (file, accessToken) => {
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

export const postActivityToStrava = async (activityData, accessToken) => {
  try {
    const response = await fetch('https://www.strava.com/api/v3/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(activityData),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const deleteActivitiesFromAPI = async (id) => {
  const response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/activities/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error deleting user activities');
  }
}

export const deleteUserActivitiesFromAPI = async (userId) => {
  const response = await fetch(`https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/users/${userId}/activities`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error deleting user activities');
  }
}

// Hall of Fame functions
export const getHallOfFameActivities = async (athlete) => {
  try {
    const response = await fetch(
      `https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/hallOfFame/${athlete.id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

export const postFavoriteToHallOfFame = async (favorite) => {
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

export const deleteFavoriteFromHallOfFame = async (activityId) => {
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

// Quote functions
export const getQuotesFromDB = async () => {
  const response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/quote');
  const data = await response.json();

  return data;
};

export const updateQuoteInDB = async (quote) => {
  const response = await fetch('https://mysterious-springs-27042-d1832f763316.herokuapp.com/api/v1/quote', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quote),
  });

  if (!response.ok) throw new Error('Error updating quote');
}

// Miscellaneous functions
export const getWeather = async (coordinates) => {
  const [longitude, latitude] = coordinates;
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  if (coordinates.length) {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
    );
    const data = await response.json();
    return {
      fTemp: data.forecast.forecastday[0].day.maxtemp_f,
      cTemp: data.forecast.forecastday[0].day.maxtemp_c,
      condition: data.current.condition.text,
    };
  }
};