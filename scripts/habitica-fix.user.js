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

    // TODO:: work out how to hook into the app loaded callback so we are able to tweak the components.
    /*$('#app').get(0).__vue__.$options.mounted.push(function(){
        app_mounted();
    });*/
});

/** Event callbacks **/
function app_mounted(){
    $('#app-header').parent().get(0).__vue__.$options.mounted.push(function(){
        view_more_party_members();
    });
}

function send_chat_on_ctrl_enter(e) {
    if (e.ctrlKey && e.which == 13) {
        $('.send-chat').click();
    }
}

function view_more_party_members() {
    $('#app-header').parent().get(0).__vue__._computedWatchers.membersToShow.getter = function(){ return 1000; }
    $('#app-header .party-members').css({width: 'auto', overflowX: 'scroll'});
}

/*
This is how you dispatch an action from the store:
let members = $('#app').get(0).__vue__.$store.dispatch('members:getGroupMembers', {
        groupId: 'the-group-id',
        includeAllPublicFields: true,
      });
*/
