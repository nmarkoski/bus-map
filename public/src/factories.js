import { isVehicleInactive } from "./utils.js";

const createMarkerElement = (vehicle, vehicleData) => {
    const markerContent = document.createElement("div");
    markerContent.classList.add("marker");
    markerContent.textContent = vehicleData?.number.toString() ?? "?";

    if (vehicleData?.nightly) {
        markerContent.classList.add("nightly");
    }
    if (isVehicleInactive(vehicle)) {
        markerContent.classList.add("inactive");
    }

    return markerContent;
};

export const createMarkerIcon = (vehicle, vehicleData) => {
    const markerElement = createMarkerElement(vehicle, vehicleData);
    
    document.body.appendChild(markerElement);
    const width = markerElement.offsetWidth;
    const height = markerElement.offsetHeight;
    document.body.removeChild(markerElement);
    
    const markerHeight = height + 8;
    
    return L.divIcon({
        html: markerElement.outerHTML,
        className: "custom-marker-icon",
        iconSize: [width, markerHeight],
        iconAnchor: [width / 2, markerHeight],
        popupAnchor: [0, -markerHeight],
    });
};

const createInfoWindowItem = (identifier, value) => {
    const infoWindowItem = document.createElement("div");
    infoWindowItem.classList.add("item");

    const infoWindowIdentifier = document.createElement("span");
    infoWindowIdentifier.classList.add("identifier");
    infoWindowIdentifier.textContent = `${identifier}: `;
    infoWindowItem.append(infoWindowIdentifier);

    const infoWindowValue = document.createElement("span");
    infoWindowValue.classList.add("value");
    infoWindowValue.textContent = value;
    infoWindowItem.append(infoWindowValue);

    return infoWindowItem;
};

export const createPopupContent = (vehicle, vehicleData) => {
    const infoWindowContent = document.createElement("div");
    infoWindowContent.classList.add("infowindow");

    if (vehicleData?.nightly) {
        infoWindowContent.classList.add("nightly");
    }
    if (isVehicleInactive(vehicle)) {
        infoWindowContent.classList.add("inactive");
    }

    if (vehicleData?.name !== undefined) {
        const infoWindowHeader = document.createElement("div");
        infoWindowHeader.classList.add("header");
        infoWindowHeader.textContent = vehicleData.name;
        infoWindowContent.append(infoWindowHeader);
    }

    if (vehicleData?.direction !== undefined) {
        infoWindowContent.append(
            createInfoWindowItem("Direction", vehicleData.direction),
        );
    }

    if (vehicleData?.carrier !== undefined) {
        infoWindowContent.append(
            createInfoWindowItem("Carrier", vehicleData.carrier),
        );
    }

    if (vehicleData?.type !== undefined) {
        infoWindowContent.append(
            createInfoWindowItem("Type", vehicleData.type),
        );
    }

    if (vehicle?.status !== undefined) {
        infoWindowContent.append(
            createInfoWindowItem("Status", vehicle.status),
        );
    }

    if (vehicle?.ignition !== undefined) {
        infoWindowContent.append(
            createInfoWindowItem("Ignition", vehicle.ignition ? "✔️" : "✖️"),
        );
    }

    if (vehicle?.speed !== undefined) {
        infoWindowContent.append(
            createInfoWindowItem("Speed", `${vehicle.speed} km/h`),
        );
    }

    if (vehicle?.delay !== undefined) {
        const delay = new Date(Math.abs(vehicle.delay) * 1000);
        const seconds = String(delay.getSeconds()).padStart(2, "0");
        const minutes = String(delay.getMinutes()).padStart(2, "0");
        const delayText = `${minutes}:${seconds} ${vehicle.delay >= 0 ? "late" : "early"}`;
        infoWindowContent.append(createInfoWindowItem("Delay", delayText));
    }

    if (vehicle?.time !== undefined) {
        const time = new Date(vehicle.time * 1000);
        const timeText = time.toLocaleTimeString("en-EU", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        infoWindowContent.append(createInfoWindowItem("Last Update", timeText));
    }

    return infoWindowContent;
};
