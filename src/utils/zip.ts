import { Unzip } from "fflate";

/**
 * Lists all files in a ZIP archive
 */
export async function listZip(buffer: Uint8Array): Promise<string[]> {
    return new Promise(resolve => {
        const names: string[] = [];
        const unzip = new Unzip();

        unzip.onfile = (file) => {
            names.push(file.name);
        };

        unzip.push(buffer, true);
        resolve(names);
    });
}

/**
 * Opens data in a new browser tab
 */
export function openInBrowser(data: Uint8Array, mime = "text/plain") {
    const blob = new Blob([data as any], { type: mime });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
}