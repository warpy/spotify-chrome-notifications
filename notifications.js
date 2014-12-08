var alert_str = "[Spotify Chrome Notification]";
console.log(alert_str, "initializing (available: " + (typeof window.Notification != 'undefined') + ")");
var stay = 4000;
var interval = 1000;
var hash = hex_md5("temp");
var checks = {
  art: function() {
    var $img = $('#cover-art').find('.sp-image-img');
    if ($img.length > 0) {
      return $img.css('background-image').replace("url(", "").replace(")", "");
    }
    return null;
  },
  name: function() {
    return $('#track-name').text();
  },
  artist: function() {
    return $('#track-artist').text();
  }
};
if (window.Notification) {
  console.log(alert_str, "requesting permission");
  window.Notification.requestPermission(function() {
    console.log(alert_str, "permission granted");
    if (!localStorage.scn_hash) {
      localStorage.scn_hash = hash;
    }
    setInterval(function() {
      var result = {};
      var hash = null;
      var text = null;
      var cont = true;
      for (var i in checks) {
        if (checks.hasOwnProperty(i)) {
          text = checks[i].call();
          if (typeof text != "undefined" && text != null && text.length > 0) {
            result[i] = text;
          } else {
            cont = false;
          }
        }
      }
      if (cont) {
        hash = hex_md5(JSON.stringify(result));
        if (localStorage.scn_hash !== hash) {
          localStorage.scn_hash = hash;
          console.log(alert_str, "new song", result);
          var notification = new window.Notification(result.name, {
            body: result.artist,
            icon: result.art
          });
          setTimeout(function() {
            notification.close();
          }, stay);
        }
      }
    }, interval);
  });
}
