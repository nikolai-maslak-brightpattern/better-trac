/**
 * Creates an HTML element from a string
 */
export function createLayoutFromString(content: string): HTMLElement {
    const div = document.createElement("div");
    div.innerHTML = content;
    return div.children[0] as HTMLElement;
}

/**
 * Adds a style element to the document head if it doesn't already exist
 */
export function addStyle(key: string, content: string) {
    if (!document.getElementById(key)) {
        const style = document.createElement("style");
        style.id = key;
        style.innerHTML = content;
        document.head.appendChild(style);
    }
}