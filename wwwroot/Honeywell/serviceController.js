function getFlightData() {
  $.getJSON("http://localhost:5000/api/flight", null, function(
    data,
    textStatus,
    jqXHR
  ) {
    debugger;
    console.log(data, textStatus, jqXHR);

    var dynamicMarker = markerMap.getMarker(markerName);
    var name = "cube" + cubeNum;
    //addCube("cubes", name, lookLat, lookLon, cubeAlt, cubeSize, 254, 254, 254);
    //plane 1
    lookLat = parseFloat(data.lat);
    lookLon = parseFloat(data.lon);
    cubeAlt = parseFloat(data.alt);

    var newGeoPos = new AltusUnified.GeographicPosition(
      lookLat,
      lookLon,
      cubeAlt
    );
    dynamicMarker.transform.setPositionAndMaintainGeographicOrientation(
      newGeoPos
    );
    newGeoPos.delete();
    //plane 2
    //      var newGeoPos2 = new AltusUnified.GeographicPosition(lookLat -3, lookLon, 2);
    //    dynamicMarker2.transform.setPositionAndMaintainGeographicOrientation(newGeoPos2);
    //    newGeoPos2.delete();

    var name = "cube" + cubeNum;
    addCube("cubes", name, lookLat, lookLon, cubeAlt, cubeSize, 254, 254, 254);

    lookAtModel();
  });
}
