$(function (){

    function getFaucetEl(urlid) {
        return $(".faucet[data-faucet-id='"+urlid+"']");
    }

    function loadFaucets(faucets) {
        faucets = faucets ? faucets : {};

        $(".faucet input.time").val("");
        $(".faucet").removeClass("hidden like dislike star");

        $.each(faucets, function(url, faucet){
            var f = getFaucetEl(url);
            $('input.time', f).val(faucet['time']);
            if(faucet['visit'] && faucet['time'] && (nowTime() - faucet['visit'] < faucet['time'])) {
                $('a.visit', f).addClass('warning hollow');
            }
            if(faucet['star']) f.addClass('star');
            if(faucet['like']) f.addClass('like');
            if(faucet['dislike']) f.addClass('dislike');
            if(faucet['hide']) f.addClass('hidden');
        });

        return faucets;
    }

    function saveFaucets(newfaucets) {
        newfaucets = newfaucets ? newfaucets : faucets;
        localStorage.setItem('faucets', JSON.stringify(faucets));
        console.log("Save faucets");
    }

    // количество минут прошедших с 1 января 1970 года
    function nowTime() {
        return new Date().getTime()/60000;
    }

    function onVisit(e) {
        var f = $(e.target).parents(".faucet");
        var urlid = f.attr('data-faucet-id');
        var url = $('a.link', f).attr('href');
        var faucet = faucets[urlid];
        if (faucet && !faucet['visit']) {
            faucet['visit'] = nowTime() + 2;
            $(e.target).addClass('warning hollow');
        }
        window.open(url, '_blank');
        console.log("Visit: " + urlid);
    }

    function onLike(e) {
        var f = $(e.target).parents(".faucet");
        var urlid = f.attr('data-faucet-id');
        var faucet = faucets[urlid] ? faucets[urlid] : faucets[urlid] = {};
        faucet['like'] = faucet['like'] ? false : true;
        if (faucet['like']) {
            f.addClass('like');
            console.log("Like: " + urlid);
        } else {
            delete faucet['like'];
            f.removeClass('like');
            console.log("Unlike: " + urlid);
        }
        delete faucet['dislike'];
        f.removeClass('dislike');
    }

    function onDislike(e) {
        var f = $(e.target).parents(".faucet");
        var urlid = f.attr('data-faucet-id');
        var faucet = faucets[urlid] ? faucets[urlid] : faucets[urlid] = {};
        faucet['dislike'] = faucet['dislike'] ? false : true;
        if (faucet['dislike']) {
            f.addClass('dislike');
            console.log("Dislike: " + urlid);
        } else {
            delete faucet['dislike'];
            f.removeClass('dislike');
            console.log("Undislike: " + urlid);
        }
        delete faucet['like'];
        f.removeClass('like');
    }

    function onStar(e) {
        var f = $(e.target).parents(".faucet");
        var urlid = f.attr('data-faucet-id');
        var faucet = faucets[urlid] ? faucets[urlid] : faucets[urlid] = {};
        faucet['star'] = faucet['star'] ? false : true;
        if (faucet['star']) {
            f.addClass('star');
            console.log("Star: " + urlid);
        } else {
            delete faucet['star'];
            f.removeClass('star');
            console.log("Unstar: " + urlid);
        }
    }

    function onHide(e) {
        var f = $(e.target).parents(".faucet");
        var urlid = f.attr('data-faucet-id');
        var faucet = faucets[urlid] ? faucets[urlid] : faucets[urlid] = {};
        faucet['hide'] = true;
        f.addClass('hidden');
        console.log("Hide: " + urlid);
    }

    function onShow(e) {
        var f = $(e.target).parents(".faucet");
        var urlid = f.attr('data-faucet-id');
        var url = $('a.link', f).attr('href');
        var faucet = faucets[urlid] ? faucets[urlid] : faucets[urlid] = {};
        delete faucet['hide'];
        f.removeClass('hidden');
        console.log("Show: " + urlid);
    }

    function changeTime(e) {
        var time = $(e.target).val();
        var f = $(e.target).parents(".faucet");
        var urlid = f.attr('data-faucet-id');
        var faucet = faucets[urlid] ? faucets[urlid] : faucets[urlid] = {};
        if (time > 0) {
            faucet['time'] = time;
            console.log("Change time: " + faucet['time'] + ' - ' + urlid);
        } else if (faucet['time']) {
            delete faucet['time'];
            console.log("Delete time: " + urlid);
        }

    }

    function onUnstarAll() {
        $.each(faucets, function(urlid, faucet){
            delete faucet['star']
        });
        $(".faucet.star").removeClass('star');
        noty({text: "All star has been removed from faucets!"});
    }

    function onUndislikeAll() {
        $.each(faucets, function(urlid, faucet){
            delete faucet['dislike']
        });
        $(".faucet").removeClass('dislike');
        noty({text: "All dislikes has been removed from faucets!"});
    }

    function onUnlikeAll() {
        $.each(faucets, function(urlid, faucet){
            delete faucet['like']
        });
        $(".faucet").removeClass('like');
        noty({text: "All likes has been removed from faucets!"});
    }

    function onUnvisitAll() {
        $.each(faucets, function(urlid, faucet){
            delete faucet['visit']
        });
        $(".faucet a.visit").removeClass('warning hollow');
        noty({text: "Visit mark in all faucets has been reseted!"});
    }

    function onDellAllTimes() {
        $.each(faucets, function(urlid, faucet){
            delete faucet['time']
        });
        $(".faucet input.time").val('');
        onUnvisitAll();
        noty({text: "Value of times in all faucets has been removed!"});
    }

    // === SHOW & HIDE

    function onShowAll() {
        $.each(faucets, function(urlid, faucet){
            delete faucet['hide']
        });
        $(".faucet.hidden").removeClass('hidden');
        noty({text: "All faucets has been showing!"});
    }

    function onHideAll() {
        $('.faucet').addClass('hidden');
        $('.faucet').each(function (i, f) {
            var urlid = $(f).attr('data-faucet-id');
            var faucet = faucets[urlid] ? faucets[urlid] : faucets[urlid] = {};
            faucet['hide'] = true;
        });
        noty({text: "All faucets hidden!"});
    }

    function onToggleVisible() {
        $.each(faucets, function(urlid, faucet){
            if (faucet['hide']) {
                delete faucet['hide'];
            } else {
                faucet['hide'] = true;
            }
        });
        var h = $(".faucet.hidden");
        var s = $(".faucet:not(.hidden)");
        h.removeClass('hidden');
        s.addClass('hidden');
        noty({text: "All faucets has been toggle visibility!"});
    }

    // true - show, false - hide, null - nothing
    function showORhide(condition, noty_text) {
        $.each(faucets, function(urlid, faucet){
            var result = condition(urlid, faucet);
            if(result == null) return;
            if(result) {
                delete faucet['hide'];
                $(".faucet[data-faucet-id='"+urlid+"']").removeClass('hidden');
            } else {
                faucet['hide'] = true;
                $(".faucet[data-faucet-id='"+urlid+"']").addClass('hidden');
            }
        });
        if (noty_text) noty({text: noty_text});
    }

    // ======

    // === DATA

    function onSaveNow() {
        saveFaucets();
        noty({text: "Data success saved to Local Storage"});
    }

    function onGetData() {
        $("#modalGetData textarea").val(JSON.stringify(faucets));
    }

    function onSetData() {
        var data = $("#modalSetData textarea").val();
        var newfaucets = null;
        try {
            newfaucets = JSON.parse($("#modalSetData textarea").val());
        } catch (err) {}

        if(newfaucets) {
            faucets = loadFaucets(newfaucets);
            noty({type: 'success', text: "RAW Data success set and saved to Local Storage!"});
        } else {
            noty({type: 'error', text: "Error set RAW Data!"});
        }
    }

    function onCompactData() {
        var deleted = 0;
        var newfaucets = {};
        $.each(faucets, function(urlid, faucet){
            if(faucet['like'] || faucet['dislike'] ||
            faucet['star'] || faucet['hide'] || faucet['time']) {
                newfaucets[urlid] = faucet;
            } else {
                deleted++;
            }
        });
        faucets = newfaucets;
        saveFaucets();
        noty({text: "Data has been compacted and saved to Local Storage. "+deleted+" empty elements has been removed."});
    }

    function onDeleteNoFounds() {
        var deleted = 0;
        var newfaucets = {};
        $.each(faucets, function(urlid, faucet){
            if($(".faucet[data-faucet-id='"+urlid+"']").length) {
                newfaucets[urlid] = faucet;
            } else {
                deleted++;
            }
        });
        faucets = newfaucets;
        saveFaucets();
        noty({text: "All unnecessary elements are removed from the data and saved to Local Storage. "+deleted+" unnecessary elements has been removed."});
    }

    // === ADDRESS BOOK

    function loadAddressBook() {
        var book = JSON.parse(localStorage.getItem('addressbook'));
        if (!book) return;
        $('#addressbook .input-group').each(function (i, a){
            var coin = $('.input-group-label', a).text();
            $('.input-group-field', a).val(book[coin]);
        });
        noty({text: "Address book loaded from Local Storage!", type: 'success'});
    }

    function saveAddressBook() {
        var book = {};
        $('#addressbook .input-group').each(function (i, a){
            var coin = $('.input-group-label', a).text();
            var addr = $('.input-group-field', a).val();
            book[coin] = addr;
        });
        localStorage.setItem('addressbook', JSON.stringify(book));
        noty({text: "Address book has been saved to Local Storage!", type: 'success'});
    }

    function onCheckInAddressBook(e) {
         var addr = $(e.target).parents('.input-group').children('.input-group-field').val();
         window.open('https://faucetbox.com/check/' + addr, '_blank');
    }

    // ===

    // ======

    function onInterval() {
        $.each(faucets, function(urlid, faucet){
            if (!faucet['visit'] || !faucet['time']) return;
            if ((nowTime() - faucet['visit']) > faucet['time']) {
                var f = getFaucetEl(urlid);
                $('a.visit', f).removeClass('warning hollow');
                delete faucet['visit']
                if(faucet['star']) {
                    var url = $('a.link', f).attr('href');
                    var name = $('a.link', f).text();
                    noty({text: "<i class='fi-star'></i> Faucet ready to visit!<br>"+name, type: 'success'});
                }
            }
        });
        console.log("onInterval (review visits, save faucets to local storage)");
        saveFaucets(faucets);
    }

    // ========================================================================

    $(document).foundation();

    $.noty.defaults.layout = 'bottomRight';
    $.noty.defaults.theme = 'relax';
    $.noty.defaults.timeout = 8000;

    // Load Faucets Data
    // {url:{time:230, visit:"567834754"}}
    var faucets = {}
    var startupData = JSON.parse(localStorage.getItem('faucets'));
    if (startupData) {
        faucets = loadFaucets(startupData);
        noty({text: "Data loaded from Local Store!", type: 'success'});
    } else if(window.faucetslistdefaultdata) {
        startupData = window.faucetslistdefaultdata;
        noty({text: "Data loaded from defaults!"});
    } else {
        noty({text: "Data clear, not loaded!", type: 'alert'});
    }
    var faucets = loadFaucets(startupData);


    loadAddressBook();


    // Faucet events
    $(".faucet a.visit").click(onVisit);
    $(".faucet a.star").click(onStar);
    $(".faucet a.eye").click(onHide);
    $(".faucet div.ifhidden").click(onShow);
    $(".faucet input.time").change(changeTime);
    $(".faucet a.like").click(onLike);
    $(".faucet a.dislike").click(onDislike);

    // List
    $("#btn_unstarall").click(onUnstarAll);
    $("#btn_unvisitall").click(onUnvisitAll);
    $("#btn_undislikeall").click(onUndislikeAll);
    $("#btn_unlikeall").click(onUnlikeAll);
    $("#btn_delalltimes").click(onDellAllTimes);

    // Data
    $("#btn_savenow").click(onSaveNow);
    $("#btn_delnotfounds").click(onDeleteNoFounds);
    $("#btn_compactdata").click(onCompactData);
    $("#btn_getdata").click(onGetData);
    $("#btn_setdata").click(onSetData);

    // Show and Hide
    $("#btn_showall").click(onShowAll);
    $("#btn_hideall").click(onHideAll);
    $("#btn_togglevisible").click(onToggleVisible);

    $("#btn_showstared").click(function () { showORhide(function (urlid, faucet) { return faucet['star'] ? true : null; },
                                                        "Faucets with Star has been showing!"); });

    $("#btn_hidestared").click(function () { showORhide(function (urlid, faucet) { return faucet['star'] ? false : null; },
                                                        "Faucets with Star has been hidden!"); });

    $("#btn_showdisliked").click(function () { showORhide(function (urlid, faucet) { return faucet['dislike'] ? true : null; },
                                                          "Faucets with Dislike has been showing!"); });

    $("#btn_hidedisliked").click(function () { showORhide(function (urlid, faucet) { return faucet['dislike'] ? false : null; },
                                                          "Faucets with Star has been hidden!"); });

    $("#btn_showliked").click(function () { showORhide(function (urlid, faucet) { return faucet['like'] ? true : null; },
                                                       "Faucets with Like has been showing!"); });

    $("#btn_hideliked").click(function () { showORhide(function (urlid, faucet) { return faucet['like'] ? false : null; },
                                                       "Faucets with Like has been hidden!"); });

    $("#btn_showtimed").click(function () { showORhide(function (urlid, faucet) { return faucet['time'] ? true : null; },
                                                       "Faucets with Time has been showing!"); });

    $("#btn_hidetimed").click(function () { showORhide(function (urlid, faucet) { return faucet['time'] ? false : null; },
                                                       "Faucets with Time has been hidden!"); });

    $("#btn_showvisited").click(function () { showORhide(function (urlid, faucet) { return faucet['visit'] ? true : null; },
                                                       "Visited faucets has been showing!"); });

    $("#btn_hidevisited").click(function () { showORhide(function (urlid, faucet) { return faucet['visit'] ? false : null; },
                                                       "Visited faucets has been hidden!"); });

    $("#addressbook .showbookbtn").click(function () {$("#addressbook").toggleClass("hidden");});
    $("#addressbook .button.check").click(onCheckInAddressBook);
    $("#addressbook .button.save").click(saveAddressBook);

    onInterval();

    setInterval(onInterval, 30000);

    //noty({text: '<h4>Hi Capcher and Good Luck!</h4>', layout: 'center', type: 'info', timeout: 2000,
    //    animation: { open: {height: [ "toggle", "swing" ]}, close: {height: 'toggle'}, easing: 'swing', speed: 500 }});

});
