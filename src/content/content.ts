import { pasteAttachmentPreviews } from "./attachmentHandler.js";
import { handleAttachmentForm } from "./formHandler.js";
import { addPasteListener } from "./pasteListener.js";

main()

function main() {
    const tick = () => {
        addPasteListener()
        pasteAttachmentPreviews()
        handleAttachmentForm()
    }

    tick()
    setInterval(tick, 1000)
}
