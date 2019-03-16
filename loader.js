// Load a text resource from a file over the network
var loadTextResource = function (url, i, callback) {
  var request = new XMLHttpRequest()
  request.open('GET', url + '?please-dont-cache=' + Math.random(), true)
  request.onload = function () {
    if (request.status < 200 || request.status > 299) {
      callback('Error: HTTP Status ' + request.status + ' on resource ' + url)
    } else {
      callback(null, request.responseText, i)
    }
  }
  request.send()
}

var loadImage = function (url, callback) {
  var image = new Image()
  image.onload = function () {
    callback(null, image)
  }
  image.src = url
}

var loadJSONResource = function (url, callback) {
  loadTextResource(url, function (err, result) {
    if (err) {
      callback(err)
    } else {
      try {
        callback(null, JSON.parse(result))
      } catch (e) {
        callback(e)
      }
    }
  })
}

function loadResourceCategory (resourceList, category) {
  for (var index = 0, len = resourceList.length; index < len; index++) {
    loadTextResource(resourceList[index], index, function (err, text, i) {
      if (err) {
        console.log(err)
      } else {
        var path = resourceList[i]
        resources[category][
          path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        ] = text
        resources[category].length++
        resources.length++
      }
    })
  }
}

function loadShaderResources (vertexShaderResources, fragShaderResources) {
  loadResourceCategory(vertexShaderResources, 'vertexShaders')
  loadResourceCategory(fragShaderResources, 'fragShaders')
}
