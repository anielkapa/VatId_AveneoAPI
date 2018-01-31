# Sprawdz NIP

### Overview
This is a simple, REACT based app

### Getting Started
Clone this repository```git -clone https://anielkapa@bitbucket.org/anielkapa/vat.git```

### Install
1. To run this app, you need installed NodeJS and npm. At the root of your project, run```npm install ``` to install all dependencies.
2. Please check package.json devDependencies and install all packages in required version:
```
"devDependencies": {
  "babel-core": "^6.26.0",
  "babel-loader": "^7.1.2",
  "babel-preset-react": "^6.24.1",
  "babel-preset-stage-2": "^6.24.1",
  "react": "^16.2.0",
  "react-dom": "^16.2.0",
  "webpack": "^3.10.0",
  "webpack-dev-server": "^2.11.0",
  "whatwg-fetch": "^2.0.3"
},
"dependencies": {
  "whatwg-fetch": "^2.0.3"
}
```

### Running the App
1. In console run webpack-dev-server: ```./node_modules/.bin/webpack-dev-server --inline --hot```
2. Visit http://localhost:8080/ in your browser. Webpack is running.

### Built With
* [React.js](https://reactjs.org/) -  A JavaScript library for building user interfaces.
* CSS3
* HTML5
* Webpack

### Author
* Anna Sobkowiak


### Acknowledgments
* API URL: (http://ihaveanidea.aveneo.pl/NIPAPI/Help)  

### Next steps
* clear localStorage after 1 day
