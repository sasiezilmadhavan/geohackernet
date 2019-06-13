
//Populates the unordered list of markers in the DOM
function populateList(markers){
    var newHTML="";
    var count = markers.size();
    for(var i=0; i<count; i++){
        var markerData = markers.get(i);
        newHTML=newHTML+"<li>"+markerData.metadata+"</li>";
        markerData.delete();
    }
    document.getElementById("ulMarkerList").innerHTML = newHTML;
}

//Is called each time a frame is rendered to update the list of markers
var MarkerListingSceneDelegate = AltusUnified.ISceneDelegate.extend("ISceneDelegate", {
    markerMap:null,
    getRenderEventFlags: function () {
        return AltusUnified.RenderEventFlags.POST_RENDER;
    },
    preRender: function (elapsed) {
    },
    postRender: function (elapsed) {
        if(this.markerMap==null){
            this.markerMap = AltusUnified.scene.findMap("Places");
        }
        if(this.markerMap!=null){
            var markers = this.markerMap.getVisibleMarkers();
            if(markers!=null){
                populateList(markers);
                markers.delete();
            }
        }
    }
});

function markerListingMain(){
    //Turn on a base map. This map is a set of weathergrid tiles
    //that look like terrain. They are smoothe bilinear filtered,
    //and are colored well for labels and things
    setColorbarTerrainBaseMap1(); //See altusutil.js
    addPlacesClusteredMarkerLayer();
    
    //Add a delegate to be called every frame
    var sceneDelegate = new MarkerListingSceneDelegate();
    AltusUnified.scene.setDelegate(sceneDelegate);
    sceneDelegate.delete();
}
