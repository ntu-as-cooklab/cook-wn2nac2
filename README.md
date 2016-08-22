### Install [Node.js](https://nodejs.org/)

### Install Cordova and Ionic using npm
```
npm i cordova ionic
```

### Clone this repository
```
git clone https://github.com/seanstone/cook-wn2nac2.git
```

### Clone the plugin repository
```
git clone https://github.com/seanstone/cook-plugin-wn2nac.git
```

### Fetch required pacakges and set up platform
```
cd cook-wn2nac2
ionic state reset
ionic setup sass
cordova platform add android
cordova plugin add /path/to/cook-plugin-wn2nac
```

### Build and run
```
cordova run android
```

### For debugging, use Chrome
[chrome://inspect](chrome://inspect)
