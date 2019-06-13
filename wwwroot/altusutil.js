/*C1*/
//Create an instance of Altus
var AltusUnified;
var clusterStartTimeStamp = 0;

var heightColorValues = [0, 50, 200, 600,
1000, 2000, 3000, 4000,
5000, 6000, 7000, 8000,
9000, 10000, 11000, 12000];

var heightColors = [
    0x9fb28DFF, // <= 0
    0x4e7a5fFF, // 0 - 50
    0x5c8563FF, // 50 - 200
    0x6f8d6dFF, // 200 - 600
    0x9a9874FF, // 600 - 1000
    0xa1a094FF, // 1000 - 2000
    0xcab9a6FF, // 2000 - 3000
    0xc6947cFF, // 3000 - 4000
    0xc59b96FF, // 4000 - 5000
    0xcab9a6FF, // 5000 - 6000
    0xd8e0edFF, // 6000 - 7000
    0xd0c0afFF, // 7000 - 8000
    0xd9ccbfFF, // 8000 - 9000
    0xe3d9cfFF, // 9000 - 10000
    0xece6dfFF, // 10000 - 11000
    0xf6f2efFF, // 11000 - 12000
    0xFFFFFFFF  // > 12000
    ];

var waterColorValues = [128, 129, 240];
var waterColors = [
    0xffffcc00, // land
    0x006badff, // outline
    0x0065a3ff, // water glow
    0x005f99ff  // water
    ];

var lightColorValues = [0, 32, 64, 96, 128, 160, 192, 224, 248, 256];
var lightColors = [
    0x0000007F,
    0x00000070,
    0x000000D0,
    0x000000B0,
    0x00000090,
    0x00000070,
    0x00000050,
    0x00000030,
    0x00000010,
    0x00000000,
    0x00000000
    ];


///////////////////////////////////////////////////////////
//Map URL templates

//Height data:
//2 byte PNG, for map formats: VIRTUAL_TERRAIN and TERRAIN_HEIGHT
var terrain2BytePNGUrlTemplate="https://maps.ba3.us/terrain/2bytepng/noborder/{z}/{x}/{y}.png"

//1 byte PNG, for map formats: WEATHER_GRID
var terrain1BytePNGUrlTemplate="https://maps.ba3.us/terrain/tiles/{z}/{x}/{y}.png"

//MapBox raster maps
var mapBoxSubDomainList="a,b,c,d";
var mapBoxAerialUrlTemplate= "https://{s}.tiles.mapbox.com/v4/dxjacob.ho6k3ag9/{z}/{x}/{y}.jpg?access_token=pk.eyJ1IjoiZHhqYWNvYiIsImEiOiJwYXotMmtVIn0.rvNzd7EZTKqynbx-9BQdtA"
var mapBoxStreetsUrlTemplate="https://{s}.tiles.mapbox.com/v3/dxjacob.h43n70g0/{z}/{x}/{y}.png"

//Other raster maps
var mapQuestAerialUrlTemplate="https://otile{s}-s.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg"
var mapQuestSubDomainList="1,2,3,4";


function createAltusUnified(){
    AltusUnified = new Altus({
        renderTo: document.getElementById("AltusDiv"),
        pauseWhenNotVisible: true,
        
        /*C24*/
        //Altus Mapping Engine Events
        
        //Called when starting to load a resource for a layer.
        onWillStartLoadingMap: function (mapName) {
            console.log("AltusEvent: onWillStartLoadingMap mapName:" + mapName);
        },
        
        //Called when finished loading a resource for a layer.
        onDidFinishLoadingMap: function (mapName) {
            console.log("AltusEvent: onDidFinishLoadingMap mapName:" + mapName);
        },
        
        //Called when a clustering operation begins.
        onBeginClusteringMarkers: function (mapName, timeStamp) {
            console.log("AltusEvent: onBeginClusteringMarkers mapName:" + mapName + " timeStamp:" + timeStamp);
            clusterStartTimeStamp = timeStamp;
        },
        
        //Called when a clustering operation ends.
        onEndClusteringMarkers: function (mapName, timeStamp) {
            console.log("AltusEvent: onEndClusteringMarkers mapName:" + mapName + " timeStamp:" + timeStamp + " elapsed:" + (timeStamp - clusterStartTimeStamp));
        },
        
        onPanBegan: function(){
            //console.log("AltusEvent: onPanBegan");
        },
        
        onPanEnded: function(){
            //console.log("AltusEvent: onPanEnded");
        },
        
        onPinchBegan: function(){
            //console.log("AltusEvent: onPinchBegan");
        },
        
        onPinchEnded: function(){
            //console.log("AltusEvent: onPinchEnded");
        },
        
        onDeviceScaleChanged: function(){
            //console.log("AltusEvent: onDeviceScaleChanged");
        },
        
        onTileSizeChanged: function(){
            //console.log("AltusEvent: onTileSizeChanged");
        }
        /*C24*/
    });
};
/*C1*/

/*C2*/
/*Set camera orientation using roll, pitch, and yaw
 Note: We could also use transform.lookAt(vec3d worldPosition, vec3d up) without using roll pitch and yaw
 */
function setCameraOrientation(roll, pitch, yaw){
    var pos = AltusUnified.scene.camera().transform.geographicPosition();
    var orientation = new AltusUnified.Orientation(roll, pitch, yaw);
    var scale = AltusUnified.scene.camera().transform.scale();
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    AltusUnified.scene.camera().transform.set(trans);
    trans.delete();
    pos.delete();
    orientation.delete();
    scale.delete();
}

