// ==UserScript==
// @name Fix Habitica
// @description Habitica updated. Let's update the update
// @version 0.0.1
// @author Scutterman (Tom Willoughby)
// @namespace com.scutterman.gm.habitica
// @include https://habitica.com/*
// @include https://www.habitica.com/*
//
// @require https://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==

/** Hooks **/
$(function () {
    $(document).on('keypress', '.new-message-row textarea', send_chat_on_ctrl_enter);
});


/** Event callbacks **/
function send_chat_on_ctrl_enter(e) {
    if (e.ctrlKey && e.which == 13) {
        $('.send-chat').click();
    }
}