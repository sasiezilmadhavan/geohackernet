//Vector map styles
function setNextMapStyle(mapView, mapName) {
    // Check to see if the counter has been initialized
    if ( typeof setNextMapStyle.counter == 'undefined' ) {
        setNextMapStyle.counter = 0;
    }
    
    switch(setNextMapStyle.counter) {
        case 0: setGreenStyle(mapView, mapName); break;
        case 1: setGreyStyle(mapView, mapName); break;
        default: setRedStyle(mapView, mapName);
    }
    
    // increment and wrap
    ++setNextMapStyle.counter;
    if (setNextMapStyle.counter > 2) {
        setNextMapStyle.counter = 0;
    }
}

function setCulturalStyle(mapView, mapName){
    //Clear existing styles
    mapView.clearStyles(mapName);
    
    //Set feature order
    mapView.setFeatureOrder(mapName, 'ocean', 0);
    mapView.setFeatureOrder(mapName, 'land', 1);
    mapView.setFeatureOrder(mapName, 'us', 2);
    mapView.setFeatureOrder(mapName, 'admin0', 3);
    mapView.setFeatureOrder(mapName, 'admin1', 4);
    mapView.setFeatureOrder(mapName, 'land_outline', 5);
    
    //Polygon styles
    mapView.setPolygonStyle(mapName, 'land', 0, 0x898f90ff, 0, 0, 0x00000000, 0, 0);
    mapView.setPolygonStyle(mapName, 'ocean', 0, 0x497497ff, 0, 0, 0x00000000, 0, 0);
    mapView.setPolygonStyle(mapName, 'us', 0, 0xd2d2d2ff, 0, 0, 0x00000000, 0, 0);
    
    //Line styles
    mapView.setLineStyle(mapName, 'land_outline', 400000000, 0x00000044, 1);
    mapView.setLineStyle(mapName, 'land_outline', 200000000, 0x00000088, 1);
    mapView.setLineStyle(mapName, 'land_outline', 100000000, 0x000000CC, 1);
    mapView.setLineStyle(mapName, 'land_outline', 50000000, 0x000000FF, 1);
    
    mapView.setLineStyle(mapName, 'admin0', 200000000, 0x00000088, 1);
    mapView.setLineStyle(mapName, 'admin0', 100000000, 0x000000CC, 1);
    mapView.setLineStyle(mapName, 'admin0', 50000000, 0x000000FF, 1);
    mapView.setLineStyle(mapName, 'admin0', 25000000, 0x000000FF, 2);
    mapView.setLineStyle(mapName, 'admin0', 12500000, 0x000000FF, 3);
    
    mapView.setLineStyle(mapName, 'admin1', 200000000, 0x00000044, 1);
    mapView.setLineStyle(mapName, 'admin1', 100000000, 0x00000088, 1);
    mapView.setLineStyle(mapName, 'admin1', 50000000, 0x000000CC, 1);
    mapView.setLineStyle(mapName, 'admin1', 25000000, 0x000000FF, 1);
    mapView.setLineStyle(mapName, 'admin1', 12500000, 0x000000FF, 2);
}

