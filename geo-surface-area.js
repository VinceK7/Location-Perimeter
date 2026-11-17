const EARTH_RADIUS_METERS = 6371000;

function calculateGeoArea(...locations) {
    if (locations.length < 3) {
        throw new RangeError("A polygon must have at least three locations.");
    }

    const vertices = locations.map((location) => {
        if (
            location === null ||
            typeof location !== "object" ||
            !Number.isFinite(location.latitude) ||
            !Number.isFinite(location.longitude)
        ) {
            throw new TypeError("Each location must have numeric latitude and longitude.");
        }

        if (
            location.latitude < -90 ||
            location.latitude > 90 ||
            location.longitude < -180 ||
            location.longitude > 180
        ) {
            throw new RangeError("Latitude must be between -90 and 90 and longitude between -180 and 180.");
        }

        const latitude = location.latitude * Math.PI / 180;
        const longitude = location.longitude * Math.PI / 180;

        return [
            Math.cos(latitude) * Math.cos(longitude),
            Math.cos(latitude) * Math.sin(longitude),
            Math.sin(latitude)
        ];
    });

    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const subtract = (a, b) => a.map((value, index) => value - b[index]);
    const cross = (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];

    let sphericalArea = 0;
    const first = vertices[0];

    for (let index = 1; index < vertices.length - 1; index++) {
        const second = vertices[index];
        const third = vertices[index + 1];
        const determinant = dot(
            first,
            cross(subtract(second, first), subtract(third, first))
        );
        const denominator =
            1 +
            dot(first, second) +
            dot(second, third) +
            dot(third, first);

        sphericalArea += 2 * Math.atan2(determinant, denominator);
    }

    return Math.abs(sphericalArea) * EARTH_RADIUS_METERS ** 2;
}

const area = calculateGeoArea(
    { latitude: 42.635912, longitude: 23.369442 },
    { latitude: 42.635917, longitude: 23.369905 },
    { latitude: 42.636574, longitude: 23.369877 }
);

console.log(`Area: ${area.toFixed(2)} m²`);