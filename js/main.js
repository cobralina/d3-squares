var global =
    {
        id: null,
        source: null,
        origin: null
    };


var App = {
    Context: {
        Configuration: {
            Scale: 1,
            Colors: [
                '#FA7D19','#FFFFFF','#750ed8','#a477d4','#e5be1a','#f4df7a','#34393F','#25292E', '#279965'
            ] ,
            SvgHeight: 550,
            SvgWidth: 350,
            RangeScale: 10,
        },
        Constants: {

        },
        Cache: {

        },
        Templates: {
            documentation: null
        },
        Elements: {

        }
    },
    Data: {
    },
    Service: {
    }
};


//----- Internet Explorer Abfrage -------------------------------------------------------------------------//

function getInternetExplorerVersion()
{
    var rV = -1; // Return value assumes failure.

    if (navigator.appName == 'Microsoft Internet Explorer' || navigator.appName == 'Netscape') {
        var uA = navigator.userAgent;
        var rE = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

        if (rE.exec(uA) != null) {
            rV = parseFloat(RegExp.$1);
        }
        /*check for IE 11*/
        else if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            rV = 11;
        }
    }
    return rV;
}


// --- Abfrage ob mobil unterwegs ---------------------------------------------------------------------------- //

function isMobile(){
    return navigator.userAgent.match(/(iPhone|iPod|iPad|blackberry|android|Kindle|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i);
}





//--- JSON laden ------------------------------------------------------------------------------------------- //

function loadJSON(file,callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}




//--- SVG generieren mit d3-----------------------------------------------------------------------------------   //

//--- Einzelner Block --------------------------------------------------------------------------------   //

function renderBlock(_year, _id, _value, _valAusHeight) {


    var value = 0;
    var blockWidth = 100;
    var blockX = 5;
    var blockY = 350;
    var blockColor = App.Context.Configuration.Colors[3];

    switch (_id) {
        case "ev":
            value = parseInt(_value) *8;
            blockY = 350-value;
            break;

        case "aus_ev":
            blockX = 95;
            value = (_value / 100000)*8;
            blockY = 350 - ( (parseInt(_valAusHeight) *8) + value + 10);
            blockWidth = 10;
            blockColor = App.Context.Configuration.Colors[2]
           break;

        case "kath":
            blockX = 120;
            blockColor = App.Context.Configuration.Colors[5];
            value = parseInt(_value)*8;
            blockY = 350-value;
            break;

        case "aus_kath":
            blockX = 120;
            blockColor = App.Context.Configuration.Colors[4];
            value = (_value / 100000)*8;
            blockY = 350 -  (parseInt(_valAusHeight) *8 + value + 10);
            blockWidth = 10;
            break;

        case "bev":
            var valueTemp = parseInt(_value) *8;
            value = (valueTemp * 100)  / 215
            blockWidth = 215;
            blockY = 350-value;
            blockX = 5;
            blockColor = "#ffffff";
            break;
    }


    var group = d3.select('#cross'+_year).append('g')
        .attr('id', _id+_year);

  

    var rayID = group.append('rect')
        .attr('id', _id+_year+'Block')
        .attr('class', 'crossBlock')
        .attr('fill', blockColor)
        .attr('x', blockX)
        .attr('y', blockY)
        .attr('width', blockWidth)
        .attr('height', value)
        .attr('opacity', 1);

}

//--- Alle Blöcke für ein Jahr zusammensetzen------------------------------------------------------------------------   //

function renderCross( _d3id, _year, _evValue, _ausEvValue, _kathValue, _ausKathValue, _bevValue ){

    var svgHeight = App.Context.Configuration.SvgHeight;
    var svgWidth = App.Context.Configuration.SvgWidth;


    var svgCont = d3.select(_d3id);
    svgCont.html('');

    var svg = d3.select(_d3id).append('svg')
        .attr('viewBox', "0 0 "+svgWidth+" "+svgHeight)
        .attr('id', 'cross'+_year);
    
        svg.html('');

    renderBlock(_year, 'bev', _bevValue);
    renderBlock(_year, 'ev', _evValue);
    renderBlock(_year, 'aus_ev', _ausEvValue, _evValue);
    renderBlock(_year, 'kath', _kathValue);
    renderBlock(_year, 'aus_kath', _ausKathValue, _kathValue);


    var yearGroup = svg.append('g')
        .attr('id', _year);



    var jahreszahl = yearGroup.append('text')
        .attr('id', 'yearTxt')
        .attr('x', 110)
        .attr('y', 400)
        .attr('font-size', '2em')
        .attr('font-family', 'HelveticaBold')
        .attr('text-anchor', 'middle')
        .attr('fill',App.Context.Configuration.Colors[6])
        .text(_year) ;



    var crossBlockName = _d3id.substr(1);
    var crossBlock = document.getElementById(crossBlockName);

    var bev = document.getElementById('bev-txt');
    var kath = document.getElementById('kath-txt');
    var ev =document.getElementById("ev-txt");
    var evAus =document.getElementById("ev-aus-txt");
    var kathAus =document.getElementById("kath-aus-txt");
    var year = document.getElementById("year-txt");
    var legend = document.getElementById("legend");

    var event = 'mouseover';

    if ('ontouchstart' in window) {
        event = 'touchstart';
    }



    crossBlock.addEventListener(event, function(e) {


            if(isMobile()){
                legend.style.top=300 +"px";
                legend.style.left= 5+"px";
            }else {
                legend.style.top=(e.clientY-50) +"px";
                legend.style.left= (e.clientX+50)+"px";
            }




            bev.innerHTML = _bevValue+" Mio.";
            ev.innerHTML = _evValue+" Mio.";
            kath.innerHTML = _kathValue+" Mio.";
            evAus.innerHTML = _ausEvValue.toLocaleString();
            kathAus.innerHTML = _ausKathValue.toLocaleString();
            year.innerHTML = _year;

        TweenMax.to(legend, 0.4, {opacity:1, ease:Linear.easeNone});


        },
        false);

    crossBlock.addEventListener('mouseout', function(e) {

            TweenMax.to(legend, 0, {opacity:0, ease:Linear.easeNone});

            legend.style.top=0;
            legend.style.left=0;

        },
        false);


}

// Daten laden und rendern--------------------------------------------------------------------------------------- //
function generateAssets() {


    loadJSON('json/assets.json', function (text) {

        var allItems = JSON.parse(text);
        var arrYear = [];
        var arrKath = [];
        var arrEv = [];
        var arrKathAus = [];
        var arrEvAus = [];
        var arrBev = [];


        for (var i = 0; i < allItems.assetList.length; i++) {

            var singleAsset = allItems.assetList[i];
            var AssetYear = singleAsset.Jahr;
            var AssetKath = singleAsset.kath;
            var AssetEv = singleAsset.ev;
            var AssetKathAus = singleAsset.kath_aus;
            var AssetEvAus = singleAsset.ev_aus;
            var AssetBev = singleAsset.bev;

            arrYear.push(AssetYear);
            arrKath.push(AssetKath);
            arrEv.push(AssetEv);
            arrKathAus.push(AssetKathAus);
            arrEvAus.push(AssetEvAus);
            arrBev.push(AssetBev);

        }


        for (var j = 0; j < allItems.assetList.length; j++) {

        var divID = "#d3-"+arrYear[j];


        renderCross(divID, arrYear[j], arrEv[j], arrEvAus[j], arrKath[j], arrKathAus[j], arrBev[j]);


        }

    });


}



//--- Document Ready ----------------------------------------------------------------------------------------   //

$(document).ready( function()  {
    
    generateAssets();


} );
    
  




    