function setGreenStyle(mapView, mapName){
    /////////////////////////////////////////////////
    //G Styles
    //Clear existing styles
    mapView.clearStyles(mapName);
    //Highway_Motorway
    mapView.setFeatureOrder(mapName, 'Highway_Motorway', 9);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 24414, 0xF99E24FF, 0xF99E24FF, 14, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 195312, 0xF99E24FF, 0xF99E24FF, 8, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 781250, 0xF99E24FF, 0xF99E24FF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 3125000, 0xF99E24FF, 0xF99E24FF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 12500000, 0xF7A026FF, 0xF7A026FF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 25000000, 0xF7A026FF, 0xF7A026FF, 3, 0x00000000, 0, -2);
    //Highway_Trunk
    mapView.setFeatureOrder(mapName, 'Highway_Trunk', 8);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 24414, 0xFFE168FF, 0xFFE168FF, 10, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 195312, 0xFFE168FF, 0xFFE168FF, 10, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 781250, 0xFFE168FF, 0xFFE168FF, 5, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 1562500, 0xFFE168FF, 0xFFE168FF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 3125000, 0xE7BE4AFF, 0xE7BE4AFF, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 6250000, 0xCEC7B6FF, 0xCEC7B6FF, 2, 0x00000000, 0, -2);
    //Highway_Primary
    mapView.setFeatureOrder(mapName, 'Highway_Primary', 7);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 24414, 0xFFFFFFFF, 0xFFFFFFFF, 14, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 48828, 0xFFFFFFFF, 0xFFFFFFFF, 8, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 390625, 0xFFFFFFFF, 0xFFFFFFFF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 1562500, 0xFFFFFFFF, 0xFFFFFFFF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 6250000, 0xCEC7B6FF, 0xCEC7B6FF, 2, 0x00000000, 0, -2);
    //Highway_Secondary
    mapView.setFeatureOrder(mapName, 'Highway_Secondary', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 24414, 0xFFFFFFFF, 0xFFFFFFFF, 10, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 48828, 0xFFFFFFFF, 0xFFFFFFFF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 195312, 0xFFFFFFFF, 0xFFFFFFFF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 781250, 0xCEC7B6AA, 0xCEC7B6AA, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 1562500, 0xCEC7B6AA, 0xCEC7B6AA, 2, 0x00000000, 0, -2);
    //Highway_Tertiary
    mapView.setFeatureOrder(mapName, 'Highway_Tertiary', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 24414, 0xFFFFFFFF, 0xFFFFFFFF, 8, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 48828, 0xFFFFFFFF, 0xFFFFFFFF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 195312, 0xFFFFFFFF, 0xFFFFFFFF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 781250, 0xCEC7B6AA, 0xCEC7B6AA, 2, 0x00000000, 0, -2);
    //Highway_Footway
    mapView.setFeatureOrder(mapName, 'Highway_Footway', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Footway', 48828, 0x88888844, 0x88888844, 2, 0x00000000, 0, -2);
    //Highway_Residential
    mapView.setFeatureOrder(mapName, 'Highway_Residential', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 24414, 0xF8F6F2FF, 0xF8F6F2FF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 195312, 0xCEC7B6FF, 0xCEC7B6FF, 2, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 390625, 0xCEC7B6AA, 0xCEC7B6AA, 1, 0x00000000, 0, -2);
    //Admin_0
    mapView.setFeatureOrder(mapName, 'Admin_0', 5);
    mapView.setPolygonStyle(mapName, 'Admin_0', 12500000, 0x888888FF, 0x888888FF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Admin_0', 25000000, 0x888888FF, 0x888888FF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Admin_0', 50000000, 0x888888FF, 0x888888FF, 2, 0x00000000, 0, -2);
    //Admin_1
    mapView.setFeatureOrder(mapName, 'Admin_1', 5);
    mapView.setPolygonStyle(mapName, 'Admin_1', 12500000, 0x88888888, 0x88888888, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Admin_1', 25000000, 0x88888844, 0x88888844, 2, 0x00000000, 0, -2);
    //Highway_Service
    mapView.setFeatureOrder(mapName, 'Highway_Service', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Service', 24414, 0xF8F6F2FF, 0xF8F6F2FF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Service', 195312, 0x88888844, 0x88888844, 2, 0x00000000, 0, -2);
    //Highway_Service_0
    mapView.setFeatureOrder(mapName, 'Highway_Service_0', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Service_0', 195312, 0x88888822, 0x88888822, 1, 0x00000000, 0, -2);
    //Pitch
    mapView.setFeatureOrder(mapName, 'Pitch', 5);
    mapView.setPolygonStyle(mapName, 'Pitch', 0, 0xCDDBBAFF, 0xCDDBBAFF, 0, 0x00000000, 0, -2);
    //River
    mapView.setFeatureOrder(mapName, 'River', 4);
    mapView.setPolygonStyle(mapName, 'River', 0, 0xBBDDFFCC, 0xBBDDFFCC, 1, 0x00000000, 0, -2);
    //Lake
    mapView.setFeatureOrder(mapName, 'Lake', 4);
    mapView.setPolygonStyle(mapName, 'Lake', 0, 0xA0C3FFFF, 0xA0C3FFFF, 1, 0x00000000, 0, -2);
    //Building
    mapView.setFeatureOrder(mapName, 'Building', 4);
    mapView.setPolygonStyle(mapName, 'Building', 0, 0xE6DED3FF, 0xE6DED3FF, 0, 0x00000000, 0, -2);
    //Waterway_Stream
    mapView.setFeatureOrder(mapName, 'Waterway_Stream', 4);
    mapView.setPolygonStyle(mapName, 'Waterway_Stream', 0, 0xBBDDFF88, 0xBBDDFF88, 1, 0x00000000, 0, -2);
    //Waterway_Drain
    mapView.setFeatureOrder(mapName, 'Waterway_Drain', 4);
    mapView.setPolygonStyle(mapName, 'Waterway_Drain', 0, 0xBBDDFFBB, 0xBBDDFFBB, 1, 0x00000000, 0, -2);
    //Lakes_Big
    mapView.setFeatureOrder(mapName, 'Lakes_Big', 4);
    mapView.setPolygonStyle(mapName, 'Lakes_Big', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Airport_Taxiway
    mapView.setFeatureOrder(mapName, 'Airport_Taxiway', 4);
    mapView.setPolygonStyle(mapName, 'Airport_Taxiway', 0, 0xD3CABDFF, 0xD3CABDFF, 3, 0x00000000, 0, -2);
    //Stadium
    mapView.setFeatureOrder(mapName, 'Stadium', 4);
    mapView.setPolygonStyle(mapName, 'Stadium', 0, 0xEDE3D0FF, 0xEDE3D0FF, 0, 0x00000000, 0, -2);
    //Riverbank
    mapView.setFeatureOrder(mapName, 'Riverbank', 3);
    mapView.setPolygonStyle(mapName, 'Riverbank', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Park
    mapView.setFeatureOrder(mapName, 'Park', 3);
    mapView.setPolygonStyle(mapName, 'Park', 0, 0xCBDEAAFF, 0xCBDEAAFF, 0, 0x00000000, 0, -2);
    //School
    mapView.setFeatureOrder(mapName, 'School', 3);
    mapView.setPolygonStyle(mapName, 'School', 0, 0xF3EFD9FF, 0xF3EFD9FF, 0, 0x00000000, 0, -2);
    //Natural_Wood
    mapView.setFeatureOrder(mapName, 'Natural_Wood', 3);
    mapView.setPolygonStyle(mapName, 'Natural_Wood', 0, 0xD0E7C244, 0xD0E7C244, 0, 0x00000000, 0, -2);
    //Airport
    mapView.setFeatureOrder(mapName, 'Airport', 3);
    mapView.setPolygonStyle(mapName, 'Airport', 0, 0xDEDAD3FF, 0xDEDAD3FF, 0, 0x00000000, 0, -2);
    //Airport_Runway
    mapView.setFeatureOrder(mapName, 'Airport_Runway', 3);
    mapView.setPolygonStyle(mapName, 'Airport_Runway', 0, 0xD3CABDFF, 0xD3CABDFF, 0, 0x00000000, 0, -2);
    //University
    mapView.setFeatureOrder(mapName, 'University', 3);
    mapView.setPolygonStyle(mapName, 'University', 0, 0xE8DDBDFF, 0xE8DDBDFF, 0, 0x00000000, 0, -2);
    //Healthcare
    mapView.setFeatureOrder(mapName, 'Healthcare', 3);
    mapView.setPolygonStyle(mapName, 'Healthcare', 0, 0xEBD2CFFF, 0xEBD2CFFF, 0, 0x00000000, 0, -2);
    //Park_NE
    mapView.setFeatureOrder(mapName, 'Park_NE', 3);
    mapView.setPolygonStyle(mapName, 'Park_NE', 25000000, 0xCBDEAAFF, 0xCBDEAAFF, 0, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Park_NE', 50000000, 0xA4C7A6FF, 0xA4C7A6FF, 0, 0x00000000, 0, -2);
    //Urban
    mapView.setFeatureOrder(mapName, 'Urban', 2);
    mapView.setPolygonStyle(mapName, 'Urban', 3125000, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Urban', 12500000, 0xEBE9DEFF, 0xEBE9DEFF, 0, 0x00000000, 0, -2);
    //Military
    mapView.setFeatureOrder(mapName, 'Military', 2);
    mapView.setPolygonStyle(mapName, 'Military', 0, 0xDEDAD3FF, 0xDEDAD3FF, 0, 0x00000000, 0, -2);
    //Forest
    mapView.setFeatureOrder(mapName, 'Forest', 2);
    mapView.setPolygonStyle(mapName, 'Forest', 0, 0xCBDEAAFF, 0xCBDEAAFF, 0, 0x00000000, 0, -2);
    //Land_coastline
    mapView.setFeatureOrder(mapName, 'Land_coastline', 1);
    mapView.setPolygonStyle(mapName, 'Land_coastline', 0, 0xF4F3F2FF, 0xF4F3F2FF, 0, 0x00000000, 0, -2);
    //Land_10m
    mapView.setFeatureOrder(mapName, 'Land_10m', 1);
    mapView.setPolygonStyle(mapName, 'Land_10m', 0, 0xF4F3F2FF, 0xF4F3F2FF, 0, 0x00000000, 0, -2);
    //Land_50m
    mapView.setFeatureOrder(mapName, 'Land_50m', 1);
    mapView.setPolygonStyle(mapName, 'Land_50m', 12500000, 0xF4F3F2FF, 0xF4F3F2FF, 0, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Land_50m', 25000000, 0xE7EBDAFF, 0xE7EBDAFF, 0, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Land_50m', 50000000, 0xD1DDBBFF, 0xD1DDBBFF, 0, 0x00000000, 0, -2);
    //Ocean_50m
    mapView.setFeatureOrder(mapName, 'Ocean_50m', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_50m', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Ocean_10m
    mapView.setFeatureOrder(mapName, 'Ocean_10m', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_10m', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Ocean_coastline
    mapView.setFeatureOrder(mapName, 'Ocean_coastline', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_coastline', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Ocean_50m_hole
    mapView.setFeatureOrder(mapName, 'Ocean_50m_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_50m_hole', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Ocean_10m_hole
    mapView.setFeatureOrder(mapName, 'Ocean_10m_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_10m_hole', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Ocean_coastline_hole
    mapView.setFeatureOrder(mapName, 'Ocean_coastline_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_coastline_hole', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    //Ocean
    mapView.setFeatureOrder(mapName, 'Ocean', 0);
    mapView.setPolygonStyle(mapName, 'Ocean', 0, 0xA0C3FFFF, 0xA0C3FFFF, 0, 0x00000000, 0, -2);
    
}

function setGreyStyle(mapView, mapName){
    /////////////////////////////////////////////////
    //M Styles
    //Clear existing styles
    mapView.clearStyles(mapName);
    //Highway_Motorway
    mapView.setFeatureOrder(mapName, 'Highway_Motorway', 9);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 26367, 0xFEE1A2FF, 0xFEE1A2FF, 12, 0xBBBBBBCC, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 52734, 0xFEE1A2FF, 0xFEE1A2FF, 8, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 843750, 0xFEE1A2FF, 0xFEE1A2FF, 4, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 12500000, 0x88888816, 0x88888816, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 25000000, 0x88888811, 0x88888811, 2, 0x00000000, 0, -2);
    //Highway_Trunk
    mapView.setFeatureOrder(mapName, 'Highway_Trunk', 8);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 52734, 0xFFFBDDFF, 0xFFFBDDFF, 6, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 105469, 0xFFFFFFFF, 0xFFFFFFFF, 5, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 421875, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 843750, 0x88888833, 0x88888833, 2, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 2200000, 0x88888833, 0x88888833, 1, 0x00000000, 0, -2);
    //Highway_Primary
    mapView.setFeatureOrder(mapName, 'Highway_Primary', 7);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 26367, 0xFFFBDDFF, 0xFFFBDDFF, 10, 0xBBBBBBCC, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 52734, 0xFFFBDDFF, 0xFFFBDDFF, 6, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 421875, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 2200000, 0x88888844, 0x88888844, 1, 0x00000000, 0, -2);
    //Highway_Secondary
    mapView.setFeatureOrder(mapName, 'Highway_Secondary', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 26367, 0xFFFBDDFF, 0xFFFBDDFF, 8, 0xBBBBBBCC, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 52734, 0xFFFBDDFF, 0xFFFBDDFF, 6, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 421875, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 2200000, 0x88888833, 0x88888833, 1, 0x00000000, 0, -2);
    //Highway_Tertiary
    mapView.setFeatureOrder(mapName, 'Highway_Tertiary', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 210938, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 421875, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Highway_Footway
    mapView.setFeatureOrder(mapName, 'Highway_Footway', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Footway', 52734, 0xFFFFFFFF, 0xFFFFFFFF, 1, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Footway', 105469, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Highway_Residential
    mapView.setFeatureOrder(mapName, 'Highway_Residential', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 26367, 0xFFFFFFFF, 0xFFFFFFFF, 6, 0xBBBBBBCC, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 52734, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0xBBBBBB55, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 105469, 0x88888844, 0x88888844, 2, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 210938, 0x88888819, 0x88888819, 2, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 421875, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Admin_0
    mapView.setFeatureOrder(mapName, 'Admin_0', 5);
    mapView.setPolygonStyle(mapName, 'Admin_0', 0, 0x55555577, 0x55555577, 1, 0x00000000, 0, -2);
    //Admin_1
    mapView.setFeatureOrder(mapName, 'Admin_1', 5);
    mapView.setPolygonStyle(mapName, 'Admin_1', 0, 0x55555522, 0x55555522, 1, 0x00000000, 0, -2);
    //Highway_Service
    mapView.setFeatureOrder(mapName, 'Highway_Service', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Service', 26367, 0x88888844, 0x88888844, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Service', 2200000, 0x88888844, 0x88888844, 1, 0x00000000, 0, -2);
    //Highway_Service_0
    mapView.setFeatureOrder(mapName, 'Highway_Service_0', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Service_0', 26367, 0x88888844, 0x88888844, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Service_0', 2200000, 0x88888822, 0x88888822, 1, 0x00000000, 0, -2);
    //Pitch
    mapView.setFeatureOrder(mapName, 'Pitch', 5);
    mapView.setPolygonStyle(mapName, 'Pitch', 0, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //River
    mapView.setFeatureOrder(mapName, 'River', 4);
    mapView.setPolygonStyle(mapName, 'River', 0, 0xbadcffFF, 0xbadcffFF, 1, 0x00000000, 0, -2);
    //Lake
    mapView.setFeatureOrder(mapName, 'Lake', 4);
    mapView.setPolygonStyle(mapName, 'Lake', 0, 0xbadcffFF, 0xbadcffFF, 1, 0x00000000, 0, -2);
    //Building
    mapView.setFeatureOrder(mapName, 'Building', 4);
    mapView.setPolygonStyle(mapName, 'Building', 0, 0xE6DED3FF, 0xE6DED3FF, 0, 0x00000000, 0, -2);
    //Waterway_Stream
    mapView.setFeatureOrder(mapName, 'Waterway_Stream', 4);
    mapView.setPolygonStyle(mapName, 'Waterway_Stream', 0, 0xbadcffFF, 0xbadcffFF, 1, 0x00000000, 0, -2);
    //Waterway_Drain
    mapView.setFeatureOrder(mapName, 'Waterway_Drain', 4);
    mapView.setPolygonStyle(mapName, 'Waterway_Drain', 0, 0xbadcffFF, 0xbadcffFF, 1, 0x00000000, 0, -2);
    //Lakes_Big
    mapView.setFeatureOrder(mapName, 'Lakes_Big', 4);
    mapView.setPolygonStyle(mapName, 'Lakes_Big', 0, 0xbadcffFF, 0xbadcffFF, 1, 0x00000000, 0, -2);
    //Airport_Taxiway
    mapView.setFeatureOrder(mapName, 'Airport_Taxiway', 4);
    mapView.setPolygonStyle(mapName, 'Airport_Taxiway', 843750, 0xFFFFFFAA, 0xFFFFFFAA, 1, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Airport_Taxiway', 1687500, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Stadium
    mapView.setFeatureOrder(mapName, 'Stadium', 4);
    mapView.setPolygonStyle(mapName, 'Stadium', 0, 0xE6DED3FF, 0xE6DED3FF, 0, 0x00000000, 0, -2);
    //Riverbank
    mapView.setFeatureOrder(mapName, 'Riverbank', 3);
    mapView.setPolygonStyle(mapName, 'Riverbank', 0, 0xbadcffFF, 0xbadcffFF, 1, 0x00000000, 0, -2);
    //Park
    mapView.setFeatureOrder(mapName, 'Park', 3);
    mapView.setPolygonStyle(mapName, 'Park', 0, 0xd1e7c2FF, 0xd1e7c2FF, 0, 0x00000000, 0, -2);
    //School
    mapView.setFeatureOrder(mapName, 'School', 3);
    mapView.setPolygonStyle(mapName, 'School', 0, 0xF3EFD9FF, 0xF3EFD9FF, 0, 0x00000000, 0, -2);
    //Natural_Wood
    mapView.setFeatureOrder(mapName, 'Natural_Wood', 3);
    mapView.setPolygonStyle(mapName, 'Natural_Wood', 0, 0xD0E7C244, 0xD0E7C244, 0, 0x00000000, 0, -2);
    //Airport
    mapView.setFeatureOrder(mapName, 'Airport', 3);
    mapView.setPolygonStyle(mapName, 'Airport', 843750, 0x88888811, 0x88888811, 0, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Airport', 1687500, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Airport_Runway
    mapView.setFeatureOrder(mapName, 'Airport_Runway', 3);
    mapView.setPolygonStyle(mapName, 'Airport_Runway', 843750, 0xFFFFFFAA, 0xFFFFFFAA, 1, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Airport_Runway', 1687500, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //University
    mapView.setFeatureOrder(mapName, 'University', 3);
    mapView.setPolygonStyle(mapName, 'University', 0, 0xF3EFD9FF, 0xF3EFD9FF, 0, 0x00000000, 0, -2);
    //Healthcare
    mapView.setFeatureOrder(mapName, 'Healthcare', 3);
    mapView.setPolygonStyle(mapName, 'Healthcare', 0, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Park_NE
    mapView.setFeatureOrder(mapName, 'Park_NE', 3);
    mapView.setPolygonStyle(mapName, 'Park_NE', 0, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Urban
    mapView.setFeatureOrder(mapName, 'Urban', 2);
    mapView.setPolygonStyle(mapName, 'Urban', 0, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Military
    mapView.setFeatureOrder(mapName, 'Military', 2);
    mapView.setPolygonStyle(mapName, 'Military', 0, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Forest
    mapView.setFeatureOrder(mapName, 'Forest', 2);
    mapView.setPolygonStyle(mapName, 'Forest', 0, 0x00000000, 0x00000000, 0, 0x00000000, 0, -2);
    //Land_coastline
    mapView.setFeatureOrder(mapName, 'Land_coastline', 1);
    mapView.setPolygonStyle(mapName, 'Land_coastline', 0, 0xf0eee7FF, 0xf0eee7FF, 1, 0x00000000, 0, -2);
    //Land_10m
    mapView.setFeatureOrder(mapName, 'Land_10m', 1);
    mapView.setPolygonStyle(mapName, 'Land_10m', 0, 0xf0eee7FF, 0xf0eee7FF, 0, 0x00000000, 0, -2);
    //Land_50m
    mapView.setFeatureOrder(mapName, 'Land_50m', 1);
    mapView.setPolygonStyle(mapName, 'Land_50m', 0, 0xf0eee7FF, 0xf0eee7FF, 1, 0x00000000, 0, -2);
    //Ocean_50m
    mapView.setFeatureOrder(mapName, 'Ocean_50m', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_50m', 0, 0xbadcffFF, 0xbadcffFF, 0, 0x00000000, 0, -2);
    //Ocean_10m
    mapView.setFeatureOrder(mapName, 'Ocean_10m', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_10m', 0, 0xbadcffFF, 0xbadcffFF, 0, 0x00000000, 0, -2);
    //Ocean_coastline
    mapView.setFeatureOrder(mapName, 'Ocean_coastline', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_coastline', 0, 0xbadcffFF, 0xbadcffFF, 0, 0x00000000, 0, -2);
    //Ocean_50m_hole
    mapView.setFeatureOrder(mapName, 'Ocean_50m_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_50m_hole', 0, 0xbadcffFF, 0xbadcffFF, 0, 0x00000000, 0, -2);
    //Ocean_10m_hole
    mapView.setFeatureOrder(mapName, 'Ocean_10m_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_10m_hole', 0, 0xbadcffFF, 0xbadcffFF, 0, 0x00000000, 0, -2);
    //Ocean_coastline_hole
    mapView.setFeatureOrder(mapName, 'Ocean_coastline_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_coastline_hole', 0, 0xbadcffFF, 0xbadcffFF, 0, 0x00000000, 0, -2);
    //Ocean
    mapView.setFeatureOrder(mapName, 'Ocean', 0);
    mapView.setPolygonStyle(mapName, 'Ocean', 0, 0xbadcffFF, 0xbadcffFF, 0, 0x00000000, 0, -2);
}

function setRedStyle(mapView, mapName){
    /////////////////////////////////////////////////
    //Styles from A_Styles
    //Clear existing styles
    mapView.clearStyles(mapName);
    //Highway_Motorway
    mapView.setFeatureOrder(mapName, 'Highway_Motorway', 9);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 52734, 0xFFDC1DFF, 0xFFDC1DFF, 12, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 390625, 0xFFDC1DFF, 0xFFDC1DFF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 781250, 0xFFDC1DFF, 0xFFDC1DFF, 5, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 12500000, 0xFFDC1DFF, 0xFFDC1DFF, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 25000000, 0xF5BE3888, 0xF5BE3888, 1, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Motorway', 50000000, 0xF5BE3844, 0xF5BE3844, 1, 0x00000000, 0, -2);
    //Highway_Trunk
    mapView.setFeatureOrder(mapName, 'Highway_Trunk', 8);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 195312, 0xFFFFFFFF, 0xFFFFFFFF, 6, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 781250, 0xFFFFFFFF, 0xFFFFFFFF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Trunk', 25000000, 0xFFFFFFFF, 0xFFFFFFFF, 2, 0x00000000, 0, -2);
    //Highway_Primary
    mapView.setFeatureOrder(mapName, 'Highway_Primary', 7);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 97656, 0xFFFFFFFF, 0xFFFFFFFF, 4, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 3125000, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Primary', 6250000, 0x88888822, 0x88888822, 2, 0x00000000, 0, -2);
    //Highway_Secondary
    mapView.setFeatureOrder(mapName, 'Highway_Secondary', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 52734, 0xFFFFFFFF, 0xFFFFFFFF, 8, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 105469, 0xFFFFFFFF, 0xFFFFFFFF, 5, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 781250, 0xFFFFFFFF, 0xFFFFFFFF, 2, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Secondary', 3125000, 0x88888833, 0x88888833, 1, 0x00000000, 0, -2);
    //Highway_Tertiary
    mapView.setFeatureOrder(mapName, 'Highway_Tertiary', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 390625, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Tertiary', 781250, 0x88888833, 0x88888833, 1, 0x00000000, 0, -2);
    //Highway_Footway
    mapView.setFeatureOrder(mapName, 'Highway_Footway', 6);
    mapView.setPolygonStyle(mapName, 'Highway_Footway', 0, 0xFF000000, 0xFF000000, 0, 0x00000000, 0, -2);
    //Highway_Residential
    mapView.setFeatureOrder(mapName, 'Highway_Residential', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 52734, 0xFFFFFFFF, 0xFFFFFFFF, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 105469, 0xFFFFFFFF, 0xFFFFFFFF, 1, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 250938, 0x88888822, 0x88888822, 2, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Highway_Residential', 390625, 0xFF000000, 0xFF000000, 0, 0x00000000, 0, -2);
    //Admin_0
    mapView.setFeatureOrder(mapName, 'Admin_0', 5);
    mapView.setPolygonStyle(mapName, 'Admin_0', 6250000, 0xFF000044, 0xFF000044, 7, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Admin_0', 12500000, 0xFF000022, 0xFF000022, 5, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Admin_0', 25000000, 0xFF000022, 0xFF000022, 2, 0x00000000, 0, -2);
    //Admin_1
    mapView.setFeatureOrder(mapName, 'Admin_1', 5);
    mapView.setPolygonStyle(mapName, 'Admin_1', 6250000, 0xFF000022, 0xFF000022, 5, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Admin_1', 12500000, 0xFF000011, 0xFF000011, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Admin_1', 25000000, 0xFF000011, 0xFF000011, 2, 0x00000000, 0, -2);
    //Highway_Service
    mapView.setFeatureOrder(mapName, 'Highway_Service', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Service', 0, 0x88888844, 0x88888844, 1, 0x00000000, 0, -2);
    //Highway_Service_0
    mapView.setFeatureOrder(mapName, 'Highway_Service_0', 5);
    mapView.setPolygonStyle(mapName, 'Highway_Service_0', 0, 0x88888822, 0x88888822, 1, 0x00000000, 0, -2);
    //Pitch
    mapView.setFeatureOrder(mapName, 'Pitch', 5);
    mapView.setPolygonStyle(mapName, 'Pitch', 0, 0xFF000000, 0xFF000000, 1, 0x00000000, 0, -2);
    //River
    mapView.setFeatureOrder(mapName, 'River', 4);
    mapView.setPolygonStyle(mapName, 'River', 0, 0xa0d6f3FF, 0xa0d6f3FF, 1, 0x00000000, 0, -2);
    //Lake
    mapView.setFeatureOrder(mapName, 'Lake', 4);
    mapView.setPolygonStyle(mapName, 'Lake', 0, 0xa0d6f3FF, 0xa0d6f3FF, 1, 0x00000000, 0, -2);
    //Building
    mapView.setFeatureOrder(mapName, 'Building', 4);
    mapView.setPolygonStyle(mapName, 'Building', 0, 0xE6DED3FF, 0xE6DED3FF, 0, 0x00000000, 0, -2);
    //Waterway_Stream
    mapView.setFeatureOrder(mapName, 'Waterway_Stream', 4);
    mapView.setPolygonStyle(mapName, 'Waterway_Stream', 0, 0xa0d6f3FF, 0xa0d6f3FF, 1, 0x00000000, 0, -2);
    //Waterway_Drain
    mapView.setFeatureOrder(mapName, 'Waterway_Drain', 4);
    mapView.setPolygonStyle(mapName, 'Waterway_Drain', 0, 0xa0d6f3FF, 0xa0d6f3FF, 1, 0x00000000, 0, -2);
    //Lakes_Big
    mapView.setFeatureOrder(mapName, 'Lakes_Big', 4);
    mapView.setPolygonStyle(mapName, 'Lakes_Big', 0, 0xa0d6f3FF, 0xa0d6f3FF, 1, 0x00000000, 0, -2);
    //Airport_Taxiway
    mapView.setFeatureOrder(mapName, 'Airport_Taxiway', 4);
    mapView.setPolygonStyle(mapName, 'Airport_Taxiway', 0, 0xAD91ACFF, 0xAD91ACFF, 3, 0x00000000, 0, -2);
    mapView.setPolygonStyle(mapName, 'Airport_Taxiway', 50000000, 0xAD91ACFF, 0xAD91ACFF, 4, 0x00000000, 0, -2);
    //Stadium
    mapView.setFeatureOrder(mapName, 'Stadium', 4);
    mapView.setPolygonStyle(mapName, 'Stadium', 0, 0xFF000000, 0xFF000000, 1, 0x00000000, 0, -2);
    //Riverbank
    mapView.setFeatureOrder(mapName, 'Riverbank', 3);
    mapView.setPolygonStyle(mapName, 'Riverbank', 0, 0xa0d6f3FF, 0xa0d6f3FF, 1, 0x00000000, 0, -2);
    //Park
    mapView.setFeatureOrder(mapName, 'Park', 3);
    mapView.setPolygonStyle(mapName, 'Park', 0, 0xD0E7C2FF, 0xD0E7C2FF, 0, 0x00000000, 0, -2);
    //School
    mapView.setFeatureOrder(mapName, 'School', 3);
    mapView.setPolygonStyle(mapName, 'School', 0, 0xF3EFD9FF, 0xF3EFD9FF, 0, 0x00000000, 0, -2);
    //Natural_Wood
    mapView.setFeatureOrder(mapName, 'Natural_Wood', 3);
    mapView.setPolygonStyle(mapName, 'Natural_Wood', 0, 0xD0E7C244, 0xD0E7C244, 0, 0x00000000, 0, -2);
    //Airport
    mapView.setFeatureOrder(mapName, 'Airport', 3);
    mapView.setPolygonStyle(mapName, 'Airport', 0, 0xCFB2DBFF, 0xCFB2DBFF, 0, 0x00000000, 0, -2);
    //Airport_Runway
    mapView.setFeatureOrder(mapName, 'Airport_Runway', 3);
    mapView.setPolygonStyle(mapName, 'Airport_Runway', 0, 0xAD91ACFF, 0xAD91ACFF, 0, 0x00000000, 0, -2);
    //University
    mapView.setFeatureOrder(mapName, 'University', 3);
    mapView.setPolygonStyle(mapName, 'University', 0, 0xF0E1C7FF, 0xF0E1C7FF, 0, 0x00000000, 0, -2);
    //Healthcare
    mapView.setFeatureOrder(mapName, 'Healthcare', 3);
    mapView.setPolygonStyle(mapName, 'Healthcare', 0, 0xFBD3DAFF, 0xFBD3DAFF, 0, 0x00000000, 0, -2);
    //Park_NE
    mapView.setFeatureOrder(mapName, 'Park_NE', 3);
    mapView.setPolygonStyle(mapName, 'Park_NE', 0, 0xFF000000, 0xFF000000, 0, 0x00000000, 0, -2);
    //Urban
    mapView.setFeatureOrder(mapName, 'Urban', 2);
    mapView.setPolygonStyle(mapName, 'Urban', 0, 0xFFFFFF55, 0xFFFFFF55, 0, 0x00000000, 0, -2);
    //Military
    mapView.setFeatureOrder(mapName, 'Military', 2);
    mapView.setPolygonStyle(mapName, 'Military', 0, 0xFFFFFF00, 0xFFFFFF00, 0, 0x00000000, 0, -2);
    //Forest
    mapView.setFeatureOrder(mapName, 'Forest', 2);
    mapView.setPolygonStyle(mapName, 'Forest', 0, 0xFFFFFF33, 0xFFFFFF33, 0, 0x00000000, 0, -2);
    //Land_coastline
    mapView.setFeatureOrder(mapName, 'Land_coastline', 1);
    mapView.setPolygonStyle(mapName, 'Land_coastline', 0, 0xf8f2dfFF, 0xf8f2dfFF, 1, 0x00000000, 0, -2);
    //Land_10m
    mapView.setFeatureOrder(mapName, 'Land_10m', 1);
    mapView.setPolygonStyle(mapName, 'Land_10m', 0, 0xf8f2dfFF, 0xf8f2dfFF, 0, 0x00000000, 0, -2);
    //Land_50m
    mapView.setFeatureOrder(mapName, 'Land_50m', 1);
    mapView.setPolygonStyle(mapName, 'Land_50m', 0, 0xf8f2dfFF, 0xf8f2dfFF, 1, 0x00000000, 0, -2);
    //Ocean_50m
    mapView.setFeatureOrder(mapName, 'Ocean_50m', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_50m', 0, 0xa0d6f3FF, 0xa0d6f3FF, 0, 0x00000000, 0, -2);
    //Ocean_10m
    mapView.setFeatureOrder(mapName, 'Ocean_10m', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_10m', 0, 0xa0d6f3FF, 0xa0d6f3FF, 0, 0x00000000, 0, -2);
    //Ocean_coastline
    mapView.setFeatureOrder(mapName, 'Ocean_coastline', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_coastline', 0, 0xa0d6f3FF, 0xa0d6f3FF, 0, 0x00000000, 0, -2);
    //Ocean_50m_hole
    mapView.setFeatureOrder(mapName, 'Ocean_50m_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_50m_hole', 0, 0xa0d6f3FF, 0xa0d6f3FF, 0, 0x00000000, 0, -2);
    //Ocean_10m_hole
    mapView.setFeatureOrder(mapName, 'Ocean_10m_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_10m_hole', 0, 0xa0d6f3FF, 0xa0d6f3FF, 0, 0x00000000, 0, -2);
    //Ocean_coastline_hole
    mapView.setFeatureOrder(mapName, 'Ocean_coastline_hole', 0);
    mapView.setPolygonStyle(mapName, 'Ocean_coastline_hole', 0, 0xa0d6f3FF, 0xa0d6f3FF, 0, 0x00000000, 0, -2);
    //Ocean
    mapView.setFeatureOrder(mapName, 'Ocean', 0);
    mapView.setPolygonStyle(mapName, 'Ocean', 0, 0xa0d6f3FF, 0xa0d6f3FF, 0, 0x00000000, 0, -2);
}


//Vector map styles
function setNextLocation(mapView) {
    // Check to see if the counter has been initialized
    if ( typeof setNextLocation.counter == 'undefined' ) {
        setNextLocation.counter = 0;
    }
    
    /*switch(setNextLocation.counter) {
        case 0: mapView.setLocation3D(29.496562, -96.375362, 800000, 2); break;
        case 1: mapView.setLocation3D(29.684266, -95.194744, 261643, 2); break;
        case 2: mapView.setLocation3D(29.750818, -95.158960, 25673, 2); break;
        case 3: mapView.setLocation3D(29.722913, -95.242156, 9263, 2); break;
        case 4: mapView.setLocation3D(29.496562, -96.375362, 800000, 2); break;
        case 5: mapView.setLocation3D(36.260295, -94.141897, 6050000, 2); break;
        case 6: mapView.setLocation3D(30.043407, -77.798087, 15000000, 2); break;
    }*/
    
    switch(setNextLocation.counter) {
        case 0: scene.camera().setLocation3D(new mapView.Module.GeographicPosition(29.496562, -96.375362, 800000), 2); break;
        case 1: scene.camera().setLocation3D(new mapView.Module.GeographicPosition(29.684266, -95.194744, 261643), 2); break;
        case 2: scene.camera().setLocation3D(new mapView.Module.GeographicPosition(29.750818, -95.158960, 25673), 2); break;
        case 3: scene.camera().setLocation3D(new mapView.Module.GeographicPosition(29.722913, -95.242156, 9263), 2); break;
        case 4: scene.camera().setLocation3D(new mapView.Module.GeographicPosition(29.496562, -96.375362, 800000), 2); break;
        case 5: scene.camera().setLocation3D(new mapView.Module.GeographicPosition(36.260295, -94.141897, 6050000), 2); break;
        case 6: scene.camera().setLocation3D(new mapView.Module.GeographicPosition(30.043407, -77.798087, 15000000), 2); break;
    }
    
    // increment and wrap
    ++setNextLocation.counter;
    if (setNextLocation.counter > 6) {
        setNextLocation.counter = 0;
    }
}
