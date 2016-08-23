### Install [Node.js](https://nodejs.org/)

### Install Cordova and Ionic using npm
```
npm install -g cordova ionic
```

### Install gulp and bower
```
npm install -g gulp bower
```

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

### Build and run
```
cordova run android
```

### For debugging, use Chrome
[chrome://inspect](chrome://inspect)
