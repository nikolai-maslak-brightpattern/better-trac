main()

function main() {
    const HANDLED_CLASS_NAME = 'better-tracced'

    setInterval(async () => {
        const allLinkEls = document.getElementsByTagName('a');

        const unhandledAttachmentLinkEls = [...allLinkEls]
            .filter(it => it.href.includes('/raw-attachment/') && !it.classList.contains(HANDLED_CLASS_NAME))

        for (const attachmentLinkEl of unhandledAttachmentLinkEls) {
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

            console.log('Better trac: unhandled mime', attachmentMimeType);
        }
    }, 300)

    function createLayoutFromString(content: string): HTMLElement {
        const div = document.createElement("div");
        div.innerHTML = content;
        return div.children[0] as HTMLElement;
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
}
