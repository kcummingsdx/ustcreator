function() {

  var firePixel = function (pixelIds) {
    if (pixelIds === '') {
      return;
    }

    var dxDomain = '//tags.w55c.net/rs?id=';
    var pixels = pixelIds.split(',');

    for (var i = 0; i < pixels.length; i++) {
      var dxPixelId = pixels[i];
      var cb = Math.floor(Math.random() * 99999);
      var pixelSrc = dxDomain + dxPixelId + '&rnd=' + cb;
      var img = document.createElement('img');
      img.src = pixelSrc;
    }
  };

  var normalizeUrl = function (normURL) {
    var replacedURL = normURL.replace(/^https?:\/\//, '');

    if (replacedURL.substr(-1) == '/') {
      replacedURL = replacedURL.substr(0, replacedURL.length - 1);
    }

    return replacedURL;
  };

  /* Main function to fire pixel based on matching the current URL to the URL Map */
  var dxUpx = function () {
    // This represents a list of pixel ids to fire.  The default is the diagnostic pixel.
    var dxPixelIds = 'TODO';
    var normalizedUrl = normalizeUrl(window.location.host + window.location.pathname);

    if (urlMap.hasOwnProperty(normalizedUrl)) {
      // If we find a match, replace the diagnostic pixel with those associated with the URL.
      dxPixelIds = urlMap[normalizedUrl];
    }

    firePixel(dxPixelIds);
  };

  var urlMap = {
  };

  dxUpx();

})();