const VALID_CITIES = ["Delhi", "Mumbai", "London"];
const normalizeCity = (city) => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
export const getTemperature = async ({ city }) => {
    if (!city) {
        return {
            success: false,
            error: {
                code: "MISSING_CITY",
                message: "City is required",
            },
        };
    }
    const normalizedCity = normalizeCity(city);
    if (!VALID_CITIES.includes(normalizedCity)) {
        return {
            success: false,
            error: {
                code: "CITY_NOT_FOUND",
                message: `City "${city}" not found`,
                suggestion: "Try Delhi, Mumbai, or London",
            },
        };
    }
    return {
        success: true,
        tool: "gettemperature",
        data: {
            city: normalizedCity,
            temperature: "16 °C",
            unit: "celsius",
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
};
//# sourceMappingURL=temperature.js.map