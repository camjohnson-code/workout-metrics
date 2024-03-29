# WorkoutMetrics.fit

[![App Demo](https://img.youtube.com/vi/saz7a-xCGQs/maxresdefault.jpg)](https://youtu.be/saz7a-xCGQs?t=1)

WorkoutMetrics.fit is an app that allows users to get a deeper look into their Strava data without needing to be a Strava Premium user. It gives users the ability to see their personal heatmaps, dive deep into their training data, save and favorite workouts to their hall of fame, and upload activities to their Strava account.

## Live Link

[Click here](https://workout-metrics.vercel.app/) to visit the application.

## Challenges

- This project utilizes a backend created in Express. This was my first time building a backend API, and thus came the challenges of learning a new technology. [Click here](https://github.com/camjohnson-code/workout-metrics-api) to view the backend repository.
- Testing a user auth with Cypress is still a challenge. Because this app redirects to different domains, it was especially tricky. For this app, I didn't test the user auth workflow and instead focused testing on my application features. 
- The documentation for DeckGL, while in depth, was a massive rabbit hole to dive into. It took some time to get up and running with using it for the Heatmap component.

## Testing

Testing this repo will require some environment variables. If you'd like to run these tests, reach out to me and we can find a solution. 

## Installation

Unfortunately, Strava only allows for one callback domain. They also limit the number of apps I can make to one. Because of that, I'm unable to make a second app for development. I also cannot change the callback uri to run locally. Due to these factors, I can't make a branch that allows you to run this app locally. If you'd like a demo from a user perspective, you can watch the demo video above. For a further look into it, feel free to reach out to me and we can do a deep dive together.

## Future Improvements

In the future, we'd like to improve the site by adding these features:

- Add a share feature that gives users the ability to share an image to their socials.
- Modify the loading/searching message on the Hall of Fame component to reflect if it's searching or loading.
- Make the codebase more developer friendly and move some funcitons from App to a helper file.

## Acknowledgements

This project was an [assignment](https://frontend.turing.edu/projects/module-3/showcase.html) during my time as a Front End student at the [Turing School of Software and Design](https://turing.edu/).
