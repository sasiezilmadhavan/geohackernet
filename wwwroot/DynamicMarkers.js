//Helper functions for DynamicMarkers.html



//Initalize stat tracking
function initStats(){
    var MySceneDelegate = AltusUnified.ISceneDelegate.extend("ISceneDelegate", {
        getRenderEventFlags: function () {
            return AltusUnified.RenderEventFlags.POST_RENDER;
        },
        preRender: function (elapsed) {
        },
        postRender: function (elapsed) {
            var pos = AltusUnified.scene.camera().transform.geographicPosition();
            $("#statslat").val(pos.latitude);
            $("#statslon").val(pos.longitude);
            $("#statsalt").val(pos.altitude);
            pos.delete();
            
            var orientation = AltusUnified.scene.camera().transform.geographicOrientation();
            $("#statsroll").val(orientation.roll);
            $("#statspitch").val(orientation.pitch);
            $("#statsyaw").val(orientation.yaw);
            orientation.delete();
        }
    });
    var sceneDelegate = new MySceneDelegate();
    AltusUnified.scene.setDelegate(sceneDelegate);
    sceneDelegate.delete();
}


function updateCameraOrientation(){
    var roll = parseFloat($("#sliderRoll").slider("value"));
    var pitch = parseFloat($("#sliderPitch").slider("value"));
    var yaw = parseFloat($("#sliderYaw").slider("value"));
    setCameraOrientation(roll, pitch, yaw);
    $("#rollamount").val(roll);
    $("#pitchamount").val(pitch);
    $("#yawamount").val(yaw);
}

function createTransform(lat, lon, heading){
    var position = new AltusUnified.GeographicPosition(lat, lon, 0);
    var orientation = new AltusUnified.Orientation(0, 0, heading);
    var scaleValue = 0.0002;
    var scale = new AltusUnified.vec3d(scaleValue, scaleValue, scaleValue)
    var transform = new AltusUnified.Transform(position, orientation, scale);
    position.delete();
    orientation.delete();
    scale.delete();
    return transform;
}

//Global to store dynamic marker map reference
var dynamicMarkerMap;

//Downloads a marker image and then adds a marker
function addBluePlaneMarkersAsync() {
    requestData("images/blueplane.png", function(response) {
        var texture = createTextureFromXhrResponse(response);
        
        //Anchor at the center of the texture
        var anchor = new AltusUnified.vec2d(texture.getImageWidth() / 2, texture.getImageHeight()/2);
        var zero = new AltusUnified.vec2d(0, 0);
        
        //Runway 4L at KFJK
        var markerTransform = createTransform(40.6222,-73.78548, 31);
        
        //Make hit test size the same size as the texture
        var hitTestSize = new AltusUnified.vec2i(texture.getImageWidth(), texture.getImageHeight());
        
        //Create the marker
        var dynamicMarker = new AltusUnified.DynamicMarker("blueplane", 1, markerTransform, texture, zero, zero, AltusUnified.MarkerRotationType.ROTATION_TRUENORTH_ALIGNED, hitTestSize);
        
        //Set its anchor point
        dynamicMarker.anchorPoint_set(anchor);
        
        //Add the marker
        var vectorMarkers = new AltusUnified.VectorDynamicMarker();
        vectorMarkers.push_back(dynamicMarker);
        dynamicMarkerMap.addMarkers(vectorMarkers);
        
        //Clean up
        vectorMarkers.delete();
        dynamicMarker.delete();
        hitTestSize.delete();
        zero.delete();
        markerTransform.delete();
        anchor.delete();
        texture.delete();
      }
    );
  }

function addTrueNorthAlignedMarkerAsync() {
    requestData("images/TrueNorthAligned.png",
    function(response) {
        var texture = createTextureFromXhrResponse(response);
        
        var anchor = new AltusUnified.vec2d(texture.getImageWidth()/2, texture.getImageHeight()/2);
        var markerTransform = createTransform(40, -99, 0);

        //Make hit test size the same size as the texture
        var hitTestSize = new AltusUnified.vec2i(texture.getImageWidth(), texture.getImageHeight());

        //Create the marker
        var zero = new AltusUnified.vec2d(0, 0);
        var dynamicMarker = new AltusUnified.DynamicMarker("TrueNorthAligned", 1, markerTransform, texture, zero, zero, AltusUnified.MarkerRotationType.ROTATION_TRUENORTH_ALIGNED, hitTestSize);

        //Set its anchor point
        dynamicMarker.anchorPoint_set(anchor);

        //Add the marker
        var vectorMarkers = new AltusUnified.VectorDynamicMarker();
        vectorMarkers.push_back(dynamicMarker);
        dynamicMarkerMap.addMarkers(vectorMarkers);

        //Clean up
        vectorMarkers.delete();
        dynamicMarker.delete();
        hitTestSize.delete();
        zero.delete();
        markerTransform.delete();
        anchor.delete();
        texture.delete();
      }
    );
}

