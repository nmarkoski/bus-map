export const MAP_ELEMENT_ID = "map";

export const MAP_CENTER = {
    lat: 42.0007,
    lng: 21.4246,
};
export const MAP_BOUNDS = {
    north: 42.19895100125,
    south: 41.75894954504,
    east: 22.195875701172,
    west: 20.933134675262,
};
export const MAP_ZOOM = 13;

export const MAP_API_ID = "YOUR_MAP_ID";

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
