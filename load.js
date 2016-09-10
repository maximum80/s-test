(function (exports) {
  function loadJson (filename, callback) {
    var request = new XMLHttpRequest();
    request.overrideMimeType('application/json');
    request.open('GET', filename, true);
    request.onreadystatechange = function () {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      if (request.status !== 200) {
        return;
      }
      callback(JSON.parse(request.responseText));
    };
    request.send(null);
  }
  exports.loadJson = loadJson;
})(this)