/**Set camera position*/
function setCameraPosition(lat, lon, altitude) {
    var pos = new AltusUnified.GeographicPosition(lat, lon, altitude);
    var orientation = new AltusUnified.Orientation(0, 90, 0);
    var scale = new AltusUnified.vec3d(1, 1, 1);
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    AltusUnified.scene.camera().transform.set(trans);
    trans.delete();
    pos.delete();
    orientation.delete();
    scale.delete();
};

/**Reset camera to over the U.S.*/
function resetCamera() {
    setCameraPosition(39, -98, 10000000);
};

function lookAtUS() {
    setCameraPosition(39, -98, 5000000);
}
/*C2*/

/*C3*/
//Map helper functions
/**Remove a map.*/
function removeMap(mapName){
    console.log("removeMap: " + mapName);
    var map = AltusUnified.scene.findMap(mapName);
    if (map != null) {
        AltusUnified.scene.removeMap(map, true);
        map.delete();
    }
};

// Does the work to add colors to a colorbar
function createColorBar(values, colors, min, max) {
    var numValues = values.length;
    var colorbar = new AltusUnified.ColorBar();
    
    var minValue = min;
    
    for (var i = 0; i < numValues; ++i) {
        var color = new AltusUnified.Color(colors[i]);
        var maxValue = values[i];
        colorbar.addColor(minValue, color);
        colorbar.addColor(maxValue, color);
        
        minValue = maxValue + 0.0001;
        color.delete();
    }
    
    var lastColor = new AltusUnified.Color(colors[numValues]);
    if (minValue < max)
    colorbar.addColor(minValue, lastColor);
    colorbar.addColor(max, lastColor);
    lastColor.delete();
    
    return colorbar;
}

/**Turns on a base map based on dynamically coloring height samples from a 1-byte PNG tile source.*/
function addColorbarBaseMap(mapName, url, maxLevel) {
    
    removeAllBaseMaps();
    
    var internetTileProvider = AltusUnified.InternetTileProvider.createFromURLWithSubdomainsAndFormat(mapName, url, "", true, AltusUnified.MapFormat.WEATHER_GRID);
    
    internetTileProvider.loadingInstructions().maxParentOffset = 20;
    
    var textureElevation;
    var textureWater;
    var textureLight;
    
    // Set up the elevation colorbar
    var colorbarElevation = createColorBar(heightColorValues, heightColors, -328.1, 13123);
    textureElevation = AltusUnified.Texture.createFromColorBar(colorbarElevation);
    colorbarElevation.delete();
    
    // Set up the water colorbar
    var colorbarWater = createColorBar(waterColorValues, waterColors, 0, 256);
    textureWater = AltusUnified.Texture.createFromColorBar(colorbarWater);
    colorbarWater.delete();
    
    // Set up the light colorbar
    var colorbarLight = createColorBar(lightColorValues, lightColors, 0, 256);
    textureLight = AltusUnified.Texture.createFromColorBar(colorbarLight);
    colorbarLight.delete();
    
    var colorbars = new AltusUnified.VectorTexture();
    colorbars.push_back(textureElevation);
    colorbars.push_back(textureWater);
    colorbars.push_back(textureLight);
    textureElevation.delete();
    textureWater.delete();
    textureLight.delete();
    
    var newMap = new AltusUnified.WeatherGridMap(mapName, internetTileProvider, colorbars);
    newMap.setMaxLevel(maxLevel);
    newMap.set
    AltusUnified.scene.addMap(newMap);
    
    newMap.delete();
    internetTileProvider.delete();
    colorbars.delete();
    
}

/**Removes a map, but does not clear the cache.*/
function removeBaseMap(mapName){
    var map = AltusUnified.scene.findMap(mapName);
    if (map != null) {
        AltusUnified.scene.removeMap(map, false);
        map.delete();
    }
}

/**Removes all base maps.*/
function removeAllBaseMaps() {
    removeBaseMap("MapBoxAerial");
    removeBaseMap("MapBoxStreets");
    removeBaseMap("MapQuestAerial");
    removeBaseMap("ColorBarTerrain1");
    removeBaseMap("ColorBarTerrain2");
}

function addRasterBaseMap(mapName, urlTemplate, subDomains){
    removeAllBaseMaps();
    //var internetTileProvider = new AltusUnified.InternetTileProvider(mapName, urlTemplate);
    
    var internetTileProvider = AltusUnified.InternetTileProvider.createFromURLWithSubdomainsAndFormat(
    mapName, urlTemplate, subDomains, false, AltusUnified.MapFormat.RASTER);
    
    var mapDesc = AltusUnified.VirtualMap.defaultRasterMapDesc();
    var newMap = new AltusUnified.VirtualMap(mapName, mapDesc, internetTileProvider);
    newMap.setPriority(10);
    AltusUnified.scene.addMap(newMap);
    
    //Clean up
    newMap.delete();
    mapDesc.delete();
    internetTileProvider.delete();
}

/**Enable a MapBox aerial imagery raster base map layer.*/
function setMapBoxAerialBaseMap() {
    addRasterBaseMap("MapBoxAerial", mapBoxAerialUrlTemplate, mapBoxSubDomainList);
};

/**Enable a MapBox street map imagery raster base map layer.*/
function setMapBoxStreetsBaseMap() {
    addRasterBaseMap("MapBoxStreets", mapBoxStreetsUrlTemplate, mapBoxSubDomainList);
};

/**Enable a Mapquest aerial imagery raster base map layer.*/
function setMapQuestAerialBaseMap() {
    addRasterBaseMap("MapQuestAerial", mapQuestAerialUrlTemplate, mapQuestSubDomainList);
};

function setColorbarTerrainBaseMap1(){
    addColorbarBaseMap("ColorBarTerrain1", terrain1BytePNGUrlTemplate, 5);
}

