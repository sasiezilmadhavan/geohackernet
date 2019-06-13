/*C1*/
//RoutePlanning2D.js
//Globals that control this scenario.
var movingPointIndex;       //The index of the current moving route point
var pointWasMoved;          //Indicates if a newly inserted route point was actually moved
var labelLayerName = "RouteLabels"; //Name of marker layer
var fontSize = 12;          //Font size of labels
var maxLevel = 11;           //Maximum level to cluster labels to
var clusterDistance = 20;   //Cluster distance for labels
var routeData;              //Will contain the json data for the route
var routeLineLayer;         //Dynamic vector layer
var routeLine;              //The dynamic route line
var routeLineStyle;         //Style for the line
var routeLineWidth = 4;     //Route line width
var routeLineStrokeWidth = 1; //Route line stroke width
var routeLineFillColorR = 0; //Route line fill color : red
var routeLineFillColorG = 191; //Route line fill color : green
var routeLineFillColorB = 255; //Route line fill color : blue
var routeLineFillColorA = 100; //Route line fill color : alpha
var routeLineStrokeColorR = 0; //Route line outline color : red
var routeLineStrokeColorG = 0; //Route line outline color : green
var routeLineStrokeColorB = 0; //Route line outline color : blue

//How far away from a line segment a mouse click will register a hit
var routeLineSegmentHitTestPixelBufferDistance = 10;

//How far away from a line vertex a mouse click will register a hit
var routeVertexHitTestPixelBufferDistance = 10;

//////////////////////////////////////////////////////////////////
//Map layer creation and utility functions for this sceario
//Creates a dynamic vector layer for the route line
function createAndAddDynamicVectorLayer(layerName, zOrder){
    var vectorLayer = new AltusUnified.DynamicVectorMap(layerName);
    vectorLayer.setOrder(zOrder);
    vectorLayer.setVectorWindingOrder(AltusUnified.VectorWindingOrder.BOTH);
    vectorLayer.setTesselationThreshold(40000);
    return vectorLayer;
}

//Adds a dynamic line to a dynamic vector layer
function addDynamicLine(vectorLayer, lineName, lineData, lineStyle){
    
    //Create line
    var dynamicLine = new AltusUnified.DynamicLine(lineName);
    
    //Create and add way point positions
    for(i=0; i<lineData.length; i++){
        position2D = new AltusUnified.GeographicPosition2D(lineData[i].y, lineData[i].x);
        dynamicLine.points().push_back(position2D);
        position2D.delete();
    }
    
    //Add the line
    vectorLayer.addDynamicLine(dynamicLine, lineStyle);
    return dynamicLine;
}

//Creates a very accurate screen point in the same pixel coordinate space as the mapping engine.
//This is used by the mousedown event handler
function createScreenPoint(x, y){
    var percentagePoint =  AltusUnified.scene.screen().getPercentagePoint(x, y);
    var screenPoint = AltusUnified.scene.screen().getScreenPoint(percentagePoint);
    percentagePoint.delete();
    return screenPoint;
}

//Given a mouse event, returns the closest geographic position.
function createNearestGeographicPosition(x, y){
    var screenSpacePercentagePoint =  AltusUnified.scene.screen().getPercentagePoint(x, y);
    var ray = AltusUnified.scene.camera().getRay(screenSpacePercentagePoint);
    var worldPosition = AltusUnified.scene.camera().transform.worldPosition();
    
    var closestPointToSphere = AltusUnified.intersectRayWithUnitSphereOrClosestPoint(worldPosition, ray);
    
    //If we are in space, move to point on earth
    closestPointToSphere.normalize();
    
    //Create a position (must be deleted later)
    var geographicPosition = AltusUnified.getGeographicPosition(closestPointToSphere);
    
    //Clean up
    screenSpacePercentagePoint.delete();
    ray.delete();
    worldPosition.delete();
    closestPointToSphere.delete();
    
    return geographicPosition;
}

//Handles when a line segment is hit
function handleLineSegmentHit(lineSegmentHit, lon, lat) {
    pointWasMoved = false;
    var startPointIndex = lineSegmentHit.startPointIndex;
    
    //Insert a new entry into the route data for the new point that
    //will break the segment into 2 segments
    routeData.splice(
        startPointIndex+1, 0,{
            "m": "Foo",
            "x": lon,
            "y": lat,
            "w": 9,
            "ml": 3
        }
    );
    
    //set moving point index here
    movingPointIndex = startPointIndex+1;
}

