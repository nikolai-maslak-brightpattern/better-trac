import { handleAttachments } from "./attachmentHandler.js";
import { handleAttachmentForm } from "./formHandler.js";

main()

function main() {
    const tick = () => {
       handleAttachments()
       handleAttachmentForm()
    }

    tick()
    setInterval(tick, 1000)
}
