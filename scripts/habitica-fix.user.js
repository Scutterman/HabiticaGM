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
$(document).ready(function () {
    $(document).on('keypress', '.new-message-row textarea', send_chat_on_ctrl_enter);
    $(document).on('click', '.view-party button', view_more_party_members);
    //$('#app').before('<button class="show-all-pets-and-mounts" style="margin-top: 56px;">Show All Pets</button>');
    // TODO:: Resetting pets and mounts removes the clearfix bar
    $(document).on('click', '.show-all-pets-and-mounts', toggle_view_pets);
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

function toggle_view_pets() {
    if ($('.row.stable .standard-page').parent().data('petsReplaced') === true) {
        resetPets()
    } else {
        view_all_pets();
    }
}

function view_all_pets() {
    var v = $('.row.stable').get(0).__vue__;
    
    var types = [
        {
            key: 'pet', name: 'pets', group: v._computedWatchers.petGroups, rowGroup: v.pets, class: v.getPetItemClass
        }, {
            key:'mount', name:'mounts', group:v._computedWatchers.mountGroups, rowGroup: v.mounts, class: (item) => {return item.isOwned() ? ('Mount_Icon_' + item.key) : 'PixelPaw GreyedOut'}
        }
    ];

    var $titleAndSorting = $('.row.stable .standard-page > .clearfix');
    var $drawer = $('.row.stable .standard-page .drawer-container');

    var $old = $('.row.stable .standard-page');
    var $new = $('<div class="standard-page"></div>');
    $new.append($titleAndSorting);

    $.each(types, (_, type) => {
        var $html = $('<div></div>');
        $html.append($('<h2>' + type.name + '</h2>'));

        $.each(type.group.value, (_, typeGroup) => {
            if (!v.viewOptions[typeGroup.key].selected) { return true; }

            var $groupHtml = $('<div></div>');
            if (v.viewOptions[typeGroup.key].animalCount !== 0) { $groupHtml.append('<h4>' + typeGroup.label + '</h4>'); }
            var sortBy = (
                typeGroup.key == 'questPets' ||
                typeGroup.key == 'questMounts'
            ) ? 'sortByHatchable' : 'sortByColor';

            $.each(type.rowGroup(typeGroup, v.hideMissing, sortBy, v.searchTextThrottled), (_, rowGroup) => {
                
                var $rowHtml = $('<div class="pet-row d-flex" data-v-57f7e6d6=""></div>');
            
                $.each(rowGroup, (_, item) => {
                    var $rowGroupHtml = $('<div class="pet-group ' + (item.isLastInRow ? 'last' : '') + '"></div>');
                    var $itemHtml = $('<div class="item-wrapper">');
                    var title = item.key + ' ' + type.key;

                    if (!item.isOwned()) {
                        $itemHtml.append($('<div class="item item-empty" title="' + title + '"><span class="item-content ' + type.class(item) + '"></span></div>'));
                    }
                    else {
                        $itemHtml.append($('<div class="item" title="' + title + '"><span class="item-content ' + type.class(item) + '"></span></div>'));
                    }
                    $rowGroupHtml.append($itemHtml);
                    $rowHtml.append($rowGroupHtml);
                });
                $groupHtml.append($rowHtml);
            });
            $html.append($groupHtml);
        });
        $new.append($html);
    });

    $('.row.stable .standard-page').parent().data('oldContent', $old);
    $('.row.stable .standard-page').parent().data('petsReplaced', true);
    $('.row.stable .standard-page').replaceWith($new);
}

function resetPets() {
    var $parent = $('.row.stable .standard-page').parent();
    if (typeof $parent.data('oldContent') !== 'undefined') {
        $('.row.stable .standard-page').replaceWith($parent.data('oldContent'));
    }

    $parent.data('petsReplaced', false);
}
/*
This is how you dispatch an action from the store:
let members = $('#app').get(0).__vue__.$store.dispatch('members:getGroupMembers', {
        groupId: 'the-group-id',
        includeAllPublicFields: true,
      });
*/
