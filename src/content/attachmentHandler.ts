import { fetchMimeType } from "./utils/network";
import { pasteHarPreview } from "./attachments/harPreview";
import { pasteMDPreview } from "./attachments/mdPreview";
import { pasteVideoPreview } from "./attachments/videoPreview";
import { pasteZipPreview } from "./attachments/zipPreview";
import { pasteImagePreview } from "./attachments/imagePreview";

const HANDLED_CLASS_NAME = 'better-tracced' as const

export async function pasteAttachmentPreviews() {
    const allLinkEls = document.getElementsByTagName('a');

    const unhandledAttachmentLinkEls = [...allLinkEls]
        .filter(it => it.href.includes('/raw-attachment/') && !it.classList.contains(HANDLED_CLASS_NAME))

    for (const attachmentLinkEl of unhandledAttachmentLinkEls) {
        try {
            attachmentLinkEl.classList.add(HANDLED_CLASS_NAME)

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

            const attachmentMimeType = await fetchMimeType(attachmentUrl)

            if (attachmentMimeType?.startsWith('video/')) {
                pasteVideoPreview(attachmentLinkEl, attachmentUrl)
                return
            }

            if (attachmentMimeType?.startsWith('application/zip')) {
                pasteZipPreview(attachmentLinkEl, attachmentUrl)
                return
            }

            if (attachmentMimeType?.startsWith('image/')) {
                pasteImagePreview(attachmentLinkEl, attachmentUrl)
                return
            }

            console.log('Better trac: unhandled mime', attachmentMimeType);
        } catch (error) {
            console.warn('Better trac: failed to process attachment', attachmentLinkEl, error);
        }
    }
}