function setColorbarTerrainBaseMap2(){
    removeAllBaseMaps();
    var internetTileProvider = AltusUnified.InternetTileProvider.createFromURLWithSubdomainsAndFormat( "ColorBarTerrain2", terrain2BytePNGUrlTemplate, "", true, AltusUnified.MapFormat.VIRTUAL_TERRAIN);
    
    internetTileProvider.loadingInstructions().maxParentOffset = 20;
    
    var baseDesc = AltusUnified.VirtualMap.defaultShadedReliefMapDesc();
    baseDesc.priority = 20;
    
    var newMap = new AltusUnified.VirtualMap("ColorBarTerrain2", baseDesc, internetTileProvider);
    AltusUnified.scene.addMap(newMap);
    newMap.setMaxLevel(11);
    
    //clean up
    baseDesc.delete();
    newMap.delete();
    internetTileProvider.delete();
};

/*C3*/

/*C4*/
//Input helper functions

/**Use classic input handler*/
function useClassicInput() {
    resetCamera();
    var inputHandler = new AltusUnified.ClassicInputHandler(AltusUnified.scene);
    AltusUnified.inputManager.setRawInputHandler(inputHandler);
    inputHandler.delete();
};

/**Use the FreeAxis input handler, which allows you to move the camera using mouse gestures and keyboard modifiers.  Try holding down ctrl or shift when dragging the mouse.*/
function useFreeAxisInput() {
    resetCamera();
    var inputHandler = new AltusUnified.FreeAxisInputHandler(AltusUnified.scene);
    AltusUnified.inputManager.setRawInputHandler(inputHandler);
    inputHandler.delete();
};
/*C4*/

/*C5*/

/**Realistic lighting*/
function enableRealisticLighting() {
    AltusUnified.scene.atmospherics().setLightingType(AltusUnified.LightingType.REALISTIC);
};

/**Classic lighting*/
function enableClassicLighting() {
    AltusUnified.scene.atmospherics().setLightingType(AltusUnified.LightingType.CLASSIC);
};

/**Sun location set at a fix location.*/
function sunLocationAbsolute() {
    AltusUnified.scene.atmospherics().setSunLocationType(AltusUnified.LocationType.DIRECTION_ABSOLUTE);
};

/**Sun location offset from current camera location.*/
function sunLocationOffset() {
    AltusUnified.scene.atmospherics().setSunLocationType(AltusUnified.LocationType.DIRECTION_VIEW_OFFSET);
};

/**Sun location accurate to current time.*/
function sunLocationAccurate() {
    AltusUnified.scene.atmospherics().setSunLocationType(AltusUnified.LocationType.DIRECTION_ACCURATE);
};

/**Set sun location to be over a specific geographic point.*/
function setSunLocation(lat, lon) {
    var location = new AltusUnified.GeographicPosition2D(lat, lon);
    AltusUnified.scene.atmospherics().setSunLocation(location);
    location.delete();
};

/**Parses an int from a color hex string like #AABBCC.*/
function parseColor(colorString) {
    if(colorString.charAt(0)=="#"){
        var hexString = colorString.substring(1, colorString.length);
        if(hexString.length<8){
            hexString=hexString+"FF";
        }
        return parseInt(hexString, 16);
    }
    else{
        return parseInt(colorString,10);
    }
}

/**Change background color.*/
function setBackgroundColor(newColor) {
    var color = new AltusUnified.Color(parseColor(newColor));
    AltusUnified.scene.atmospherics().setBackgroundColor(color);
    color.delete();
}

/**Enable stars.*/
function setStarsEnabled(starsEnabled) {
    AltusUnified.scene.atmospherics().setStarsEnabled(starsEnabled);
}

/*C5*/

/*C6*/
/**Loads a 3D terrain layer using height data encoded as gray scale pngs.*/
function add3DTerrainLayer() {
    //Create the tile provider
    var internetTileProvider = new AltusUnified.InternetTileProvider.createFromURLWithSubdomainsAndFormat(
    "baseMapHeight",
    terrain2BytePNGUrlTemplate,
    "",
    true,
    AltusUnified.MapFormat.TERRAIN_HEIGHT);
    
    //Create the terrain map object
    var baseDesc = AltusUnified.VirtualMap.defaultTerrainMapDesc();
    var terrainMap = new AltusUnified.VirtualMap("terrain3D", baseDesc, internetTileProvider);
    
    //Add the terrain map
    AltusUnified.scene.addMap(terrainMap);
    
    //Disable tile biasing (to minimize the amount of data loaded)
    AltusUnified.scene.screen().setTileLevelBias(0);
    
    //Clean up
    terrainMap.delete();
    baseDesc.delete();
    internetTileProvider.delete();
}
/*C6*/

/*C7*/
/**Look down on Mt. Ranier*/
function lookDownAtMtRanier() {
    
    var lat = 46.852;           //Degrees latitude
    var lon = -121.731;         //Degrees longitude
    var altitude = 41888;       //Meters above sea level
    var roll = 0;               //Degrees (positive is clockwise)
    var pitch = 90;             //Degrees (positive is 'down')
    var yaw =   0;              //Degrees (positive is clockwise)
    
    //Create a new position
    var pos = new AltusUnified.GeographicPosition(lat, lon, altitude);
    
    //Create a new orientation
    var orientation = new AltusUnified.Orientation(0, 90, 0);
    
    //Scale is needed to construct a transform, but not used by the camera
    var scale = new AltusUnified.vec3d(1, 1, 1);
    
    //Create a new transform
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    
    //Set the camera's transform
    AltusUnified.scene.camera().transform.set(trans);
    
    //Clean up
    pos.delete();
    orientation.delete();
    scale.delete();
}
/*C7*/

