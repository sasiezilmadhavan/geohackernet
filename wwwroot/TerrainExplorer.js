//Helper functions for TerrainExplorer.html

function hexToR(h) {return parseInt(h.substring(0,2),16);}
function hexToG(h) {return parseInt(h.substring(2,4),16);}
function hexToB(h) {return parseInt(h.substring(4,6),16);}
function hexToA(h) {return parseInt(h.substring(6,8),16) / 255.0;}
function cssColor(hexColor){
    var h=hexColor;
    if(h.length==6){
        h="00"+h;
    }
    return "rgba(" + hexToR(h) + "," + hexToG(h) + "," + hexToB(h) + "," + hexToA(h) + ")";
}

function addColorCell(row, label, hexColor){
    var cell = row.insertCell(-1);
    cell.innerHTML=label;
    console.log (hexColor+" = " + cssColor(hexColor));
    cell.style.backgroundColor = cssColor(hexColor);
}

function addColorCells(row, colorArray, valueArray){
    for (var i = 0; i < colorArray.length; i++){
        label = "";
        if(i==0){
            label=label+"&lt;";
        }
        if(i>0 && i < valueArray.length-2){
            label=label+valueArray[i-1].toString(10);
        }
        if(i==colorArray.length-2){
            label=label+"&gt;";
        }
        addColorCell(row, label, colorArray[i].toString(16));
    }
}

function addTerrainColorRow(table, colorArray, valueArray){
    var row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML="Terrain";
    addColorCells(row, colorArray, valueArray);
}

function addWaterColorRow(table, colorArray){
    var row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML="Water";
    addColorCell(row, "Land", colorArray[0].toString(16));
    addColorCell(row, "Outline", colorArray[1].toString(16));
    addColorCell(row, "Water", colorArray[2].toString(16));
    addColorCell(row, "Glow", colorArray[3].toString(16));
}

function createColorBarTable(){
    var table = document.getElementById("colorbartable");
    addTerrainColorRow(table, heightColors, heightColorValues);
    addWaterColorRow(table, waterColors);
    //addColorRow(table, lightColors, lightColorValues);
}

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

function updateSunLocation(){
    var lon = parseFloat($("#sliderLongitude").slider("value"));
    var lat = parseFloat($("#sliderLatitude").slider("value"));
    setSunLocation(lat, lon);
    $("#latamount").val(lat);
    $("#lonamount").val(lon);
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

$(function() {
    $("#sliderLatitude").slider({
        orientation: "vertical", min: -90.0, max: 90.0, value: 0.0,
        slide: function(event, ui) {
            updateSunLocation();
        }
    });
  
    $("#sliderLongitude").slider({
        orientation: "horizontal", min: -180.0, max: 180.0, value: 0.0,
        slide: function( event, ui ) {
           updateSunLocation();
        }
    });
  
    $("#sliderRoll").slider({
        orientation: "horizontal", min: -360, max: 360.0, value: 0.0,
        slide: function( event, ui ) {
        updateCameraOrientation()
        }
    });
  
    $("#sliderPitch").slider({
        orientation: "vertical", min: -90, max: 90, value: 90,
        slide: function( event, ui ) {
        updateCameraOrientation()
        }
    });
  
    $("#sliderYaw").slider({
        orientation: "horizontal", min: -360, max: 360.0, value: 0.0,
        slide: function( event, ui ) {
        updateCameraOrientation()
        }
    });
    
    updateSunLocation();
    updateCameraOrientation();
});