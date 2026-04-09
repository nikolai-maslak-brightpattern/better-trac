/**
 * Fetches the MIME type of a resource from its URL
 */
export async function fetchMimeType(url: string) {
    try {
        let response = await fetch(url, { method: "HEAD" });
        let mime = response.headers.get("content-type");
        return mime || undefined;
    } catch {
        return undefined
    }
}