/*C8*/
//Look horizontally at Mt. Ranier from a position south of it
function lookHorizontallyAtMtRanier() {
    
    var lat = 46.630;           //Degrees latitude
    var lon = -121.756;         //Degrees longitude
    var altitude = 5131;        //Meters above sea level
    var roll = 0;               //Degrees (positive is clockwise)
    var pitch = 90;             //Degrees (positive is 'down')
    var yaw =   0;              //Degrees (positive is clockwise)
    
    //Create a new position
    var pos = new AltusUnified.GeographicPosition(lat, lon, altitude);
    
    //Create a new orientation
    var orientation = new AltusUnified.Orientation(0, 0, 0);
    
    //Scale is needed to construct a transform, but not used by the camera
    var scale = new AltusUnified.vec3d(1, 1, 1);
    
    //Create a new transform
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    
    //Set the camera's transform
    AltusUnified.scene.camera().transform.set(trans);
    
    //Clean up
    pos.delete();
    orientation.delete();
    scale.delete();
}
/*C8*/

/*C9*/
//Look towards the North pole with a horizontal pitch
function lookNorth() {
    
    //Get the current geographic position and scale
    var pos = AltusUnified.scene.camera().transform.geographicPosition();
    
    //Create a new orientation
    var roll = 0;
    var pitch = 0;
    var yaw = 0;
    var orientation = new AltusUnified.Orientation(roll, pitch, yaw);
    
    //Scale is needed to construct a transform, but not used by the camera
    var scale = new AltusUnified.vec3d(1, 1, 1);
    
    //Create a new transform
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    
    //Set the camera's transform
    AltusUnified.scene.camera().transform.set(trans);
    
    //Clean up
    pos.delete();
    orientation.delete();
    scale.delete();
}
/*C9*/

/*C10*/
//To a vector, 'pushes' an array of elements
function pushToVector(vector, array){
    var size = array.length;
    for (i = 0; i < size; i++) {
        vector.push_back(array[i]);
    }
}
/*C10*/

/*C11*/
//From a vector, 'deletes' an array of elements
function deleteElements(array){
    var size = array.length;
    for (var i = 0; i < size; i++) {
        array[i].delete();
    }
    array.length = 0;
}
/*C11*/

/*C12*/
//Creates a 1x1 pixel texture with the given color values
function createTexture(alphaValue, blueValue, greenValue, redValue){
    
    //Create a vector of bytes to hold color values
    var abgrData = new AltusUnified.VectorByte();
    abgrData.push_back(alphaValue);
    abgrData.push_back(blueValue);
    abgrData.push_back(greenValue);
    abgrData.push_back(redValue);
    
    //Create image from color data
    var image = new AltusUnified.Image(1, 1, abgrData);
    
    //Create texture from image
    var texture = new AltusUnified.Texture(image, false);
    
    //Clean up
    abgrData.delete();
    image.delete();
    
    return texture;
}
/*C12*/

/*C13*/
//Creates a cube mesh.
//NOTE: This approach has now been superceded by AltusUnified.Mesh.createCubeMesh.
//It is left here as an example of how to create a model using vertices.
function createCubeMesh(red, green, blue){
    
    //Create cube vertex buffer
    var vectorOfModelVertex = new AltusUnified.VectorModelVertex();
    var vertexBufferData = [
    new AltusUnified.ModelVertex(-1,  1, -1,  0,  1,  0,  0, 0), // top
    new AltusUnified.ModelVertex(1,  1, -1,  0,  1,  0,  1, 0),
    new AltusUnified.ModelVertex(-1,  1,  1,  0,  1,  0,  0, 1),
    new AltusUnified.ModelVertex(1,  1,  1,  0,  1,  0,  1, 1),
    
    new AltusUnified.ModelVertex(-1, -1, -1,  0, -1,  0,  0, 0), // bottom
    new AltusUnified.ModelVertex(1, -1, -1,  0, -1,  0,  1, 0),
    new AltusUnified.ModelVertex(-1, -1,  1,  0, -1,  0,  0, 1),
    new AltusUnified.ModelVertex(1, -1,  1,  0, -1,  0,  1, 1),
    
    new AltusUnified.ModelVertex(1,  1, -1,  1,  0,  0,  0, 0), // right
    new AltusUnified.ModelVertex(1, -1, -1,  1,  0,  0,  1, 0),
    new AltusUnified.ModelVertex(1,  1,  1,  1,  0,  0,  0, 1),
    new AltusUnified.ModelVertex(1, -1,  1,  1,  0,  0,  1, 1),
    
    new AltusUnified.ModelVertex(-1,  1, -1, -1,  0,  0,  0, 0), // left
    new AltusUnified.ModelVertex(-1, -1, -1, -1,  0,  0,  1, 0),
    new AltusUnified.ModelVertex(-1,  1,  1, -1,  0,  0,  0, 1),
    new AltusUnified.ModelVertex(-1, -1,  1, -1,  0,  0,  1, 1),
    
    new AltusUnified.ModelVertex(-1, -1, -1,  0,  0, -1,  0, 0), // front
    new AltusUnified.ModelVertex(1, -1, -1,  0,  0, -1,  1, 0),
    new AltusUnified.ModelVertex(-1,  1, -1,  0,  0, -1,  0, 1),
    new AltusUnified.ModelVertex(1,  1, -1,  0,  0, -1,  1, 1),
    
    new AltusUnified.ModelVertex(-1, -1,  1,  0,  0,  1,  0, 0), // back
    new AltusUnified.ModelVertex(1, -1,  1,  0,  0,  1,  1, 0),
    new AltusUnified.ModelVertex(-1,  1,  1,  0,  0,  1,  0, 1),
    new AltusUnified.ModelVertex(1,  1,  1,  0,  0,  1,  1, 1)];
    
    pushToVector(vectorOfModelVertex, vertexBufferData);
    
    //Create cube index buffer
    var vectorOfGLushort = new AltusUnified.VectorGLushort();
    var indexBufferdata =[
    0,2,1,1,2,3,       // top
    4,5,7,4,7,6,       // bottom
    8,10,9,9,10,11,    // right
    14,12,13,14,13,15, // left
    16,18,17,17,18,19, // front
    20,21,22,22,21,23];
    pushToVector(vectorOfGLushort, indexBufferdata);
    
    //Create a red texture
    var texture = createTexture(red, green, blue, 255);
    
    //Create mesh from vertex buffer, index buffer, and texture
    var mesh = new AltusUnified.Mesh(vectorOfModelVertex, vectorOfGLushort, texture);
    
    //Clean up
    texture.delete();
    deleteElements(vectorOfModelVertex);
    deleteElements(vectorOfGLushort);
    vectorOfModelVertex.delete();
    vectorOfGLushort.delete();
    
    return mesh;
}
/*C13*/