//Handles when a line vertex is hit
function handleVertexHit(vertexHit){
    var vertexIndex = vertexHit.vertexIndex;
    movingPointIndex = vertexIndex;
}


//////////////////////////////////////////////////////////
//Labels

//Adds a clustered marker layer of labels nice fonts (see altusutil.js)
function addLabelLayer(){
    addMarkerLayer(labelLayerName, fontSize, maxLevel, clusterDistance, routeData);
}

//Updates the label layer by removing and re-adding the clustered markers
function updateLabelLayer(){
    var map = AltusUnified.scene.findMap(labelLayerName);
    if (map != null) {
        AltusUnified.scene.removeMap(map, true);
        map.delete();
    }
    addLabelLayer();
}

////////////////////////////////////////////////////////////////
//Mouse event handling

//Redraws the route line (called whenever routeData is changed)
function redrawRoute(){
    //Remove the current route line and delete
    routeLineLayer.removeDynamicLineFromCache(routeLine);
    routeLine.delete();
    
    //Add a new route line to the dynamic vector layer for the route
    routeLine = addDynamicLine(routeLineLayer, "route", routeData, routeLineStyle);
    
    //Redraw the dynamic vector map
    routeLineLayer.rebuildMapUsingCachedShapes();
}

var PathMover = AltusUnified.ILongPressDelegate.extend("ILongPressDelegate", {
    withholdingInput: function () {},
    stoppedWitholdingInput: function () {},
    startLongPress: function (x, y) {
        // we have pressed for long enough
        var geographicPosition = createNearestGeographicPosition(x, y);
        mouseDownLat = geographicPosition.latitude;
        mouseDownLon = geographicPosition.longitude;
        geographicPosition.delete();
        console.log("mouse down at lon:" + mouseDownLon + " lat:" + mouseDownLat);

        //Trigger hit
        var point = createScreenPoint(x, y);
        var hit = routeLineLayer.triggerLineHitDetection(point, 20, 20);
        point.delete();

        //Handle hit
        if (hit != null) {
            //Hit a vertex? (actual route waypoint)
            if (hit.hitType == AltusUnified.VectorGeometryHitType.Vertex) {
                handleVertexHit(hit);
            }
            //Hit a segment? (line between two route waypoints)
            if (hit.hitType == AltusUnified.VectorGeometryHitType.LineSegment) {
                handleLineSegmentHit(hit, mouseDownLon, mouseDownLat);
            }
            hit.delete();
            return true;
        }
        return false;
    },
    updateLongPress: function (x, y) {
        if (true) {
            pointWasMoved = true;
            //Get geographic position
            var geographicPosition = createNearestGeographicPosition(x, y);
            var mouseMoveLat = geographicPosition.latitude;
            var mouseMoveLon = geographicPosition.longitude;
            geographicPosition.delete();

            //Update the waypoint's metadata (label) to show the lat/lon
            //of it's new location
            routeData[movingPointIndex].y = mouseMoveLat;
            routeData[movingPointIndex].x = mouseMoveLon;
            routeData[movingPointIndex].m = "" + mouseMoveLat.toFixed(2) + "," + mouseMoveLon.toFixed(2);

            redrawRoute();
        }
    },
    stoppedLongPress: function () {
        console.log("mouse up");

        if (pointWasMoved) {
            //Redraw labels only (as route is redrawn during mousemove event)
            updateLabelLayer();
        }

        if (!pointWasMoved) {
            //The new point was never actually moved, so delete it
            //Remove the new point and redraw the route
            routeData.splice(movingPointIndex, 1);
            redrawRoute();
        }
    }
});


///////////////////////////////////////////////////
//Route data acquisition
//Downloads route data in the background, when it is loaded, create a marker layer and a line to represent the route and then register to handle mouse events.
function loadRouteFromJSON(jsonFile){
    console.log("foo");
    downloadAndParseJSON(jsonFile,
        function(data){
            routeData = data;
                         
            //Add marker layer
            addLabelLayer();
            
            //Add route line
            routeLine = addDynamicLine(routeLineLayer, "route", routeData, routeLineStyle);
        },
        //Handle errors
        function(xhr) {
            console.log("Error downloading JSON data: " + xhr.err)
        }
    );
}

