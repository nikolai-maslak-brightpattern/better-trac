const HANDLED_CLASS_NAME = 'better-tracced' as const

/**
 * Waits for attachment form and adds paste event handler to make it possible to paste files directly
 */
export async function handleAttachmentForm() {
    const attachmentFormEl = document.getElementById('attachment');
    const fileInputEl = attachmentFormEl?.querySelector<HTMLInputElement>('input[type="file"]');

    if (
        !attachmentFormEl ||
        attachmentFormEl.classList.contains(HANDLED_CLASS_NAME) ||
        !fileInputEl
    ) {
        return
    }

    attachmentFormEl?.classList.add(HANDLED_CLASS_NAME)

    console.log('Better trac: attachment form', attachmentFormEl);

    document.addEventListener("paste", (event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items?.find((item) => item.kind === "file" && item.type.startsWith("image/"));
        const file = imageItem?.getAsFile();

        if (!file) return;

        const ext = file.name.substring(file.name.lastIndexOf("."));
        const defaultFileName = "screenshot-" + Date.now() + ext
        const fileName = window.prompt("Enter file name", defaultFileName) || defaultFileName;
        const renamedFile = new File([file], fileName, { type: file.type });

        const dt = new DataTransfer();
        dt.items.add(renamedFile);

        fileInputEl.files = dt.files;
        // to enable submit button
        fileInputEl.dispatchEvent(new Event("change", { bubbles: true }))

        console.log('Better trac: attachment pasted', renamedFile);
    });
}