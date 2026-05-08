let isListenerAdded = false

export function addPasteListener() {
    if (isListenerAdded) {
        return
    }

    isListenerAdded = true

    if (window.location.href.match(/\/attachment\/ticket\/(\d+)/)) {
        return
    }

    const ticketNumber = window.location.href.match(/\/ticket\/(\d+)/)?.[1]

    if (!ticketNumber) {
        return
    }

    window.addEventListener('paste', () => {
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
