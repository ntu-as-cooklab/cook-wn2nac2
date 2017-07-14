# Introduce
Via smart phone, Windoo sensor, and this APP, conduct experiment "Meteorological Observation by Smart Phone Citizen Scientists".

## Have A Look
![](https://raw.githubusercontent.com/seanstone/cook-wn2nac2/master/demo.gif)

## Reqirement

### [Node.js](https://nodejs.org/)

### Install Cordova and Ionic using npm
```
npm install -g cordova ionic
```

### Install gulp and bower
```
npm install -g gulp bower
```

## Run 

### Clone this repository
```
git clone https://github.com/seanstone/cook-wn2nac2.git
```

### Fetch required pacakges and set up platform
```
cd cook-wn2nac2
ionic state reset
ionic setup sass
cordova platform add android
```

### For Android, install [Android SDK](https://developer.android.com/studio/index.html)
You only need the basic Android command line tools

### Build and run
```
cordova run android
```
### Test the app with the browser
```
ionic serve
```
Then the browser open app as page

### For debugging, use Chrome
[chrome://inspect](chrome://inspect)

### Referance
[Taiwan's Weather Maps!](https://github.com/comdan66/weather)

[Compass in HTML5 Demo](http://codepen.io/rlautan/pen/YPzGjo)
