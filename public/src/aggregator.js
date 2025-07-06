import { fetchData } from "./fetch.js";
import { ENDPOINTS } from "./constants.js";

export const getStaticData = async () => {
    const [duties, courses, routes, lines] = await Promise.all([
        fetchData(ENDPOINTS.DUTIES),
        fetchData(ENDPOINTS.COURSES),
        fetchData(ENDPOINTS.ROUTES),
        fetchData(ENDPOINTS.LINES),
    ]);

    const aggregated = new Map();

    duties.forEach((duty) => {
        const coursesIdx = courses.findIndex(
            (course) => course["id"] === duty["courseId"],
        );
        const routesIdx = routes.findIndex(
            (route) => route["id"] === courses[coursesIdx]["routeId"],
        );
        const linesIdx = lines.findIndex(
            (line) => line["id"] === routes[routesIdx]["lineId"],
        );
        aggregated.set(duty["courseId"], {
            vehicleId: duty["vehicleId"],
            lineId: routes[routesIdx]["lineId"] ?? lines[linesIdx]["id"],
            routeId: courses[coursesIdx]["routeId"] ?? routes[routesIdx]["id"],
            type: lines[linesIdx]["type"],
            kind: courses[coursesIdx]["kind"],
            nightly: lines[linesIdx]["nightly"],
            carrier: lines[linesIdx]["carrier"],
            number: lines[linesIdx]["number"],
            name: lines[linesIdx]["name"],
            direction: routes[routesIdx]["name"],
        });
    });

    return aggregated;
};

export const getRealtimeData = async () => {
    const [positions, statuses] = await Promise.all([
        fetchData(ENDPOINTS.POSITIONS),
        fetchData(ENDPOINTS.STATUSES),
    ]);

    const aggregated = [];

    statuses.forEach((status) => {
        const positionsIdx = positions.findIndex(
            (position) => position["vehicleId"] === status["vehicleId"],
        );
        if (positionsIdx >= 0) {
            aggregated.push({
                courseId: status["courseId"],
                vehicleId: status["vehicleId"],
                ignition: status["ignition"],
                status: status["status"],
                speed: status["speed"],
                delay: status["delay"],
                lat: positions[positionsIdx]["lat"],
                lng: positions[positionsIdx]["lon"],
                time: positions[positionsIdx]["time"],
            });
        }
    });

    return aggregated;
};
