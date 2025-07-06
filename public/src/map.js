import { getRealtimeData, getStaticData } from "./aggregator.js";
import { getDataForVehicle } from "./utils.js";
import { createInfoWindowContent, createMarkerContent } from "./factories.js";
import {
    MAP_API_ID,
    MAP_BOUNDS,
    MAP_CENTER,
    MAP_ELEMENT_ID,
    MAP_ZOOM,
    MARKER_UPDATE_MS,
    STATIC_UPDATE_MS,
    VEHICLE_STALE_MS,
} from "./constants.js";

const {
    Map: VisualMap,
    TrafficLayer,
    InfoWindow,
} = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

const createMapState = () => {
    return {
        map: null,
        staticData: null,
        markers: new Map(),
        infoWindows: new Map(),
    };
};

const updateStaticData = async (state) => {
    state.staticData = await getStaticData();
};

const removeVehicle = (state, vehicleId) => {
    // console.log(`Removing marker of vehicle with id: ${vehicleId}`);
    const infoWin = state.infoWindows.get(vehicleId);
    if (infoWin) {
        infoWin.close();
    }
    state.infoWindows.delete(vehicleId);

    const marker = state.markers.get(vehicleId);
    if (marker) {
        marker.setMap(null);
    }
    state.markers.delete(vehicleId);
};

const updateMarkers = async (state) => {
    const data = await getRealtimeData();

    const currentVehicleIds = new Set(
        data.map((vehicle) => vehicle["vehicleId"]),
    );
    state.markers.forEach((marker, vehicleId) => {
        if (!currentVehicleIds.has(vehicleId)) {
            removeVehicle(state, vehicleId);
        }
    });

    data.forEach((vehicle) => {
        const vehicleId = vehicle["vehicleId"];

        if (Date.now() - vehicle["time"] * 1000 >= VEHICLE_STALE_MS) {
            if (state.markers.has(vehicleId)) {
                removeVehicle(state, vehicleId);
            }
            return;
        }

        const position = { lat: vehicle["lat"], lng: vehicle["lng"] };
        const vehicleData = getDataForVehicle(vehicle, state.staticData);

        if (state.markers.has(vehicleId)) {
            const marker = state.markers.get(vehicleId);
            const infoWindow = state.infoWindows.get(vehicleId);

            marker.position = position;
            marker.title = vehicleId.toString();
            marker.content = createMarkerContent(vehicle, vehicleData);
            infoWindow.setContent(
                createInfoWindowContent(vehicle, vehicleData),
            );
        } else {
            // console.log(`Adding marker of vehicle with id: ${vehicleId}`);
            const marker = new AdvancedMarkerElement({
                map: state.map,
                position: position,
                title: vehicleId.toString(),
                content: createMarkerContent(vehicle, vehicleData),
            });
            const infoWindow = new InfoWindow({
                content: createInfoWindowContent(vehicle, vehicleData),
            });

            google.maps.event.addListener(marker, "click", () => {
                infoWindow.open({
                    anchor: marker,
                    map: state.map,
                    shouldFocus: false,
                });
            });

            state.markers.set(vehicleId, marker);
            state.infoWindows.set(vehicleId, infoWindow);
        }
    });
};

export const initMap = async () => {
    const state = createMapState();

    state.map = new VisualMap(document.getElementById(MAP_ELEMENT_ID), {
        center: MAP_CENTER,
        restriction: {
            latLngBounds: MAP_BOUNDS,
            strictBounds: false,
        },
        zoom: MAP_ZOOM,
        clickableIcons: false,
        streetViewControl: false,
        disableDefaultUI: true,
        //fullscreenControl: false,
        gestureHandling: "greedy",
        mapId: MAP_API_ID,
    });
    new TrafficLayer({ map: state.map });

    await updateStaticData(state);
    await updateMarkers(state);

    setInterval(() => updateStaticData(state), STATIC_UPDATE_MS);
    setInterval(() => updateMarkers(state), MARKER_UPDATE_MS);
};
