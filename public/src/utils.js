export const getDataForVehicle = (vehicle, staticData) => {
    if (staticData.has(vehicle["courseId"])) {
        return staticData.get(vehicle["courseId"]);
    } else {
        return Array.from(staticData.values()).find(
            (entry) => entry["vehicleId"] === vehicle["vehicleId"],
        );
    }
};

export const isVehicleInactive = (vehicle) => {
    return (
        !vehicle?.ignition ||
        vehicle?.status === "OFFLINE" ||
        vehicle?.status === "NO_DUTY" ||
        vehicle?.status === "COURSE_LEAVE" ||
        vehicle?.status === "NOT_MOVING"
    );
};
