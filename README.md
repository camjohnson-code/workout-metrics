# WorkoutMetrics.fit

![App demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2M5bXptZjUxZHZrMWMwaXZzbWZ4cjAyZWU0YjM3d2Iwa3Z6MTNmdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SpEfEUsc764OndqcD2/giphy.gif)

WorkoutMetrics.fit is an app that allows users to get a deeper look into their Strava data without needing to be a Strava Premium user. It gives users the ability to see their personal heatmaps, save and favorite workouts to their hall of fame, and upload activities to their Strava account.

## Live Link

[Click here](https://workout-metrics.vercel.app/) to visit the application.

## Challenges

- Testing a user auth with Cypress is still a challenge. Because this app redirects to different domains, it was especially tricky. For this app, I didn't test the user auth workflow and instead focused testing on my application features. 
- The documentation for DeckGL, while in depth, was a massive rabbit hole to dive into. It took some time to get up and running with using it for the Heatmap component.

## Testing

Testing this repo will require some environment variables. If you'd like to run these tests, reach out to me and we can find a solution. 

In order to run the Cypress tests for this repo, follow these instructions: 

### Clone the repository:

`git clone git@github.com:camjohnson-code/workout-metrics.git`

### Navigate to the project directory:

`cd workout-metrics`

### Checkout to the testing branch:

`git checkout feature/cypress-testing`

### Install dependencies:

`npm install`

### Usage

Start Cypress:

`npm run cy`

## Installation

Unfortunately, Strava only allows for one callback domain. They also limit the number of apps I can make to one. Because of that, I'm unable to make a second app for development. I also cannot change the callback uri to run locally. Due to these factors, I can't make a branch that allows you to run this app locally. If you'd like a demo from a user perspective, you can watch the demo video above. For a further look into it, feel free to reach out to me and we can do a deep dive together.

## Future Improvements

In the future, we'd like to improve the site by adding these features:

- Currently, some of the data is stored in local storage. I'd like to migrate the storage of this data to Mongo DB.
- Add a Charts and Stats component that allows users to dive deeper into their training data.
- Add a share feature that gives users the ability to share an image to their socials. 

## Acknowledgements

This project was an [assignment](https://frontend.turing.edu/projects/module-3/showcase.html) during my time as a Front End student at the [Turing School of Software and Design](https://turing.edu/).
