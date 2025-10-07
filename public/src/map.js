import { getRealtimeData, getStaticData } from "./aggregator.js";
import { getDataForVehicle } from "./utils.js";
import { createMarkerIcon, createPopupContent } from "./factories.js";
import {
    MAP_ELEMENT_ID,
    MAP_BOUNDS,
    MAP_CENTER,
    MAP_ZOOM,
    TILE_LAYER_URL,
    TILE_LAYER_ATTRIBUTION,
    MARKER_UPDATE_MS,
    STATIC_UPDATE_MS,
    VEHICLE_STALE_MS,
} from "./constants.js";

const createMapState = () => {
    return {
        map: null,
        staticData: null,
        markers: new Map(),
    };
};

const updateStaticData = async (state) => {
    state.staticData = await getStaticData();
};

const removeVehicle = (state, vehicleId) => {
    const marker = state.markers.get(vehicleId);
    if (marker) {
        marker.closePopup();
        marker.remove();
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

        const position = [vehicle["lat"], vehicle["lng"]];
        const vehicleData = getDataForVehicle(vehicle, state.staticData);

        if (state.markers.has(vehicleId)) {
            const marker = state.markers.get(vehicleId);

            marker.setLatLng(position);
            marker.setIcon(createMarkerIcon(vehicle, vehicleData));
            marker.getPopup().setContent(createPopupContent(vehicle, vehicleData));
        } else {
            const icon = createMarkerIcon(vehicle, vehicleData);
            const marker = L.marker(position, {
                icon: icon,
                title: vehicleId.toString(),
            }).addTo(state.map);

            marker.bindPopup(createPopupContent(vehicle, vehicleData), {
                maxWidth: 300,
            });

            state.markers.set(vehicleId, marker);
        }
    });
};

export const initMap = async () => {
    const state = createMapState();

    state.map = L.map(MAP_ELEMENT_ID, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        minZoom: 10,
        maxBounds: MAP_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
        bounceAtZoomLimits: false,
    });

    L.tileLayer(TILE_LAYER_URL, {
        attribution: TILE_LAYER_ATTRIBUTION,
    }).addTo(state.map);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            state.map.closePopup();
            document.activeElement?.blur();
        }
    });

    await updateStaticData(state);
    await updateMarkers(state);

    setInterval(() => updateStaticData(state), STATIC_UPDATE_MS);
    setInterval(() => updateMarkers(state), MARKER_UPDATE_MS);
};
