import { Unzip, unzipSync } from "fflate";
import { fetchMimeType } from "./utils/network";
import { addStyle, createLayoutFromString } from "./utils/domUtils";
import { listZip, openInBrowser } from "./utils/zip";

const HANDLED_CLASS_NAME = 'better-tracced' as const

export function handleAttachments() {
    addPasteListener()
    pasteAttachmentPreviews()
}

let isListenerAdded = false
function addPasteListener() {
    if (isListenerAdded) {
        return
    }

    isListenerAdded = true

    const ticketNumber = window.location.href.match(/\/ticket\/(\d+)/)?.[1]

    if (!ticketNumber) {
        return
    }

    window.addEventListener('paste', (e) => {
        if (
            document.activeElement &&
            document.activeElement instanceof HTMLElement &&
            (
                document.activeElement.tagName === 'INPUT' ||
                document.activeElement.tagName === 'TEXTAREA' ||
                document.activeElement.isContentEditable
            )
        ) {
            return
        }

        const attachmentUrl = `${window.location.origin}/attachment/ticket/${ticketNumber}/?action=new`
        window.open(attachmentUrl, '_blank')
    })
}

/**
 * Finds all '/raw-attachment/' links and pastes preview after
 */
async function pasteAttachmentPreviews() {
    const allLinkEls = document.getElementsByTagName('a');

    const unhandledAttachmentLinkEls = [...allLinkEls]
        .filter(it => it.href.includes('/raw-attachment/') && !it.classList.contains(HANDLED_CLASS_NAME))

    for (const attachmentLinkEl of unhandledAttachmentLinkEls) {
        try {
            attachmentLinkEl.classList.add(HANDLED_CLASS_NAME)

            const attachmentUrl = attachmentLinkEl.href

            if (attachmentUrl.endsWith('.har')) {
                addStyle('better-trac-har', `
                        .better-trac-har {
                            max-height: 400px;
                            border: 1px solid #ccc;
                            width: 100%;
                            padding: 4px;
                            overflow: auto;
                            display: flex;
                            flex-direction: column;
                            gap: 4px;
                            cursor: pointer;
                        }
                `)

                const harlLinkEl = createLayoutFromString(`
                    <div class="better-trac-har">
                        Open .HAR
                    </div>
                `)

                harlLinkEl.addEventListener('click', async () => {
                    const res = await fetch(attachmentUrl);
                    const fileContentBuffer = new Uint8Array(await res.arrayBuffer());
                    openInBrowser(fileContentBuffer);
                });

                attachmentLinkEl.parentElement?.insertBefore(harlLinkEl, attachmentLinkEl)

                return
            }

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
                            cursor: pointer;
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