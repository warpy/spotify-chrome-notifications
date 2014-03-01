console.log(chrome.notifications);

if (window.webkitNotifications) {
  var stay = 4000,
    interval = 1000,
    hash = hex_md5("temp"),
    checks = {
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
  if (!localStorage.scn_hash) {
    localStorage.scn_hash = hash;
  }
  setInterval(function() {
    var results = {}, hash = null,
      text = null,
      cont = true;
    for (var i in checks) {
      if (checks.hasOwnProperty(i)) {
        text = checks[i].call();
        if (typeof text != "undefined" && text != null && text.length > 0) {
          results[i] = text;
        } else {
          cont = false;
        }
      }
    }
    if (cont) {
      hash = hex_md5(JSON.stringify(results));
      if (localStorage.scn_hash !== hash) {
        localStorage.scn_hash = hash;
        var notification = window.webkitNotifications.createNotification(results.art, results.name, results.artist);
        notification.show();
        setTimeout(function() {
          notification.cancel();
        }, stay);
      }
    }
  }, interval);
}