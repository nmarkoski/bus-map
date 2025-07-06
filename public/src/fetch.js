export const fetchData = async (endpoint) => {
    const response = await fetch(endpoint, {
        method: "GET",
    });
    return response.json();
};