/*C14*/
function createCubeModel(cubeName, red, green, blue){
    var texture = createTexture(red, green, blue, 255);
    var cubeModel = new AltusUnified.Model(cubeName, AltusUnified.Mesh.createCubeMesh(texture));
    texture.delete();
    return cubeModel;
}
/*C14*/

/*C15*/
function createTransform(lat, lon, alt, scale){
    var position = new AltusUnified.GeographicPosition(lat, lon, alt);
    var orientation = new AltusUnified.Orientation(0, 0, 0);
    var scale = new AltusUnified.vec3d(scale, scale, scale);
    var transform = new AltusUnified.Transform(position, orientation, scale);
    
    //Clean up
    scale.delete();
    orientation.delete();
    position.delete();
    
    return transform;
}
/*C15*/

/*C16*/
//Create and add a model layer
function addModelLayer(layerName){
    var modelMap = new AltusUnified.ModelMap(layerName);
    AltusUnified.scene.addMap(modelMap);
    modelMap.delete();
}
/*C16*/

/*C17*/
//Create and add a cube model to the specified layer
function addCube(layerName, cubeName, lat, lon, alt, scale, red, green, blue){
    
    var modelMap = AltusUnified.scene.findMap(layerName);
    if (modelMap == null){
        return;
    }
    
    //Create a cube model
    var cubeModel = createCubeModel(cubeName, red, green, blue);
    
    //Add cube to map layer
    modelMap.addModel(cubeModel);
    
    //Create a transform to set location and scale of cube
    var trans = createTransform(lat, lon, alt, scale);
    var modelTrans = cubeModel.transform();
    modelTrans.set(trans);
    
    //Animate the cube (rotate it about it's axis)
    var worldPosition = modelTrans.worldPosition();
    var upVector = modelTrans.up();
    AltusUnified.scene.animationManager().orbitAroundAxis(modelTrans, worldPosition, upVector, 3, 1, 0);
    
    //Clean up
    upVector.delete();
    worldPosition.delete();
    modelTrans.delete();
    modelMap.delete();
}
/*C17*/

/*C18*/
function lookAtModel() {
    
    var lat = 46.49;           //Degrees latitude
    var lon = -121.05;         //Degrees longitude
    var altitude = 21963;        //Meters above sea level
    var roll = 0;               //Degrees (positive is clockwise)
    var pitch = 7;             //Degrees (positive is 'down')
    var yaw =   -44;              //Degrees (positive is clockwise)
    
    //Create a new position
    var pos = new AltusUnified.GeographicPosition(lat, lon, altitude);
    
    //Create a new orientation
    var orientation = new AltusUnified.Orientation(roll, pitch, yaw);
    
    //Scale is needed to construct a transform, but not used by the camera
    var scale = new AltusUnified.vec3d(1, 1, 1);
    
    //Create a new transform
    var trans = new AltusUnified.Transform(pos, orientation, scale);
    
    //Set the camera's transform
    //Note that we could also use transform.lookAt(vec3d worldPosition, vec3d up) to look at the model without hard-coding roll, pitch, and yaw
    AltusUnified.scene.camera().transform.set(trans);
    
    //Clean up
    pos.delete();
    orientation.delete();
    scale.delete();
}
/*C18*/

/*C19*/
//Creates a square image with the given dimensions and colors
function squareImage(width, height, red, green, blue, alpha){
    var arr = new AltusUnified.VectorByte();
    for (i = 0; i < width * height; i += 1) {
        arr.push_back(red);
        arr.push_back(green);
        arr.push_back(blue);
        arr.push_back(alpha);
    }
    var image = new AltusUnified.Image(width, height, arr);
    arr.delete();
    return image;
}
/*C19*/

/*C20*/
//Converts an image to a texture
function textureFromImage(image){
    var tex = new AltusUnified.Texture(image, false);
    return tex;
}
/*C20*/

/*C21*/
//Returns a square texture with the given dimensions and colors
function squareTexture(width, height, red, green, blue, alpha){
    var image = squareImage(width, height, red, green, blue, alpha);
    var tex = textureFromImage(image);
    image.delete();
    return tex;
}
/*C21*/

/*C22*/
//Returns a populated MarkerData object
function createMarkerData(uid, lat, lon, alt, weight, minLevel, metaData, texture, anchorX, anchorY){
    var markerData = new AltusUnified.MarkerData(uid, lat, lon, alt, weight, metaData, texture);
    markerData.minimumLevel = minLevel;
    var anchorPoint = new AltusUnified.vec2d(anchorX, anchorY);
    markerData.anchorPoint_set(anchorPoint);
    anchorPoint.delete();
    return markerData;
}
/*C22*/

