![logo](https://user-images.githubusercontent.com/64254590/149922706-49c5ace8-b7f5-4ee0-a195-1916230281f6.png)\
phantasmagoria-shop-frontend
======================
A sample horror-themed card shop written in TypeScript and React (CRA). A backend GraphQL API is needed to fully enable the features of this project, fortunately [phantasmagoria-shop-backend](https://github.com/hortsatta/phantasmagoria-shop-backend#readme) can fill that role.

## :comet: Getting Started
Ensure that your machine is set up and ready for [React](https://create-react-app.dev/docs/getting-started/) development. And on your favourite terminal:

1. Clone the repository
```bash
> git clone git@github.com:hortsatta/phantasmagoria-shop-frontend.git
```
2. Navigate to project folder
```bash
> cd phantasmagoria-shop-frontend
```
3. Install project dependencies
```bash
> npm install
```
4. Create an `.env` file on your project's root folder and insert the following lines.
```bash
# Create an .env file on your root project folder, if it does not exist.
REACT_APP_BASE_URI=#baseUri
REACT_APP_API_URI=#apiUri
REACT_APP_CLOUDINARY_URI=#cloudinaryUri
REACT_APP_STRIPE_PUBLISHABLE_KEY=#stripePublishableKey
```
5. Run the project.
```bash
> npm start
```
