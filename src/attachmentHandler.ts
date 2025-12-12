import { Unzip, unzipSync } from "fflate";
import { fetchMimeType } from "./utils/network";
import { addStyle, createLayoutFromString } from "./utils/domUtils";
import { listZip, openInBrowser } from "./utils/zip";

const HANDLED_CLASS_NAME = 'better-tracced' as const

/**
 * Finds all '/raw-attachment/' links and pastes preview after
 */
export async function handleAttachments() {
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
                            const result = unzipSync(buffer, { filter: file => file.name === filePath });
                            const fileContentBuffer = result[filePath];

                            if (!fileContentBuffer) return

                            openInBrowser(fileContentBuffer);
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
}