function addScreenEdgeAlignedMarkerAsync() {
    requestData("images/ScreenEdgeAligned.png",
    function(response) {
        var texture = createTextureFromXhrResponse(response);
        
        var anchor = new AltusUnified.vec2d(texture.getImageWidth()/2, texture.getImageHeight()/2);
        var markerTransform = createTransform(40, -101, 0);

        //Make hit test size the same size as the texture
        var hitTestSize = new AltusUnified.vec2i(texture.getImageWidth(), texture.getImageHeight());
        
        //Create the marker
        var zero = new AltusUnified.vec2d(0, 0);
        var dynamicMarker = new AltusUnified.DynamicMarker("ScreenEdgeAligned", 1, markerTransform, texture, zero, zero, AltusUnified.MarkerRotationType.ROTATION_SCREENEDGE_ALIGNED, hitTestSize);

        //Set its anchor point
        dynamicMarker.anchorPoint_set(anchor);

        //Add the marker
        var vectorMarkers = new AltusUnified.VectorDynamicMarker();
        vectorMarkers.push_back(dynamicMarker);
        dynamicMarkerMap.addMarkers(vectorMarkers);

        //Clean up
        vectorMarkers.delete();
        dynamicMarker.delete();
        hitTestSize.delete();
        zero.delete();
        markerTransform.delete();
        anchor.delete();
        texture.delete();
      }
    );
}

//Hit testing is centered around the anchor point.
//This function computes the necessary hit test size for a given texture and anchor point.
function computeHitTestSize(texture, anchorPoint){
    
}

function createDialogBoxMarkerAsync() {
    requestData("images/DialogBoxMarker.png",
    function(response) {
        var texture = createTextureFromXhrResponse(response);

        var anchorAndOffset = new AltusUnified.vec2d(texture.getImageWidth() / 2, texture.getImageHeight() / 2);
        var markerTransform = createTransform(47.6205, -122.3493, 0);

        //Make hit test size the same size as the texture
        var hitTestSize = new AltusUnified.vec2i(texture.getImageWidth(), texture.getImageHeight());
        console.log("DialogBoxMarker.png hit test size:" + hitTestSize.x + "," + hitTestSize.y);

        //Create the marker
        var zero = new AltusUnified.vec2d(0, 0);
        var dynamicMarker = new AltusUnified.DynamicMarker("Dialog Box", 1, markerTransform, texture, anchorAndOffset, anchorAndOffset, AltusUnified.MarkerRotationType.ROTATION_SCREENEDGE_ALIGNED, hitTestSize);

        //Add the marker
        var vectorMarkers = new AltusUnified.VectorDynamicMarker();
        vectorMarkers.push_back(dynamicMarker);
        dynamicMarkerMap.addMarkers(vectorMarkers);

        //Clean up
        vectorMarkers.delete();
        dynamicMarker.delete();
        hitTestSize.delete();
        zero.delete();
        markerTransform.delete();
        anchorAndOffset.delete();
        texture.delete();

        //Enable UI
        document.getElementById("markerAttributes").disabled = false;

      }
    );
}



function float2int (value) {
    return value | 0;
}

function addMarkerMapDelegate(markerMap, delegatePhrase){
    var MyMarkerMapDelegate = AltusUnified.IMarkerMapDelegate.extend("IMarkerMapDelegate", {
        onMarkerTapped: function (marker, screenPoint, markerPoint, mapName) {
            var msg = "onMarkerTapped\n";
            msg += "Map: " + mapName + "\n";
            msg += "Marker: '" + marker.metadata + "'\n";
            msg += "Screen point: (" + float2int(screenPoint.x) + ", " + float2int(screenPoint.y) + ") \n";
            msg += "Marker point: (" + float2int(markerPoint.x) + ", " + float2int(markerPoint.y) + ")\n";
            alert(msg);
            console.log("onMarkerTapped: " + msg);
        },
        onMarkersTapped: function (markerHits) {
        },
        getMarkerImage: function (markerInfo, mapName) {
        },
        phrase : delegatePhrase
    });
    var delegate = new MyMarkerMapDelegate();
    markerMap.setDelegate(delegate);
}

