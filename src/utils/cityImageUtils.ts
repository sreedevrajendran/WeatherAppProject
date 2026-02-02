
/**
 * Fetches a representative image for a city using usage-free Wikipedia API.
 * This provides "real" location-based backgrounds.
 */
export async function getCityImage(cityName: string): Promise<string | null> {
    if (!cityName) return null;

    try {
        // Wikipedia Summary API
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
        const res = await fetch(url);

        if (!res.ok) return null;

        const data = await res.json();

        if (data.originalimage && data.originalimage.source) {
            return data.originalimage.source;
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch city image:", error);
        return null;
    }
}
