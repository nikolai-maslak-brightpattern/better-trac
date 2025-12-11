import { Unzip, unzipSync } from "fflate";

main()

function main() {
    const HANDLED_CLASS_NAME = 'better-tracced' as const

    setInterval(async () => {
        const allLinkEls = document.getElementsByTagName('a');

        const unhandledAttachmentLinkEls = [...allLinkEls]
            .filter(it => it.href.includes('/raw-attachment/') && !it.classList.contains(HANDLED_CLASS_NAME))

        for (const attachmentLinkEl of unhandledAttachmentLinkEls) {
            try {
                attachmentLinkEl.classList.add(HANDLED_CLASS_NAME)

                const attachmentUrl = attachmentLinkEl.href

                const attachmentMimeType = await fetchMimeType(attachmentUrl)

                if (attachmentMimeType?.startsWith('video/')) {
                    const videoEl = createLayoutFromString(
                        `<video
                            style="
                                height: 400px;
                                width: 100%;
                            "
                            controls
                            src="${attachmentUrl}"
                        />`
                    )

                    attachmentLinkEl.parentElement?.insertBefore(videoEl, attachmentLinkEl)
                    console.log('Better trac: video added', videoEl);

                    return
                }

                if (attachmentMimeType?.startsWith('application/zip')) {
                        const res = await fetch(attachmentUrl);
                        const buffer = new Uint8Array(await res.arrayBuffer());
                        const files = await listZip(buffer);

                        addStyle('better-trac-zip', `
                            .better-trac-zip {
                                max-height: 400px;
                                border: 1px solid #ccc;
                                width: 100%;
                                padding: 4px;
                                overflow: auto;
                                display: flex;
                                flex-direction: column;
                                gap: 4px;
                            }
                        `)

                        const zipTreeEl = createLayoutFromString(`<div class="better-trac-zip"></div>`)

                        files.map(filePath => {
                            addStyle('better-trac-zip-file', `
                                .better-trac-zip-file {
                                    padding: 4px;
                                    border-radius: 4px;
                                    background: #f0f0f0;
                                    cursor: pointer;
                                }
                                .better-trac-zip-file:hover {
                                    background: #e0e0e0;
                                }
                            `)

                            const fileEl = createLayoutFromString(`
                                <div class="better-trac-zip-file">
                                    ${filePath}
                                </div>
                            `)

                            fileEl.addEventListener('click', async () => {
                                const data = await readFileFromZip(buffer, filePath);

                                if (!data) {
                                    return
                                }

                                openInBrowser(data);
                            });

                            zipTreeEl.appendChild(fileEl)
                        })

                        attachmentLinkEl.parentElement?.insertBefore(zipTreeEl, attachmentLinkEl)

                        return;
                }

                if (attachmentMimeType?.startsWith('image/')) {
                    const imageEl = createLayoutFromString(
                        `<img
                            style="
                                max-height: 400px;
                                width: 100%;
                            "
                            src="${attachmentUrl}"
                        />`
                    )

                    attachmentLinkEl.parentElement?.insertBefore(imageEl, attachmentLinkEl)
                    console.log('Better trac: image added', imageEl);

                    return
                }

                console.log('Better trac: unhandled mime', attachmentMimeType);
            } catch (error) {
                console.warn('Better trac: failed to process attachment', attachmentLinkEl, error);
            }
        }
    }, 1000)
}

function createLayoutFromString(content: string): HTMLElement {
    const div = document.createElement("div");
    div.innerHTML = content;
    return div.children[0] as HTMLElement;
}

function addStyle(key: string, content: string) {
    if (!document.getElementById(key)) {
        const style = document.createElement("style");
        style.id = key;
        style.innerHTML = content;
        document.head.appendChild(style);
    }
}

async function fetchMimeType(url: string) {
    try {
        let response = await fetch(url, { method: "HEAD" });
        let mime = response.headers.get("content-type");
        return mime || undefined;
    } catch {
        return undefined
    }
}

async function listZip(buffer: Uint8Array): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const names: string[] = [];
        const unzip = new Unzip();

        unzip.onfile = (file) => {
            names.push(file.name);
        };

        unzip.push(buffer, true);
        resolve(names);
    });
}

function readFileFromZip(
    zipped: Uint8Array | ArrayBuffer,
    targetPath: string
): Uint8Array | null {
    const zipData = zipped instanceof Uint8Array ? zipped : new Uint8Array(zipped);

    const result = unzipSync(zipData, {
        filter: file => file.name === targetPath,
    });
    return (result as Record<string, Uint8Array>)[targetPath] ?? null;
}

function openInBrowser(data: Uint8Array, mime = "text/plain") {
    const blob = new Blob([data as any], { type: mime });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
}
