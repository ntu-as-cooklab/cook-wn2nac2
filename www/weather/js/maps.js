/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 */

 var VisibleMenu = '';	// record now menu ID

 // show or hide menu
 function switchMenu( theMainMenu, theSubMenu, theEvent ){
 	var SubMenu = document.getElementById( theSubMenu );
 	if( SubMenu.style.display == 'none' ){	// show
 		SubMenu.style.display = 'block';
 		hideMenu();	// hide
 		VisibleMenu = theSubMenu;
 	}
 	else{	// hide
 		if( theEvent != 'MouseOver' || VisibleMenu != theSubMenu ){
 			SubMenu.style.display = 'none';
 			VisibleMenu = '';
 		}
 	}
 }

 // hide
 function hideMenu(){
 	if( VisibleMenu != '' ){
 		document.getElementById( VisibleMenu ).style.display = 'none';
 	}
 	VisibleMenu = '';
 }


function initMaps() {
    window.vars.$maps = $('#maps').empty().append([{
        "i": "1",
        "c": "\u53f0\u5317",
        "p": "100",
        "n": "\u4e2d\u6b63\u5340",
        "a": "25.0421407",
        "g": "121.5198716",
        "z": "9",
        "m": "http:\/\/127.0.0.1:8100\/weather\/img\/weathers\/zeusdesign\/36@2x.png",
        "d": "\u5348\u5f8c\u77ed\u66ab\u96f7\u9663\u96e8",
        "t": "34",
        "h": "61",
        "r": "0.0",
        "s": null ,
        "l": "http:\/\/127.0.0.1:8100\/weather\/towns\/%E5%8F%B0%E5%8C%97-%E4%B8%AD%E6%AD%A3%E5%8D%80.html"
    }, {
        "i": "10",
        "c": "\u53f0\u5317",
        "p": "114",
        "n": "\u5167\u6e56\u5340",
        "a": "25.0689422",
        "g": "121.5909027",
        "z": "11",
        "m": "http:\/\/127.0.0.1:8100\/weather\/img\/weathers\/zeusdesign\/36@2x.png",
        "d": "\u5348\u5f8c\u77ed\u66ab\u96f7\u9663\u96e8",
        "t": "34",
        "h": "53",
        "r": "0.0",
        "s": null ,
        "l": "http:\/\/127.0.0.1:8100\/weather\/towns\/%E5%8F%B0%E5%8C%97-%E5%85%A7%E6%B9%96%E5%8D%80.html"
    }, {
        "i": "100",
        "c": "\u82d7\u6817",
        "p": "357",
        "n": "\u901a\u9704\u93ae",
        "a": "24.485028",
        "g": "120.7234992",
        "z": "11",
        "m": "http:\/\/127.0.0.1:8100\/weather\/img\/weathers\/zeusdesign\/02@2x.png",
        "d": "\u591a\u96f2",
        "t": "32",
        "h": "74",
        "r": "0.0",
        "s": null ,
        "l": "http:\/\/127.0.0.1:8100\/weather\/towns\/%E8%8B%97%E6%A0%97-%E9%80%9A%E9%9C%84%E9%8E%AE.html"
    }].map(function(t) {
        return $('<a />').attr('data-val', JSON.stringify(t)).attr('data-code', t.p).attr('title', t.c + ' ' + t.n);
    }));
    window.vars.$mapsA = $('#maps > a');
    window.vars.weathers = window.vars.$mapsA.map(function() {
        return $(this).data('val');
    }).toArray();
    google.maps.event.addDomListener(window, 'load', function() {
        var lastPosition = getStorage('weathers.last.position');
        var zoom = lastPosition && lastPosition.zoom && !isNaN(lastPosition.zoom) ? lastPosition.zoom : 12;
        var lat = lastPosition && lastPosition.lat && !isNaN(lastPosition.lat) ? lastPosition.lat : 25.056678157775092;
        var lng = lastPosition && lastPosition.lng && !isNaN(lastPosition.lng) ? lastPosition.lng : 121.53488159179688;
        if (window.vars.$maps.data('position')) {
            zoom = window.vars.$maps.data('position').z;
            lat = window.vars.$maps.data('position').a;
            lng = window.vars.$maps.data('position').g;
        }
        window.vars.maps = new google.maps.Map(window.vars.$maps.get(0),{
            zoom: zoom,
            zoomControl: true,
            scrollwheel: true,
            scaleControl: true,
            mapTypeControl: false,
            navigationControl: true,
            streetViewControl: false,
            disableDoubleClickZoom: true,
            center: new google.maps.LatLng(lat,lng),
        });

        window.vars.maps.mapTypes.set('map_style', new google.maps.StyledMapType([{
            stylers: [{
                gamma: 0
            }, {
                weight: 0.75
            }]
        }, {
            featureType: 'all',
            stylers: [{
                visibility: 'on'
            }]
        }, {
            featureType: 'administrative',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'landscape',
            stylers: [{
                visibility: 'on'
            }]
        }, {
            featureType: 'poi',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'road',
            stylers: [{
                visibility: 'simplified'
            }]
        }, {
            featureType: 'road.arterial',
            stylers: [{
                visibility: 'on'
            }]
        }, {
            featureType: 'transit',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'water',
            stylers: [{
                color: '#b3d1ff',
                visibility: 'on'
            }]
        }, {
            elementType: "labels.icon",
            stylers: [{
                visibility: 'off'
            }]
        }]));
        window.vars.maps.setMapTypeId('map_style');
        if (!(lastPosition || window.vars.$maps.data('position')))
            window.fns.location.get(function(code) {
                $tmp = window.vars.$mapsA.filter('[data-code="' + code + '"]');
                if (!$tmp.length)
                    return false;
                window.vars.maps.setCenter(new google.maps.LatLng($tmp.data('val').a,$tmp.data('val').g));
            });
        window.vars.info = new MarkerWithLabel({
            position: new google.maps.LatLng(25.056678157775092,121.53488159179688),
            draggable: false,
            raiseOnDrag: false,
            clickable: true,
            labelContent: '',
            labelAnchor: new google.maps.Point(300 / 2,-25),
            icon: {
                path: 'M 0 0'
            },
            zIndex: 999
        });
        google.maps.event.addListener(window.vars.info, 'click', function() {
            window.location.assign(window.vars.info.link);
        });
        window.vars.inBoundWeathers = [];
        window.vars.weathers = window.vars.weathers.map(function(t) {
            t.position = new google.maps.LatLng(t.a,t.g);
            t.marker = new MarkerWithLabel({
                position: t.position,
                draggable: false,
                raiseOnDrag: false,
                clickable: true,
                labelContent: '<figure data-temperature="' + t.t + '°c">' + '<img src="' + t.m + '" />' + '<figcaption>' + t.n + '</figcaption>' + '</figure>',
                labelAnchor: new google.maps.Point(120 / 2,140 - 25),
                labelClass: "weather",
                icon: {
                    path: 'M 0 0'
                },
            });
            google.maps.event.addListener(t.marker, 'click', function() {
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(t.position);
                bounds.extend(new google.maps.LatLng((window.vars.$maps.data('position') ? 0 : 0.05) + parseFloat(t.a),0.06 + parseFloat(t.g)));
                bounds.extend(new google.maps.LatLng(-0.06 + parseFloat(t.a),-0.06 + parseFloat(t.g)));
                window.vars.maps.fitBounds(bounds);
                window.vars.info.setOptions({
                    map: null
                });
                window.vars.info.setOptions({
                    position: t.position
                });
                window.vars.info.setOptions({
                    labelContent: infoContent(t)
                });
                window.vars.info.setOptions({
                    labelClass: 'info' + (t.s ? ' s' : '')
                });
                window.vars.info.link = t.l;
                window.vars.infoTimer = null ;
                clearTimeout(window.vars.infoTimer);
                window.vars.infoTimer = setTimeout(function() {
                    window.vars.info.setOptions({
                        map: window.vars.maps
                    });
                }, 500);
            });
            return t;
        });
        function infoContent(t) {
            return '<div>' + '<h3>' + t.n + '</h3>' + '<div>' + '<div><span>濕度</span><span>：</span><span>' + t.h + '%</span></div>' + '<div><span>雨量</span><span>：</span><span>' + t.r + 'mm</span></div>' + '</div>' + (t.s ? '<span>' + t.s.imgs.map(function(t) {
                return '<img src=' + t + ' />';
            }).join('') + t.s.desc + '</span>' : '') + '<a>詳細內容</a>' + '</div>';
        }
        function loadWeathers() {
            var ne = window.vars.maps.getBounds().getNorthEast()
              , sw = window.vars.maps.getBounds().getSouthWest()
              , zoom = window.vars.maps.zoom
              , weathers = window.vars.weathers.filter(function(t) {
                return (t.z <= zoom) && (t.a >= (sw.lat() - 0.1)) && (t.g > sw.lng()) && (t.a <= ne.lat()) && (t.g <= ne.lng());
            })
              , deletes = window.vars.inBoundWeathers.diff(weathers, 'i')
              , adds = weathers.diff(window.vars.inBoundWeathers, 'i')
              , delete_ids = deletes.map(function(t) {
                t.marker.setMap(null );
                return t.i;
            })
              , add_ids = adds.map(function(t) {
                t.marker.setMap(window.vars.maps);
                return t.i;
            });
            window.vars.inBoundWeathers = window.vars.inBoundWeathers.filter(function(t) {
                return $.inArray(t.i, delete_ids) == -1;
            }).concat(weathers.filter(function(t) {
                return $.inArray(t.i, add_ids) != -1;
            }));
        }
        window.vars.zoomTimer = null ;
        google.maps.event.addListener(window.vars.maps, 'idle', function() {
            if (!window.vars.$maps.data('position'))
                setStorage('weathers.last.position', {
                    zoom: window.vars.maps.zoom,
                    lat: window.vars.maps.center.lat(),
                    lng: window.vars.maps.center.lng()
                });
            window.vars.info.setOptions({
                map: null
            });
            clearTimeout(window.vars.zoomTimer);
            window.vars.zoomTimer = setTimeout(loadWeathers, 10);
        });
    });
}