/*C23*/
//Returns a clustered marker map object
function createClusteredMarkerMap(name, markers, clusterDistance, maxLevel, targetImageFormat, hitTestingEnabled){
    var markerMap = new AltusUnified.ClusteredMarkerMap(name, markers, clusterDistance, maxLevel, targetImageFormat, hitTestingEnabled);
    return markerMap;
}
/*C23*/

/*C25*/
function imageFromCanvas(canvas){
    var context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var imageBytes = new Uint8Array(imageData.data);
    var vectorOfBytes = new AltusUnified.VectorByte();
    pushToVector(vectorOfBytes, imageBytes);
    var image = new AltusUnified.Image(canvas.width, canvas.height, vectorOfBytes);
    vectorOfBytes.delete();
    return image;
}
/*C25*/

/*C26*/
function textureFromCanvas(canvas){
    var image = imageFromCanvas(canvas);
    var texture = textureFromImage(image);
    image.delete();
    return texture;
}
/*C26*/

/*C27*/
function createLabelCanvas(fontSize, fontName, fontBold, labelText){
    
    var textFillColor = "#FFFFFF";
    var textStrokeColor = "#000000"
    var textShadowColor = "#000000";
    var shadowBlur = 2;
    var shadowOffsetX = 0;
    var shadowOffsetY = 0;
    var outlineWidth = 3;
    
    //Create font string
    var fontString = "";
    if(fontBold) fontString="bold ";
    fontString= fontString + fontSize + "px " + fontName;
    
    //Create a canvas
    var canvas = document.createElement('canvas');
    
    //Configure the context
    var ctx = canvas.getContext("2d");
    ctx.font = fontString;
    ctx.fillStyle=textFillColor;
    ctx.strokeStyle = textStrokeColor;
    ctx.shadowColor = textShadowColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    ctx.shadowBlur = shadowBlur;
    ctx.imageSmothingEnabled = true;
    ctx.lineWidth = outlineWidth;
    ctx.textBaseline = "bottom";
    ctx.miterLimit=2;
    
    //Get the width the text will be
    var textWidth = ctx.measureText(labelText).width;
    
    //Create device-scaled width and height values for the canvas
    var cwidth = textWidth + shadowOffsetX + shadowBlur + outlineWidth;
    var cheight = fontSize + shadowOffsetY + shadowBlur + outlineWidth;
    
    //Resize canvas
    canvas.width = cwidth;
    canvas.height = cheight;
    
    //Reconfigure the context since it changes when you change the canvas size
    ctx = canvas.getContext("2d");
    ctx.font = fontString;
    ctx.fillStyle=textFillColor;
    ctx.strokeStyle = textStrokeColor;
    ctx.shadowColor = textShadowColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    ctx.shadowBlur = shadowBlur;
    ctx.imageSmothingEnabled = true;
    ctx.lineWidth = outlineWidth;
    ctx.textBaseline = "bottom";
    ctx.miterLimit=2;
    
    var outlineSide = (shadowBlur + outlineWidth) / 2;
    
    //Draw the text outline and shadow
    ctx.strokeText(labelText, 0 + outlineSide, canvas.height - outlineSide);
    
    //Draw the filled text
    ctx.fillText(labelText, 0 + outlineSide, canvas.height - outlineSide);
    
    return canvas;
}
/*C27*/

/*C28*/
function createLabelImage(fontSize, fontName, fontBold, labelText){
    var canvas = createLabelCanvas(fontSize, fontName, fontBold, labelText);
    return imageFromCanvas(canvas);
}
/*C28*/

/*C29*/
function createLabelTexture(fontSize, fontName, fontBold, labelText){
    var canvas = createLabelCanvas(fontSize, fontName, fontBold, labelText);
    return textureFromCanvas(canvas);
}
/*C29*/

/*C30*/
function addTextLabelToMarker(markerInfo, fontSize, fontName, fontBold, labelText){
    //degrees = Math.rand();
    
    var markerData = markerInfo.markerData();
    markerData.rotation=0;
    
    //Create text label image
    var labelImage = createLabelImage(fontSize, fontName, fontBold, labelText);
    
    //Set text label image
    markerInfo.image_set(labelImage);
    
    //Calculate anchor point
    var anchorPoint = new AltusUnified.vec2d(labelImage.width/2.0, labelImage.height/2.0);
    
    //Set the anchor point
    markerData.anchorPoint_set(anchorPoint);
    
    //Clean up
    anchorPoint.delete();
    labelImage.delete();
}
/*C30*/

function getReadyStateMsg(readyState){
    if(readyState == XMLHttpRequest.DONE) return "Unsent";
    if(readyState == XMLHttpRequest.OPENED) return "Opened";
    if(readyState == XMLHttpRequest.HEADERS_RECEIVED) return "Headers received";
    if(readyState == XMLHttpRequest.LOADING) return "Loading";
    if(readyState == XMLHttpRequest.DONE) return "Done";
}

/*C31*/
function downloadAndParseJSON(path, success, error) {
    var msg = "downloadAndParseJSON: " + path + ": ";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        console.log(msg + getReadyStateMsg(xhr.readyState));
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                try{
                    var jsonData = JSON.parse(xhr.responseText);
                    success(jsonData);
                }
                catch(err){
                    console.log(msg + " Error: " + err + ".");
                }
            } else {
                console.log(msg + " failed. status = " + xhr.status);
                if (error){
                    error(xhr);
                }
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}
/*C31*/

