export const MAP_ELEMENT_ID = "map";

export const MAP_CENTER = [41.9959, 21.4314];
export const MAP_BOUNDS = [
    [41.75894954504, 20.933134675262],
    [42.19895100125, 22.195875701172],
];
export const MAP_ZOOM = 12;

export const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_LAYER_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const ENDPOINTS = {
    POSITIONS: "/api/rest-avl/rtpi/positions",
    STATUSES: "/api/rest-its/rtpi/vehicle-statuses",
    DUTIES: "/api/rest-its/scheme/duties",
    COURSES: "/api/rest-its/scheme/courses",
    ROUTES: "/api/rest-its/scheme/routes",
    LINES: "/api/rest-its/scheme/lines",
};

export const VEHICLE_STALE_MS = 3 * 60 * 1000; // 3 minutes
export const STATIC_UPDATE_MS = 30 * 60 * 1000; // 30 minutes
export const MARKER_UPDATE_MS = 3 * 1000; // 3 seconds
