export const setLocalStorage = (win) => {
  win.localStorage.setItem('isLoggedIn', 'true');
  win.localStorage.setItem(
    'quote',
    JSON.stringify({
      quote: 'Health is the vital principle of bliss, and exercise, of health.',
      author: 'James Thomson',
    })
  );
  win.localStorage.setItem(
    'athlete',
    JSON.stringify({
      id: 132610471,
      firstname: 'Cam',
      lastname: 'Johnson',
      city: 'Highlands Ranch',
      state: 'Colorado',
      country: 'United States',
      profile:
        'https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/large-800a7033cc92b2a5548399e26b1ef42414dd1a9cb13b99454222d38d58fd28ef.png',
    })
  );
  win.localStorage.setItem(
    'recentActivity',
    JSON.stringify({
      resource_state: 2,
      athlete: {
        id: 16967528,
        resource_state: 1,
      },
      name: 'Evening Weight Training',
      distance: 0.0,
      moving_time: 2845,
      elapsed_time: 2845,
      total_elevation_gain: 0,
      type: 'WeightTraining',
      sport_type: 'WeightTraining',
      id: 8834367771,
      start_date: '2023-04-05T00:49:40Z',
      start_date_local: '2023-04-04T18:49:40Z',
      achievement_count: 0,
      map: {
        id: 'a8834367771',
        summary_polyline: '',
        resource_state: 2,
      },
      start_latlng: [],
      end_latlng: [],
      average_speed: 0.0,
      max_speed: 0.0,
    })
  );
  win.localStorage.setItem(
    'longestYearActivity',
    JSON.stringify({
      resource_state: 2,
      athlete: {
        id: 16967528,
        resource_state: 1,
      },
      name: 'Evening Weight Training',
      distance: 0.0,
      moving_time: 2845,
      elapsed_time: 2845,
      total_elevation_gain: 0,
      type: 'WeightTraining',
      sport_type: 'WeightTraining',
      id: 8834367771,
      start_date: '2023-04-05T00:49:40Z',
      start_date_local: '2023-04-04T18:49:40Z',
      achievement_count: 0,
      map: {
        id: 'a8834367771',
        summary_polyline: '',
        resource_state: 2,
      },
      start_latlng: [],
      end_latlng: [],
      average_speed: 0.0,
      max_speed: 0.0,
    })
  );
  win.localStorage.setItem(
    'activities',
    JSON.stringify([
      {
        resource_state: 2,
        athlete: {
          id: 16967528,
          resource_state: 1,
        },
        name: 'Evening Weight Training',
        distance: 0.0,
        moving_time: 2845,
        elapsed_time: 2845,
        total_elevation_gain: 0,
        type: 'WeightTraining',
        sport_type: 'WeightTraining',
        id: 8834367771,
        start_date: '2023-04-05T00:49:40Z',
        start_date_local: '2023-04-04T18:49:40Z',
        achievement_count: 0,
        map: {
          id: 'a8834367771',
          summary_polyline: '',
          resource_state: 2,
        },
        start_latlng: [],
        end_latlng: [],
        average_speed: 0.0,
        max_speed: 0.0,
      },
      {
        resource_state: 2,
        athlete: {
          id: 16967528,
          resource_state: 1,
        },
        name: 'Afternoon Run',
        distance: 6896.1,
        moving_time: 2439,
        elapsed_time: 2662,
        total_elevation_gain: 69.0,
        type: 'Run',
        sport_type: 'Run',
        workout_type: null,
        id: 8834213196,
        start_date: '2023-04-04T23:56:48Z',
        start_date_local: '2023-04-04T17:56:48Z',
        timezone: '(GMT-07:00) America/Denver',
        achievement_count: 0,
        map: {
          id: 'a8834213196',
          summary_polyline:
            '}uhpFd{n_So@H[LI@YQi@u@iAaAm@Oe@I_B@W@UGk@Cs@MSQ[y@By@Lk@@eAEOWGWAY@uAQi@Aw@QaA]g@YYKMKeAc@g@K]MQA]Ki@Kw@@]Eg@?_@Ii@DOES?gAASC_AEa@HSHa@CE@o@f@i@TCJDLYu@CA{@Uw@IwA_@SA_AB_@NMHc@j@Sl@ETGbASlAONK@IGSYk@kAY[a@iAMIu@Qc@Y[k@CMIMi@qAU[w@gBs@qA_@a@kA}@UWUe@C[OYKK_@s@WY_@u@e@gBe@w@UgAY{@Ce@?WJiAAY@e@Ca@FoC?mC@MLU\\[PYH_@XSf@Sx@M^AVBp@ZXRPTp@`ATb@x@hARNPZb@j@^ZtA|ALF`@h@PVRLJRn@f@H@XEHBZTxAr@lBh@`ADZA\\Bj@CHBHAPBl@EhAJZAVBf@?fAGpAJ@TIx@?xCPl@BVUlCCtAA~@BlAGp@E`C?LBDAp@HVLDV@`@Cp@Dj@IN?LB\\C|@JrBd@|Ap@XFvAt@f@LNHVDXAx@Pp@FP?FBb@@FF@D@ZMhBPn@Gl@@JDFt@L|@FP?H@dBCZDTHb@JHDXXZNXTt@`AF@VIb@CNC',
          resource_state: 2,
        },
        start_latlng: [39.53171091154218, -104.93975015357137],
        end_latlng: [39.531729854643345, -104.93967362679541],
        average_speed: 2.827,
        max_speed: 3.83,
      },
    ])
  );
};
