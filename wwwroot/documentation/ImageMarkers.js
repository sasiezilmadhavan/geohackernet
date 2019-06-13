/*C1*/
var AltusUnified = new Altus(document.getElementById("AltusDiv"));

function createImageMarkersExample() {

  /*C2*/
  function addBaseMap(mapName, url) {

    // setup tile source
    var internetTileProvider = new AltusUnified.InternetTileProvider(mapName, url);

    // create map description
    var mapDesc = AltusUnified.VirtualMap.defaultRasterMapDesc();
    var newMap = new AltusUnified.VirtualMap(mapName, mapDesc, internetTileProvider);

    // add map to scene
    AltusUnified.scene.addMap(newMap);

    newMap.delete();
    mapDesc.delete();
    internetTileProvider.delete();
  };
  /*C2*/

  function pushToVector(vector, array) {
    var size = array.length;
    for (var i = 0; i < size; i++) {
      vector.push_back(array[i]);
    }
  }

  function deleteElements(array) {
    var size = array.length;
    for (var i = 0; i < size; i++) {
      array[i].delete();
    }
    array.length = 0;
  }

  function addElementsToVectorAndDelete(vector, array) {
    pushToVector(vector, array);
    deleteElements(array);
  }

  /*C3*/
  function requestData(url, onLoad, onError, onTimeout, timeout) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.timeout = timeout || 60000; // default to 60 seconds
    xhr.responseType = 'arraybuffer';

    //Handle download timeouts
    xhr.ontimeout = onTimeout || function(e) {
      console.log(e)
    };

    //Handle successful downloads
    xhr.onload = function() {
      if (xhr.status == 200 && xhr.response) {
        onLoad(xhr.response);
      } else {
        onError(e);
      }
    };

    //Handle other errors
    xhr.onerror = onError || function(e) {
      console.error(e);
    };

    //Send the download request
    xhr.send(null);
  }
  /*C3*/

  /*C4*/
  function createTextureFromImageData(imageData, width, height, mipEnabled) {
    var vector = new AltusUnified.VectorByte(),
        image,
        texture;

    pushToVector(vector, imageData);

    image = new AltusUnified.Image(width, height, vector);
    image.multiplyAlpha();

    texture = new AltusUnified.Texture(image, mipEnabled);

    vector.delete();
    image.delete();

    return texture;
  }
  /*C4*/

  /*C5*/
  function createTextureFromXhr(response) {
    var byteArray  = new Uint8Array(response),
        vector     = new AltusUnified.VectorByte(),
        altusImage = new AltusUnified.Image(),
        texture;

    pushToVector(vector, byteArray);

    altusImage.loadFromMemory(vector);
    altusImage.multiplyAlpha();
    
    texture = new AltusUnified.Texture(altusImage, false);

    vector.delete();
    altusImage.delete();

    return texture;
  }
  /*C5*/

  /*C6*/
  function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  /*C6*/

  /*C7*/
  function getImageDataFromCanvas(image) {
    var canvas  = createCanvas(image.width, image.height),
        context = canvas.getContext("2d"),
        imageData,
        imageBytes;

    // Copy the image contents to the canvas        
    context.clearRect(0, 0, image.width, image.height);
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
  }
  /*C7*/

  /*C8*/
  function addMarkers(texture) {
    var anchor = new AltusUnified.vec2d(texture.getImageWidth() / 2, texture.getImageHeight()), //anchor to bottom center
        markers = [
          new AltusUnified.MarkerData(0, 38.889469, -77.035258, 0, 1, "Washington Monument", texture),
          new AltusUnified.MarkerData(1, 38.889803, -77.009114, 0, 2, "United States Capital", texture),
          new AltusUnified.MarkerData(2, 38.8977,   -77.0365,   0, 3, "White House", texture),
          new AltusUnified.MarkerData(3, 38.8893,   -77.050111, 0, 4, "Lincoln Memorial", texture),
          new AltusUnified.MarkerData(4, 38.8957,   -77.0559,   0, 5, "Kennedy Center", texture),
          new AltusUnified.MarkerData(5, 38.891111, -77.047778, 0, 6, "Vietnam Memorial", texture),
          new AltusUnified.MarkerData(6, 38.888,    -77.02,     0, 7, "Air & Space Museum", texture),
          new AltusUnified.MarkerData(7, 38.89731,  -77.00626,  0, 8, "Union Station", texture)
        ];

    for (var i = 0; i < markers.length; i++) {
      markers[i].anchorPoint_set(anchor);
    }
  
    var vectorMarkerData = new AltusUnified.VectorMarkerData();
    addElementsToVectorAndDelete(vectorMarkerData, markers);

    var markerMap = new AltusUnified.ClusteredMarkerMap("clusteredMarkerMap", vectorMarkerData, 32, 20, AltusUnified.TargetImageFormat.FOUR_BPP, false);
  
    AltusUnified.scene.addMap(markerMap);
    markerMap.setOrder(312);
  
    vectorMarkerData.delete();
    markerMap.delete();
    texture.delete();    
  }
  /*C8*/

  function setPosition(lat, lon, altitude) {
    // create position object
    var pos = new AltusUnified.GeographicPosition(lat, lon, altitude);

    // create orientation object - camera pointed like standard 2D map view
    var orientation = new AltusUnified.Orientation(0, 90, 0);

    // create default scale object
    var scale = new AltusUnified.vec3d(1, 1, 1);

    // set transfrom to scene
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    AltusUnified.scene.camera().transform.set(trans);

    pos.delete();
    orientation.delete();
    scale.delete();
  }

  /*C9*/
  function addMarkersFromEncodedData() {
    var image = new Image(),
        imageData,
        imageBytes,
        texture;

    image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAANbY1E9YMgAABMxJREFUWMOlV1lMlFcUvjAzUEYQRrZAhk2owsiwdVgqmw7DIosDYZkBUYQXJKBowKhQakWNYjTGgJVQjEQDioYoKg8EWuOK25tFQcF9iS+kSdMYW+vpOX8DhfH/rVwm+XJzZ+499zvnnvOdOwwAmBiyb99mOXfvsqzLl9myjg4WvW8fC6mpkfnl5EQ7eHvXWVlZtTPGOmh08PJq8E5PXxq2ZYs8as8elnj0qLCP9pMdqTMI7LME7txhWVeusKRTp1hwVVW40t29X6ZQfFig0cDC3FxYXFoKC/PzwVmrBblC8bfSze0Xzbp10frOzn8J4P65EUAPCJry8hL09r1XSgqknj8PBQ8fQtGLF1MwPXoEaX194JOZiRbZh8Vr11ZM7p8TgbzhYRa+bVupFS7D0ELRy5dgfvIECkZGIP/Bg/+Ac/Pjx1D06hV8e/AgWFtbg3bjxkraz01g5Y0bLKGtTYeH/xnd1ASr3rwRDppxsAhoXWxzM0XiI47xK4eG+AiknDvHVEFB/erUVFiFnv3fwTNIvH4NmKww38/vanJPj5yLQEhtbby1TAZpFy8K4Z0NAdP4OGQMDoJMLocllZWpXATQ++9UgYGCMcvQJ3V3C1Vg5+QkjDS3JGF++hRcwsIoCo1cBPDzk09GhpDllsbpUDl6NwmaW66hhPXHEkU77bwEjgWYTIIhS+Pk+XQCNBcjEFhWRoaOcRHA7G/1TkubUwQoEZFAGxcBt8jIWrw/QXRmnQO4nnIH8wgWBAfXcxH4Zvv2CNT59yjDUIgJNZsqILFK6e0F3P8xbOvWOC4CetR/V52uy02ng8Jnz6BgdPTLCKD3dG0eCQnkfa++q4tPiIyohIbubn+Zjc2Etrr6i8WI1qF8A2rI7/oTJzRGXiXMxk5GWo5t2ICJ9C6ioUG0IiwTj3oGrv9L19iYlXf/vmCHmwAhH41E7tqVi0Yhob0dCp8/F793zJOk06fp3iEMG9hkI+JvRtevTyHv3j22aPXqH2xVKsi+dUtov9MPF/JjeBjwoQK+RmMLkcZ1zHjzpgAuApmXLk2BHhf4MJFhWQ7hAVBkEQUKffD69WDr6DiO7wLHDNyTPjg4Bb5u2Ns7Ayv6++kq9HQVqRcuTDUo0gkMM8jt7IhEWfrAgNBJp4OLwLLjxz+B4cwZalJ903sEeR+6eTPYOjmN6k+etMXKEZ5w08GtA5ZIPnuWhdfXJ2NpQta1a2AaGxNeR/ZeXuBvNteQt1T3luAiEHfkyKdobaVRYTNv3ljk7t1Q/PYtYFRAJpO9w+99KEKW3nNHYOmhQ6KIb2tj7jExzZ6JibBmYgKWVFWBvVp9la4Iy1QUXATofS+GmAMH2KKSkhV2zs6C7LpERIDaYKiLPXxY+E0MXAQwxKIgEuF1dR4KpfKP5Z2doHR1BU1FRRwdFLV3ryi4CGg3bJBGdTX7SqUaCSovBxx/Q5l2JmJSpLkI4D8hSYRs2sRQ9X52CQ0Fe0/PXyN37mS6HTskwUUgwGyWBMoym+/r222jVAKOA1okhMkoCS4C/iaTJL4uLmb4Yv6RVNFBre7xMxoZipMk+F5EGDopRDU1MXVy8vdEwCM2tgX/jklWDYGLgFRJEWJbWlhAYeEaIoAPzyqax+zfL4nPEfgHf2JVnNxdC00AAAAASUVORK5CYII=";
  
    imageData = getImageDataFromCanvas(image);
    imageBytes = new Uint8Array(imageData.data);

    texture   = createTextureFromImageData(imageBytes, image.width, image.height, true)
    addMarkers(texture);
  }
  /*C9*/

  /*C10*/
  function addMarkersFromImgTag() {
    var image = getMarkerImage(), // window scoped function
        imageData,
        imageBytes,
        texture;

    imageData = getImageDataFromCanvas(image);
    imageBytes = new Uint8Array(imageData.data);

    texture   = createTextureFromImageData(imageBytes, image.width, image.height, true)
    addMarkers(texture);

  }
  /*C10*/

  /*C11*/
  function addMarkersAsync() {
    requestData("https://cdn.ba3.us/images/blue-dot.png", function(response) {
        var texture = createTextureFromXhr(response);
        addMarkers(texture);
      }
    );
  }
  /*C11*/

  return {
    addBaseMap:                 addBaseMap,
    addMarkersFromEncodedData:  addMarkersFromEncodedData,
    addMarkersFromImgTag:       addMarkersFromImgTag,
    addMarkersAsync:            addMarkersAsync,
    setPosition:                setPosition
  }
}

