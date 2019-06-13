/*C1*/

//Demonstrates how to implement a tile provider that downloads
//raster images from a WMS server

/**Helper function for logging messages.*/
function logMessage(msg){
    console.log("WMSTileProvider: " + msg);
}


/**
Extends AltusUnified.ITileProvider and downloads raster imagery from a WMS server.
*/
var WMSTileProvider = AltusUnified.ITileProvider.extend("ITileProvider", {
    wmsURL: "",
    wmsVersion: "1.3.0",
    wmsService: "WMS",
    wmsLayers: "",
    wmsSRS: "",
    wmsCRS: "",
    wmsFormat: "image/png",
    useWMSStyle: false,
    isTransparent: true,
    wmsStyleString: "",
    convertTo3857: false,
    mapGeoBounds: null,
    mapBounds: null,
    requestedTiles:[],
    downloadsInProgress:0,
    maxSimultaneousDownloads:5,
    
    setGeoBounds: function(geoBounds){
        this.mapGeoBounds=geoBounds;
        this.mapBounds=geoBounds.toBoundingBox();
    },
    
    urlForRequest: function (request){
        var httpRequest = "";
        httpRequest += this.wmsURL;
        httpRequest += "?VERSION="+this.wmsVersion;
        httpRequest += "&SERVICE="+this.wmsService;
        httpRequest += "&REQUEST=GetMap";
        httpRequest += "&LAYERS="+this.wmsLayers;
        httpRequest += "&FORMAT="+this.wmsFormat;
        if(this.useWMSStyle){
            httpRequest += "&styles="+this.wmsStyleString;
        }
        if(this.wmsVersion=="1.3.0"){
            httpRequest += "&CRS="+this.wmsCRS;
        }
        else{
            httpRequest += "&SRS="+this.wmsSRS;
        }
        
        if(this.isTransparent){
            httpRequest += "&TRANSPARENT=True";
        }
        
        var uid = request.getId_LowHigh();
        var tileId = new AltusUnified.TileId(uid);
        var bounds = null;
        bounds = tileId.getBounds();
        if(Math.abs(bounds.min().x) < 0.001) bounds.min().x=0;
        if(Math.abs(bounds.min().y) < 0.001) bounds.min().y=0;
        if(Math.abs(bounds.max().x) < 0.001) bounds.max().x=0;
        if(Math.abs(bounds.max().y) < 0.001) bounds.max().y=0;
        
        var bbox="";
        if(this.convertTo3857){
            var epsg3857 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
            var sw = proj4(epsg3857).forward([bounds.min().x, bounds.min().y]);
            var ne = proj4(epsg3857).forward([bounds.max().x, bounds.max().y]);
            bbox = "&BBOX=" + sw[0] + "," + sw[1] + "," + ne[0] + "," + ne[1];
        }
        else{
            bbox= "&BBOX=" + bounds.min().x + "," + bounds.min().y + "," + bounds.max().x + "," + bounds.max().y
        }
        
        httpRequest += bbox;
        
        httpRequest += "&WIDTH=256";
        httpRequest += "&HEIGHT=256";
        
        bounds.delete();
        tileId.delete();
        uid.delete();
        
        return httpRequest;
    },
    
    //Creates and XML http request that is CORS compatible
    createCORSRequest: function(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr){
            // Most browsers.
            xhr.open(method, url, true);
        }
        else if (typeof XDomainRequest != "undefined") {
            // IE8 & IE9
            xhr = new XDomainRequest();
            xhr.open(method, url);
        }
        else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    },
    
    downloadImage: function (wmsTileProvider, request, loader) {
        wmsTileProvider.isDownloading = true;
        var url = wmsTileProvider.urlForRequest(request);
        //logMessage("Getting " + url);
		var xhr = this.createCORSRequest('GET', url);
        if(xhr==null){
            logMessage("Could not create XMLHttrRequest for " + url);
            request.tileProviderResponse = AltusUnified.TileProviderResponse.NOT_AVAILABLE;
            loader.tileLoadComplete(request);
            request.delete();
            loader.delete();
            wmsTileProvider.doWork(wmsTileProvider);
        }
		xhr.timeout = 10000; //ms
		xhr.responseType = 'arraybuffer';
        
        //Handle download timeouts
		xhr.ontimeout = function xhr_ontimeout() {
            logMessage("Download timed out for " + url);
            //Set response to unknown so it will be requested again in the future
            request.tileProviderResponse = AltusUnified.TileProviderResponse.UNKNOWN_RESPONSE;
            loader.tileLoadComplete(request);
            request.delete();
            loader.delete();
            wmsTileProvider.downloadsInProgress--;
            wmsTileProvider.doWork(wmsTileProvider);
		};
        
        //Handle successful downloads
		xhr.onload = function xhr_onload() {
			if (xhr.status == 200 && xhr.response) {
            
                //Is the image still needed?
                if(!loader.tileIsNeeded(request)){
                    request.tileProviderResponse = AltusUnified.TileProviderResponse.WAS_CANCELLED;
                    loader.tileLoadComplete(request);
                }
                //If so, decompress the image and serve it up
                else{
                    //Convert downloaded bytes to image
                    var byteArray = new Uint8Array(xhr.response);
                    var vectorOfBytes = new AltusUnified.VectorByte();
                    for (var i = 0; i < byteArray.length; i++) {
                        vectorOfBytes.push_back(byteArray[i]);
                    }
                    var image = new AltusUnified.Image();
                    image.loadFromMemory(vectorOfBytes);
                    vectorOfBytes.delete();
                    request.image_set(image);
                    request.tileProviderResponse = AltusUnified.TileProviderResponse.IMAGE_DATA;
                    loader.tileLoadComplete(request);
                    image.delete();
                }
    
			} else {
                logMessage("Download failed: Status: " + xhr.status + " for " + url);
                request.tileProviderResponse = AltusUnified.TileProviderResponse.NOT_AVAILABLE;
                loader.tileLoadComplete(request);
			}
            
            //Clean up
            request.delete();
            loader.delete();
            wmsTileProvider.downloadsInProgress--;
            wmsTileProvider.doWork(wmsTileProvider);
		};
        
        //Handle other errors
		xhr.onerror = function xhr_onerror(e) {
            logMessage("Error: " + e + " for " + url);
            request.tileProviderResponse = AltusUnified.TileProviderResponse.UNKNOWN_RESPONSE;
            loader.tileLoadComplete(request);
            request.delete();
            loader.delete();
            wmsTileProvider.downloadsInProgress--;
            wmsTileProvider.doWork(wmsTileProvider);
		};
        
        //Send the download request
        wmsTileProvider.downloadsInProgress++;
		xhr.send(null);
	},
    
    containsRequestedData: function(request){
        var uid = request.getId_LowHigh();
        var tileId = new AltusUnified.TileId(uid);
        var bounds = tileId.getBounds();
        var containsData = this.mapBounds.contains(bounds);
        if(!containsData){
            //logMessage("Source map does not contain (" + bounds.min().x + "," + bounds.min().y + ") - (" + bounds.max().x+"," + bounds.max().y+")");
        }
        bounds.delete();
        tileId.delete();
        uid.delete();
        return containsData;
    },
    
    purgeUnneededRequests: function(wmsTileProvider){
        var requiredTiles = [];
        for (var i = 0; i < wmsTileProvider.requestedTiles.length; i++) {
            var requestData = wmsTileProvider.requestedTiles[i];
            var loader = requestData.loader;
            var request = requestData.request;
            var isNeeded = false;
            try{
                isNeeded = loader.tileIsNeeded(request);
                if(!isNeeded){
                    logMessage("Purging un-needed tile.");
                    request.tileProviderResponse = AltusUnified.TileProviderResponse.WAS_CANCELLED;
                    loader.tileLoadComplete(request);
                    loader.delete();
                    request.delete();
                }
                else{
                    requiredTiles.push(requestData);
                }
            }
            catch(err){
                //The map is likely unloaded, do nothing
            }
            
            
        }
        wmsTileProvider.requestedTiles = requiredTiles;
    },
    
    doWork:function(wmsTileProvider){
        wmsTileProvider.purgeUnneededRequests(wmsTileProvider);
         //logMessage("There are " + wmsTileProvider.downloadsInProgress + " WMS server downloads in progress.");
        if(wmsTileProvider.requestedTiles.length==0){
            return;
        }
        if(wmsTileProvider.downloadsInProgress >= wmsTileProvider.maxSimultaneousDownloads){
            return;
        }
        else{
            var requestData = wmsTileProvider.requestedTiles.pop();
            wmsTileProvider.downloadImage(wmsTileProvider, requestData.request, requestData.loader);
            //logMessage("There are " + wmsTileProvider.downloadsInProgress + " WMS server downloads in progress.");
        }
    },
    
   
    requestTileAsync: function (request, loader){
        //If the source data does not contain the requested tile, say it isn't available
        if(!this.containsRequestedData(request)){
            request.tileProviderResponse = AltusUnified.TileProviderResponse.NOT_AVAILABLE;
            loader.tileLoadComplete(request);
        }
        //Otherwise, kick off a download for the request
        else{
            var requestData = { request: request.duplicate(), loader: loader.duplicate() };
            this.requestedTiles.push(requestData);
            this.doWork(this);
        }
    }
});