/*C32*/
function addMarkerLayer(layerName, fontSize, maxLevel, clusterDistance, markerData){
    
    //Returns a vector of marker data from an array of marker data objects having:
    //m: marker metadata
    //y: marker latitude
    //x: marker longitude
    //w: marker weight
    
    var markers = new AltusUnified.VectorMarkerData();
    for(i=0; i<markerData.length; i++){
        var metaData = markerData[i].m;
        var lat = markerData[i].y;
        var lon = markerData[i].x;
        var alt = 0;
        var weight = markerData[i].w;
        var minLevel = markerData[i].ml;
        marker = createMarkerData(i, lat, lon, alt, weight, minLevel, metaData, null, 0, 0);
        markers.push_back(marker);
        marker.delete();
    }
    
    //Prototype for a marker map delegate
    var StringMarkerMapDelegate = AltusUnified.IMarkerMapDelegate.extend("IMarkerMapDelegate", {
        
        //Called if user clicks or taps a marker
        onMarkerTapped: function (marker, screenPoint, markerPoint, mapName) {
            console.log("onMarkerTapped: " + marker.metadata);
        },
        
        //Called if user clicks or taps a marker
        onMarkersTapped: function (markerHits) {
        },

        //Called if a marker image is needed (i.e. one is not supplied with the marker data)
        getMarkerImage: function (markerInfo, mapName) {
            if (markerInfo.textureCreatedOnMainThread == null) {
                var labelText = markerInfo.markerData().metadata;
                var minLevel = markerInfo.markerData().minimumLevel;
                var fSize = fontSize;
                var fontName = "Arial, Helvetica, sans-serif";
                var fontBold = false;
                addTextLabelToMarker(markerInfo, fSize, fontName, fontBold, labelText)
            }
        },
        phrase : "phrase"
    });
    
    //Create the clustered marker layer
    var markerMap = createClusteredMarkerMap(layerName, markers, clusterDistance, maxLevel, AltusUnified.TargetImageFormat.FOUR_BPP, false);
    
    //Create and assign the delegate
    var delegate = new StringMarkerMapDelegate();
    delegate.phrase = "marker";
    markerMap.setDelegate(delegate);
    
    //Enable hit testing
    markerMap.setHitTestingEnabled(true);
    
    //Add the clustered marker map layer
    AltusUnified.scene.addMap(markerMap);
    
    //Set the z order of the layer above everything else
    markerMap.setOrder(1000);
    
    //Clean up
    markers.delete();
    markerMap.delete();
    delegate.delete();
}
/*C32*/

/*C33*/
function loadMarkerLayer(layerName, fontSize, maxLevel, clusterDistance){
    downloadAndParseJSON(layerName+".json",
    function(data){
        addMarkerLayer(layerName, fontSize, maxLevel, clusterDistance, data);
    },
    function(xhr) {
        console.log("Error downloading JSON data: " + xhr.err)
    }
    );
}
/*C33*/

/*C34*/
function addPlacesClusteredMarkerLayer(){
    loadMarkerLayer("Places", 16, 14, 80);
}
/*C34*/

/*C35*/
//Creates markers with random locations and weights. Returns them in an AltusUnified.VectorMarkerData object.
function createRandomMarkers(markerCount, markerWidth, markerHeight){
    
    //Extents markers will appear on planet
    var minX = -180;
    var maxX = 180;
    var maxY = 80;
    var minY = -80;
    
    //Create some color square textures for markers
    var redTexture = squareTexture(markerWidth, markerHeight, 255, 0, 0, 255);
    var greenTexture = squareTexture(markerWidth, markerHeight, 0, 255, 0, 255);
    var blueTexture = squareTexture(markerWidth, markerHeight, 0, 0, 255, 255);
    
    //Create a vector of markers we'll be returning
    var markers = new AltusUnified.VectorMarkerData();
    
    for(i = 0; i<markerCount; i++){
        var lon = minX + Math.random() * (maxX-minX);
        var lat = minY + Math.random() * (maxY-minY);
        var alt = 0;
        var weight=Math.random() * 100;
        var minLevel=0;
        var metaData="Marker "+i;
        var texture = blueTexture;
        if(weight>33) texture = greenTexture;
        if(weight>66) texture = redTexture;
        var marker;
        if(weight>70){
            marker = createMarkerData(i, lat, lon, alt, weight, minLevel, metaData, texture, markerWidth/2, markerHeight/2);
        }
        else{
            marker = createMarkerData(i, lat, lon, alt, weight, minLevel, metaData, texture, markerWidth/2, markerHeight/2);
        }
        markers.push_back(marker);
        marker.delete();
    }
    
    //Clean up
    redTexture.delete();
    greenTexture.delete();
    blueTexture.delete();
    
    return markers;
}
/*C35*/

/*C36*/
//Adds a layer of randomly place markers represented by colored squares
function addRandomClusteredMarkerLayer(layerName, markerCount, zOrder){
    
    console.log("Adding " + layerName + " with " + markerCount + " markers.");
    //Variables to conveniently change the clustered marker layer
    var markerWidth = 16;
    var markerHeight = 16;
    var maxLevel = 20;
    var clusterDistance = 30;
    
    //Prototype for a marker map delegate
    var StringMarkerMapDelegate = AltusUnified.IMarkerMapDelegate.extend("IMarkerMapDelegate", {
        
        //Called if user clicks or taps a marker
        onMarkerTapped: function (marker, screenPoint, markerPoint, mapName) {
            console.log("onMarkerTapped: " + marker.metadata);
        },
        
        //Called if user clicks or taps a marker
        onMarkersTapped: function (markerHits) {
        },

        //Called if a marker image is needed (i.e. one is not supplied with the marker data)
        getMarkerImage: function (markerInfo, mapName) {
            if (markerInfo.textureCreatedOnMainThread == null) {
                var labelText = markerInfo.markerData().metadata;
                var fontSize = 19;
                var fontName = "Arial, Helvetica, sans-serif";
                var fontBold = false;
                addTextLabelToMarker(markerInfo, fontSize, fontName, fontBold, labelText)
            }
        },
        phrase : "phrase"
    });
    
    //Create a set of markers
    var markers = createRandomMarkers(markerCount, markerWidth, markerHeight);
    
    //Create the clustered marker layer
    var markerMap = createClusteredMarkerMap(layerName, markers, clusterDistance, maxLevel, AltusUnified.TargetImageFormat.FOUR_BPP, false);
    
    //Create and assign the delegate
    var delegate = new StringMarkerMapDelegate();
    delegate.phrase = "marker";
    markerMap.setDelegate(delegate);
    
    //Enable hit testing
    markerMap.setHitTestingEnabled(true);
    
    //Add the clustered marker map layer
    AltusUnified.scene.addMap(markerMap);
    
    //Set the z order of the layer above everything else
    markerMap.setOrder(zOrder);
    
    //Clean up
    markers.delete();
    markerMap.delete();
    delegate.delete();
    console.log("done");
}
/*C36*/