//Handles hit events (when mouse comes up) for lines and shapes
var RouteLayerDelegate = AltusUnified.IVectorMapDelegate.extend("IVectorMapDelegate", {
    onLineSegmentHit: function (mapName, shapeId, geoHitPoint, screenPoint, segmentStartIndex, segmentEndIndex) {
            console.log("OnLineSegmentHit: " + mapName + "." + shapeId + "(" + segmentStartIndex + "," + segmentEndIndex + ") at " + screenPoint);
    },
    onVertexHit: function (mapName, shapeId, geoHitPoint, screenPoint, vertexIndex) {
            console.log("OnVertexHit: " + mapName + "." + shapeId + "(" + vertexIndex + ") at " + screenPoint);
    },
    onPolygonHit: function (hits, geoHitPoint, screenPoint) {
        for (i = 0; i < hits.size() ; i++)
        {
        var hit = hits.get(i);
        console.log("OnPolygonHit: " + hit.mapName + "." + hit.shapeId + " at " + screenPoint);
        hit.delete();
        }
        this.map.triggerLineHitDetection(screenPoint, 15, 15);
    },
    onPolygonHit3d: function (hits, screenPoint) {
        for (i = 0; i < hits.size() ; i++)
        {
        var hit = hits.get(i);
        console.log("OnPolygonHit3d: " + hit.mapName + "." + hit.shapeId + " at " + screenPoint);
        hit.delete();
        }
    },
    polygonHitDetectionEnabled: function() {
        return true;
    },
    lineSegmentHitTestPixelBufferDistance: function() {
        return routeLineSegmentHitTestPixelBufferDistance;
    },
    vertexHitTestPixelBufferDistance: function() {
        return routeVertexHitTestPixelBufferDistance;
    },
    scene: null,
    map: null,
});

//Creates the style for the route line
function createRouteLineStyle(){
    
    var fillColor = new AltusUnified.Color(routeLineFillColorR,
                                           routeLineFillColorG,
                                           routeLineFillColorB,
                                           routeLineFillColorA);
    
    var strokeColor = new AltusUnified.Color(routeLineStrokeColorR,
                                             routeLineStrokeColorG,
                                             routeLineStrokeColorB);
                  
    var style = new AltusUnified.LineStyle(fillColor, routeLineWidth,
                                           strokeColor, routeLineStrokeWidth);
                                           
    //Clean up
    fillColor.delete();
    strokeColor.delete();
    return style;
}

function routePlanning2DMain(){
    //Turn on a base map. This map is a set of weathergrid tiles
    //that look like terrain. They are smoothe bilinear filtered,
    //and are colored well for labels and things
    setColorbarTerrainBaseMap1(); //See altusutil.js
    
    //Create and add route layer
    routeLineLayer = createAndAddDynamicVectorLayer("routeLineLayer", 10);
    
    //Register a delegate for mouse clicks.
    //NOTE: You must register the delegate before adding this map layer
    var routeLayerDelegate = new RouteLayerDelegate();
    routeLineLayer.setDelegate(routeLayerDelegate);
    routeLayerDelegate.scene = AltusUnified.scene;
    routeLayerDelegate.map = routeLineLayer;
    routeLayerDelegate.delete();
    
    var prevInputHandler = AltusUnified.inputManager.rawInputHandler();
    var pathMoverDelegate = new PathMover();
    var longPressInputHandler = new AltusUnified.LongPressInputHandler(AltusUnified.scene, pathMoverDelegate, prevInputHandler);
    longPressInputHandler.setLongPressDuration(0);
    AltusUnified.inputManager.setRawInputHandler(longPressInputHandler);
    
    //Clean up
    pathMoverDelegate.delete();
    prevInputHandler.delete();
    longPressInputHandler.delete();

    //Add the map layer
    AltusUnified.scene.addMap(routeLineLayer);
    
    //Create style for route line
    routeLineStyle = createRouteLineStyle();
    
    //Load the initial route from a JSON file
    //This will download asyncrhonously (for example if you have a
    //large route or this data might be coming from a server)
    //When it completes it will add the route line and label layers
    loadRouteFromJSON("RouteMarkers.json");
    
    //Here you could put up a loading message...
}
/*C1*/