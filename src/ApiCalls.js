export const redirectToStravaAuthorization = () => {
  const clientId = process.env.REACT_APP_STRAVA_ID;
  const redirectUri = 'http://localhost:3000/redirect/';
  const responseType = 'code';
  const approvalPrompt = 'auto';
  const scope = 'activity:write,read';

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
  })
    .then((response) => response.json())
};