function addWMSRasterLayer(mapName, wmsTileProvider, zOrder, alpha){

    removeMap(mapName);

    //Create map description object
    var mapDesc = AltusUnified.VirtualMap.defaultRasterMapDesc();
    mapDesc.bounds_set(wmsTileProvider.mapGeoBounds);
    
    //Create map object
    var newMap = new AltusUnified.VirtualMap(mapName, mapDesc, wmsTileProvider);
    
    //Set layer order
    newMap.setOrder(zOrder);
    
    //Set alpha transparency
    newMap.setAlpha(alpha);

    //Add the map
    AltusUnified.scene.addMap(newMap);

    //Clean up
    newMap.delete();
    mapDesc.delete();
};


//Adds a Nexrad 
function setNexradWMSLayerEnabled(enabled, layerName) {
    var mapName="Nexrad"+layerName;
    
    if(enabled){
        var wmsTileProvider = new WMSTileProvider();
        wmsTileProvider.wmsVersion = "1.1.1";
        wmsTileProvider.wmsService = "wms";
        wmsTileProvider.wmsURL = "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi";
        wmsTileProvider.wmsSRS="EPSG:3857";
        wmsTileProvider.convertTo3857=true;
        wmsTileProvider.useWMSStyle=true;
        wmsTileProvider.wmsStyleString="";
        wmsTileProvider.wmsLayers=layerName;
        wmsTileProvider.setGeoBounds(new AltusUnified.GeoBoundingBox(-126, 24, -66, 50));
        wmsTileProvider.wmsFormat="image/png";
        
        //Add layer
        addWMSRasterLayer(mapName, wmsTileProvider, 5, 1.0);
        
        //Clean up
        wmsTileProvider.delete();
    }
    else{
        removeMap(mapName);
    }
};

function setTigerWebWMSLayerEnabled(enabled, layerName) {

    var mapName="Tigerweb " + layerName;
    if(enabled){
        var wmsTileProvider = new WMSTileProvider();
        wmsTileProvider.wmsVersion = "1.3.0";
        wmsTileProvider.wmsService = "wms";
        wmsTileProvider.wmsURL = "https://crossorigin.me/https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer";
        wmsTileProvider.wmsCRS="EPSG:3857";
        wmsTileProvider.convertTo3857=true;
        wmsTileProvider.useWMSStyle=true;
        wmsTileProvider.wmsStyleString="default";
        wmsTileProvider.wmsLayers=layerName;
        wmsTileProvider.setGeoBounds(new AltusUnified.GeoBoundingBox(-179.999996, -67.301489, 179.999996, 88.920787));
        wmsTileProvider.wmsFormat="image/png";
        
        //Add layer
        addWMSRasterLayer(mapName, wmsTileProvider, 2, 1.0);
        
        //Clean up
        wmsTileProvider.delete();
    }
    else{
        removeMap(mapName);
    }
};

/*C1*/