//Adds a dynamic marker map and then adds markers to it
function addDynamicMarkerMap(){

    //Create a dynamic marker map object
    dynamicMarkerMap = new AltusUnified.DynamicMarkerMap("dynamic markers");
    
    //Assign a delegate to listen for marker tap events
    //Note: This must be done before adding the map.
    addMarkerMapDelegate(dynamicMarkerMap);
    
    //Add the map
    AltusUnified.scene.addMap(dynamicMarkerMap);
    
    //Set the map to a really high zorder so it is always on top
    dynamicMarkerMap.setOrder(2000);
    
    //Add some dynamic markers
    addBluePlaneMarkersAsync();
    addTrueNorthAlignedMarkerAsync();
    addScreenEdgeAlignedMarkerAsync();
    createDialogBoxMarkerAsync();
    
}

function updateMarkerRotation(markerName){

    //Parse the heading from the slider control
    var heading = parseFloat($("#sliderMarkerRotation").slider("value"));
    
    //Get the dynamic marker
    var dynamicMarker = dynamicMarkerMap.getMarker(markerName);
    
    //Create a new orientation
    var newOrientation = new AltusUnified.Orientation(0, 0, heading);
    
    //Set the orientation into the marker's transform
    dynamicMarker.transform.setGeographicOrientationAndMaintainPosition(newOrientation);
    
    //Cleanup
    newOrientation.delete();
    dynamicMarker.delete();
    
    //Update UI
    $("#markerRotationAmount").val(heading);
}

function updateMarkerOffset(markerName){

    //Parse values from the slider controls
    var offsetX = parseFloat($("#sliderMarkerOffsetX").slider("value"));
    var offsetY = parseFloat($("#sliderMarkerOffsetY").slider("value"));
    
    //Get the dynamic marker
    var dynamicMarker = dynamicMarkerMap.getMarker(markerName);
    
    //Create a new offset
    var newOffset = new AltusUnified.vec2d(offsetX, offsetY);
    
    //Set the new offset
    dynamicMarker.updateOffset(newOffset);
    
    //Cleanup
    newOffset.delete();
    dynamicMarker.delete();
    
    //Update UI
    $("#markerOffsetXAmount").val(offsetX);
    $("#markerOffsetYAmount").val(offsetY);
}

$(function() {
  
  
    $("#sliderMarkerRotation").slider({
        orientation: "horizontal", min: -360.0, max: 360.0, value: 0.0,
        slide: function( event, ui ) {
            updateMarkerRotation("blueplane");
            updateMarkerRotation("ScreenEdgeAligned");
            updateMarkerRotation("TrueNorthAligned");
            updateMarkerRotation("Dialog Box");
        }
    });
    
    $("#sliderMarkerOffsetX").slider({
        orientation: "horizontal", min: -100, max: 100, value: 0.0,
        slide: function( event, ui ) {
            updateMarkerOffset("blueplane");
            updateMarkerOffset("ScreenEdgeAligned");
            updateMarkerOffset("TrueNorthAligned");
            updateMarkerOffset("Dialog Box");
        }
    });
    
    $("#sliderMarkerOffsetY").slider({
        orientation: "horizontal", min: -100, max: 100, value: 0.0,
        slide: function( event, ui ) {
            updateMarkerOffset("blueplane");
            updateMarkerOffset("ScreenEdgeAligned");
            updateMarkerOffset("TrueNorthAligned");
            updateMarkerOffset("Dialog Box");
        }
    });
  
    $("#sliderRoll").slider({
        orientation: "horizontal", min: -360, max: 360.0, value: 0.0,
        slide: function( event, ui ) {
            updateCameraOrientation();
        }
    });
  
    $("#sliderPitch").slider({
        orientation: "vertical", min: -90, max: 90, value: 90,
        slide: function( event, ui ) {
            updateCameraOrientation();
        }
    });
  
    $("#sliderYaw").slider({
        orientation: "horizontal", min: -360, max: 360.0, value: 0.0,
        slide: function( event, ui ) {
            updateCameraOrientation();
        }
    });
  
  
});