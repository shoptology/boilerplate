cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
      "file": "plugins/org.apache.cordova.device/www/device.js",
      "id": "org.apache.cordova.device.device",
      "clobbers": [
          "device"
      ]
  },
  {
      "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
      "id": "org.apache.cordova.vibration.notification",
      "merges": [
          "navigator.notification"
      ]
  }
]
});