/*C37*/
function mapIsLoaded(mapName){
    var map = AltusUnified.scene.findMap(mapName);
    if (map != null) {
        map.delete();
        return true;
    }
    return false;
};
/*C37*/

/*
 function updateVectorMapColors(){
 }
 
 function vectorMap(){
 var tilesUrl = "http://airmap.ba3.us/map/{z}/{x}/{y}.dat";
 
 var internetTileProvider = new .InternetTileProvider("baseMap", tilesUrl);
 
 // create map description
 var mapDesc = altus.VirtualMap.defaultVectorMapDesc();
 //mapDesc.streamType = altus.StreamType.HIGHEST_DETAIL_ONLY;
 //mapDesc.maxLevel = 5;
 
 internetTileProvider.loadingInstructions().maxParentOffset = 20;
 var loadInstructions = new altus.VectorInt();
 internetTileProvider.loadingInstructions().loadOrder_set(loadInstructions);
 baseMap = new altus.VirtualMap("baseMap", mapDesc, internetTileProvider);
 loadInstructions.delete();
 
 // add map to scene
 scene.addMap(baseMap);
 baseMap.setOrder(baseMapOrder);
 
 updateMapColors();
 
 mapDesc.delete();
 internetTileProvider.delete();
 }
 */

//Returns the bytes of an image
function getImageData(image){
    var canvas = createCanvas(image.width,image.height);
    var context = canvas.getContext("2d");
    context.clearRect(0,0,image.width,image.height);
    context.drawImage(image, 0, 0);
    var imgd = context.getImageData(0, 0, image.width, image.height);
    var imgbytes = new Uint8Array(imgd.data);
    return imgbytes;
}

/*C38*/
/**
 Adds a cylinder to a model layer.
 */
function addCylinder(layerName, cylinderName, segmentCount, lat, lon, alt, scale, red, green, blue, alpha){
    
    //Find the map
    var modelMap = AltusUnified.scene.findMap(layerName);
    if (modelMap == null){
        return;
    }
    
    //Create a cylinder model with a texture based on the colors passed in
    var texture = createTexture(red, green, blue, alpha);
    var cylinderModel = new AltusUnified.Model(cylinderName, AltusUnified.Mesh.createCylinderMesh(segmentCount, texture));
    
    //Add cube to map layer
    modelMap.addModel(cylinderModel);
    
    //Create a transform to set location and scale of cube
    var trans = createTransform(lat, lon, alt, scale);
    var modelTrans = cylinderModel.transform();
    modelTrans.set(trans);
    
    //Clean up
    cylinderModel.delete();
    texture.delete();
    modelTrans.delete();
    modelMap.delete();
}
/*C38*/


function enablePlaceLabels(enabled){
    var layerName = "Places"
    
    //Remove existing map without clearing cache
    var map = AltusUnified.scene.findMap(layerName);
    if (map != null) {
        AltusUnified.scene.removeMap(map, false);
        map.delete();
    }
    
    if(enabled){
        removeMap(layerName);
        loadMarkerLayer(layerName, 16, 14, 80);
    }
}

function enableTerrainHeightLayer(enabled) {
    var layerName = "TerrainHeight";
    
    //Remove existing map without clearing cache
    var map = AltusUnified.scene.findMap(layerName);
    if (map != null) {
        AltusUnified.scene.removeMap(map, false);
        map.delete();
    }
    
    if(enabled){
        //Create the tile provider
        var internetTileProvider = new AltusUnified.InternetTileProvider.createFromURLWithSubdomainsAndFormat(
        layerName,
        terrain2BytePNGUrlTemplate,
        "",
        true,
        AltusUnified.MapFormat.TERRAIN_HEIGHT);
        
        //Create the terrain map object
        var baseDesc = AltusUnified.VirtualMap.defaultTerrainMapDesc();
        var terrainMap = new AltusUnified.VirtualMap(layerName, baseDesc, internetTileProvider);
        
        //Add the terrain map
        AltusUnified.scene.addMap(terrainMap);
        
        //Disable tile biasing (to minimize the amount of data loaded)
        AltusUnified.scene.screen().setTileLevelBias(0);
        
        //Clean up
        terrainMap.delete();
        baseDesc.delete();
        internetTileProvider.delete();
    }
}

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

function createTextureFromXhrResponse(response) {
    var byteArray  = new Uint8Array(response);
    var vectorByte    = new AltusUnified.VectorByte();
    var altusImage = new AltusUnified.Image();

    pushToVector(vectorByte, byteArray);

    altusImage.loadFromMemory(vectorByte);
    altusImage.multiplyAlpha();

    texture = new AltusUnified.Texture(altusImage, false);

    vectorByte.delete();
    altusImage.delete();

    return texture;
}

function enableAltusVerboseMessages(enabled){
    var diagnostics = AltusUnified.scene.diagnostics();
    diagnostics.setVerboseMessagesEnabled(enabled);
    diagnostics.delete();
}