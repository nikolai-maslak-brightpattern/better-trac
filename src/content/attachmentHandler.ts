import { fetchHeaders } from "./utils/network";
import { pasteHarPreview } from "./attachments/harPreview";
import { pasteMDPreview } from "./attachments/mdPreview";
import { pasteVideoPreview } from "./attachments/videoPreview";
import { pasteZipPreview } from "./attachments/zipPreview";
import { pasteImagePreview } from "./attachments/imagePreview";

export async function pasteAttachmentPreviews() {
    const allLinkEls = document.getElementsByTagName('a');

    const attachmentLinkEls = [...allLinkEls].filter(it => it.href.includes('/raw-attachment/'))

    attachmentLinkEls.forEach(async (attachmentLinkEl) => {
        try {
            const attachmentUrl = attachmentLinkEl.href

            if (attachmentUrl.endsWith('.har')) {
                pasteHarPreview(attachmentLinkEl, attachmentUrl)
                return
            }

            // https://trac.brightpattern.com/ticket/46620
            if (attachmentUrl.endsWith('.md')) {
                pasteMDPreview(attachmentLinkEl, attachmentUrl)
                return
            }

            const { mimeType, contentLength } = await fetchHeaders(attachmentUrl)

            if (mimeType?.startsWith('video/')) {
                pasteVideoPreview(attachmentLinkEl, attachmentUrl)
                return
            }

            if (mimeType?.startsWith('application/zip')) {
                pasteZipPreview(attachmentLinkEl, attachmentUrl, contentLength)
                return
            }

            if (mimeType?.startsWith('image/')) {
                pasteImagePreview(attachmentLinkEl, attachmentUrl)
                return
            }

            console.log('Better trac: unhandled mime', mimeType);
        } catch (error) {
            console.warn('Better trac: failed to process attachment', attachmentLinkEl, error);
        }
    })
}
