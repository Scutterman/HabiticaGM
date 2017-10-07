/**
 * README:
 * To use this script:
 * - Copy this entire script into the clipboard (ctrl + a followed by ctrl + c).
 * - Press F12 to open the web developer console.
 * - Select the "Console" tab.
 * - There will be a small area at the bottom where you can enter text. Click on that.
 * - Paste the script into that area (ctrl + v).
 * - Press the Enter button.
 * - Reset the pets by refreshing the page or visiting another page and coming back.
 */
if (!window.jQuery) {
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() { init(); };
    document.getElementsByTagName("head")[0].appendChild(script);
}
else {
    init();
}

function init() {
        
    var v = $('.row.stable').get(0).__vue__;

    var types = [
        {
            key: 'pet', name: 'pets', group: v._computedWatchers.petGroups, rowGroup: v.pets, class: v.getPetItemClass
        }, {
            key:'mount', name:'mounts', group:v._computedWatchers.mountGroups, rowGroup: v.mounts, class: (item) => {return item.isOwned() ? ('Mount_Icon_' + item.key) : 'PixelPaw GreyedOut'}
        }
    ];

    var $titleAndSorting = $('.standard-page .clearfix');
    var $drawer = $('.standard-page .drawer-container');

    var $old = $('.standard-page');
    var $new = $('<div class="standard-page">');
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

            console.log(typeGroup.key, sortBy);
            
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

    $('.standard-page').replaceWith($new);
}