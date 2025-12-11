// ==UserScript==
// @name         Better Trac
// @namespace    http://tampermonkey.net/
// @version      2025-12-11
// @description  Video preview without downloading
// @author       Nikolai Maslak
// @match        https://trac.brightpattern.com/*
// @grant        none
// @sandbox      JavaScript
// ==/UserScript==
const HANDLED_CLASS_NAME = 'better-tracced';
main();
function main() {
    setInterval(() => {
        const allLinkEls = document.getElementsByTagName('a');
        const unhandledAttachmentLinkEls = [...allLinkEls]
            .filter(it => it.href.includes('/attachment/') && !it.classList.contains(HANDLED_CLASS_NAME));
        unhandledAttachmentLinkEls.forEach(attachmentLinkEl => {
            attachmentLinkEl.classList.add(HANDLED_CLASS_NAME);
            const attachmentUrl = attachmentLinkEl.href
                .replace('/attachment/', '/raw-attachment/');
            const videoEl = createLayoutFromString(`<video
                    style="
                        height: 400px;
                        width: 100%;
                    "
                    controls
                    src="${attachmentUrl}"
                />`);
            attachmentLinkEl.parentElement?.insertBefore(videoEl, attachmentLinkEl);
            console.log('Better trac: video added', videoEl);
        });
    }, 300);
    function createLayoutFromString(content) {
        const div = document.createElement("div");
        div.innerHTML = content;
        return div.children[0];
    }
}