// Called by the mapping engine after it has initialized
function onAltusEngineReady() {
  var ImageMarkersExample = createImageMarkersExample(),
      mapName          = "MapBox Aerial",
      tileProviderUrl  = "https://a.tiles.mapbox.com/v4/dxjacob.ho6k3ag9/{z}/{x}/{y}.jpg?access_token=pk.eyJ1IjoiZHhqYWNvYiIsImEiOiJwYXotMmtVIn0.rvNzd7EZTKqynbx-9BQdtA";

  ImageMarkersExample.addBaseMap(mapName, tileProviderUrl);

  // ImageMarkersExample.addMarkersFromEncodedData();
  // ImageMarkersExample.addMarkersFromImgTag();
  ImageMarkersExample.addMarkersAsync();

  //Position of camera 
  ImageMarkersExample.setPosition(38.889469, -77.035258, 10000);

  AltusUnified.scene.atmospherics().setSunLocationType(AltusUnified.LocationType.DIRECTION_VIEW_OFFSET); //no dark side
  AltusUnified.scene.atmospherics().setLightingType(AltusUnified.LightingType.REALISTIC); //blue sky

  console.log("Version Hash - " + AltusUnified.Scene.versionHash());
  console.log("Version Tag - " + AltusUnified.Scene.versionTag());
};

/*C1*/
