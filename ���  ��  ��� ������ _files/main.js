/* оставить покачто для отладки */
debug = function(el) {
	var wnd = window.open('', 'debug', ',width=700,height=800,scrollbars, resizable');
	var s = '';
	s += '<table border="1" cellspacing="0" style="width:300px;float:left;">';
	for (j in el) {
		try { s += '<tr><td>' + j + '</td><td>' + el[j] + '</td></tr>'; } catch (e) { s += '<tr><td>' + j + '</td><td><b>PermittionDenied</b></td></tr>'; }
	}
	s += '<table>';
	wnd.document.write(s);
	wnd.document.body.onkeyup = wnd.onkeyup = function(Event) {
		var evt = wnd.event ? wnd.event : Event;
		if (evt.keyCode == 27) wnd.close();
	};
}


$.blockUI.defaults.css = {}; $.blockUI.defaults.centerY = false;
$.blockUI.defaults.centerX = true;
$.blockUI.defaults.overlayCSS = { backgroundColor: '#000', opacity: '0.4' };

$(function() {
    $('body').on('click', function() {
        alert(1);
    });
    $('body').off('click');
    $('body').on('click');
});



/*всплывающее меню, напр.:Сайты СКБ Контур*/
function fixedPopup(button, popup) {
	button = typeof (button) == 'string' ? document.getElementById(button) : button;
	popup = typeof (popup) == 'string' ? document.getElementById(popup) : popup;

    button.onclick = function() {
        //var pos = getAbsolutePosition(button);
        //popup.style.left = pos.x + "px";
        //popup.style.top = pos.y + "px";
        popup.style.left = $(button).offset().left + "px";
        popup.style.top = $(button).offset().top + "px";
        popup.style.display = "block";
        return false;
    };
/*	popup.onmouseout = function(event) {
		var rt = window.event ? event.toElement : event.relatedTarget;
		while (rt && rt != document.documentElement) {
			if (rt == popup) return false;
			rt = rt.parentNode;
		};
		popup.style.display = 'none';
	};*/
    $(popup).mouseleave(function () {
        $(this).hide();
    });
}

//возвращает абсолютную позицию блока
function getAbsolutePosition(id) {
	id = typeof (id) == 'string' ? ('#' + id) : id;
	var pos = $(id).offset();
	var marg = (document.documentElement.clientWidth - document.body.offsetWidth) / 2;
	marg = marg > 0 ? Math.floor(marg) : 0;
	return { x: (pos.left - marg), y: pos.top };
}

var locationRegions = [];
function BlockElement(elementQJ) {
	elementQJ.block({ message: "<img src='/theme/images/ajax-loader.gif' />",
		centerX: true,
		centerY: true,
		fadeOut: 0,
		fadeIn: 0,
		css: { width: '100%', textAlign: 'center' },
		overlayCSS: { backgroundColor: '#fff', opacity: '1' }
	});
}
function LoadRegions(url, regionSelectId, callback) {
	if (locationRegions.length > 0) {
		callback()
	} else {
		//BlockElement($("#" + regionSelectId).parent());
		$.post(url, '', function(data) {
			try {
				locationRegions = eval(data);
				callback();
				$("#" + regionSelectId).parent().unblock();
			} catch (e) { }
		});
	}
}
function GetCities(citySelectId, regionId, url, selectedCityId) {
	var citySelect = $("#" + citySelectId);
	var c = citySelect.parent();
	BlockElement(c);
	$("#" + citySelectId + " > option").remove();
	var centerId = GetRegionCenterId(regionId);
	$.post(url + '/' + regionId, '', function(data) {
		try {
			var cities = eval(data);
			var selectedCityIndex = GetCityIndex(cities, selectedCityId);
			if (selectedCityIndex < 0) {
				if (centerId) // Если есть город по умолчанию
					selectedCityIndex = GetCityIndex(cities, centerId);
				else
					selectedCityIndex = 0;
			}
			for (var i = 0; i < cities.length; i++)
				citySelect.append("<option value=" + cities[i].id + ">" + cities[i].value + "</option>")
			citySelect.get(0).scrollTop = 0;
			if (selectedCityIndex >= 0)
				citySelect.get(0).options[selectedCityIndex].selected = true;
		} catch (e) { }
		c.unblock();
	});
}
function BuildRegionSelect(locationRegions, regionSelectId, selectedRegionId, showIn) {
	var options = $("#" + regionSelectId + " > option"); //.remove();
	if (options.length > 0) {
		options.removeAttr("selected");
		$("#" + regionSelectId + " > option[value='" + selectedRegionId + "']").attr("selected", "selected");
		return;
	}

	var regionSelect = $("#" + regionSelectId);

	for (var i = 0; i < locationRegions.length; i++) {
		if (locationRegions[i].showIn == 0 || locationRegions[i].showIn == showIn) {
			var selectedStr = locationRegions[i].id == selectedRegionId ? " selected='selected' " : "";
			regionSelect.append("<option value=" + locationRegions[i].id + selectedStr + ">" + locationRegions[i].value + "</option>");
		}
	}
}
function GetRegionCenterId(regionId) {
	for (var i = 0; i < locationRegions.length; i++) {
		if (locationRegions[i].id == regionId)
			return locationRegions[i].centerId;
	}
	return null;
}
function GetCityIndex(cities, cityId) {
	for (var i = 0; i < cities.length; i++) {
		if (cities[i].id == cityId)
			return i;
	}
	return -1;
}

function FormAutoResizeTextArea(idStr) {
	var t = document.getElementById(idStr);
	var div = document.createElement('div');
	t.parentNode.insertBefore(div, t);
	div.appendChild(t.parentNode.removeChild(t));
	t.style.overflowY = 'hidden';
	t.style.overflowX = document.all != undefined ? '' : 'hidden';
	if (window.opera) t.style.cssText = "overflow:hidden;border:solid 1px #ccc;";
	t.h = $(t).height();
	var tresize = function () {
		if (!t.h) t.h = t.clientHeight - 2;
		if (!document.all && !window.opera) t.style.height = "0px";
		if (document.all && window.opera) t.style.height = "0px";
		t.style.height = div.style.minHeight = ((t.scrollHeight + 20) > t.h ? (t.scrollHeight + 20) : t.h) + 'px';
	};
	$(t).bind('keyup', tresize)
	.bind('blur', tresize)
	.bind('focus', tresize)
	.bind('cut', function () { setTimeout(tresize, 0) })
	.bind('paste', function () { setTimeout(tresize, 0) });
	t.style.height = div.style.minHeight = ((t.scrollHeight + 20) > t.h ? (t.scrollHeight + 20) : t.h) + 'px';
	t.style.height = 0;
	$(t).keyup();
};

function SelectText(text) {
    if ($.browser.msie) {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if ($.browser.mozilla || $.browser.opera) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if ($.browser.safari) {
        var selection = window.getSelection();
        selection.setBaseAndExtent(text, 0, text, 1);
    }
}


// Всплывающее окно для показа изображения/изображений (если есть imgSrcArray)
function ShowImagesLightBox(imgSrcArray, currentImageSrc, srcPath, title) {
	var ic = document.getElementById("ImageContainer");
	var img;
	var load;
	var imagesSources = imgSrcArray.sources ? imgSrcArray.sources : imgSrcArray;
	var imagesTitles = imgSrcArray.titles ? imgSrcArray.titles : new Array(imagesSources.length);
	var imgIndex = GetImgIndex(imagesSources, currentImageSrc);
	var prevImage = $('#previousImage');
	var prevImage = $('#nextImage');
	var prevImageEmpty = $("#previousImageEmpty");
	var nextImageEmpty = $('#nextImageEmpty');
	if (imagesSources.length == 0) {
		prevImage.hide();
		prevImage.hide();
	}
	window.__resize = function() {
		if (!img.load) return false;
		var h = document.documentElement.clientHeight - (imagesSources.length == 0 ? 90 : 110);
		var w = document.documentElement.clientWidth - 40;
		img.removeAttribute("height");
		img.removeAttribute("width");
		if ((h / img.maxHeight) < (w / img.maxWidth)) {
			if (h < img.maxHeight) img.height = h;
		} else {
			if (w < img.maxWidth) img.width = w;
		}
	};
	var newImage = function () {
	    ic.innerHTML = "";
	    img = document.createElement("img");
	    load = document.createElement("div");
	    ic.appendChild(load);
	    load.style.cssText = "width:200px;height:200px;position:relative;background:url(/theme/images/imgload.gif) center no-repeat;";
	    ic.appendChild(img);
	    img.load = false;
	    img.style.display = "none";
	    img.removeAttribute("height");
	    img.removeAttribute("width");
	    if (document.all && !window.opera && $.browser.version < 8) try { document.body.removeExpression("resize"); } catch (e) {}
		if (document.all && $.browser.version < 8) {
			try { document.body.setExpression("resize", "window.__resize()"); } catch (e) { }
	        $(window).load(function () {
	            document.body.removeExpression("resize");
	        });
	    }
	    img.onload = function () {
	        if (load.parentNode) ic.removeChild(load); //?
	        else load = null;

	        img.style.display = "inline";
	        img.maxHeight = img.offsetHeight;
	        img.maxWidth = img.offsetWidth;
	        img.load = true;
	        window.__resize();
	    };

	    $('.ltbx-img-title').html('');
	    if (title) {
	        $('.ltbx-img-title').html(title);
	    }
	};
	newImage();
	lightBox.show("ImageLightBox");

	img.src = srcPath + currentImageSrc;

	$(window).resize(function() {
	    if (document.all && $.browser.version < 8 && document.body.getExpression("resize")) {
			document.body.removeExpression("resize");
		}
		window.__resize();
	});

	function ShowHideArrows(imgIndex) {
		if (imgIndex <= 0) {
			prevImage.hide();
			prevImageEmpty.show();
		}
		else {
			prevImage.show();
			prevImageEmpty.hide();
		}
		if (imgIndex >= imagesSources.length - 1) {
			nextImage.hide(); 
			nextImageEmpty.show(); 
		}
		else {
			nextImage.show();
			nextImageEmpty.hide();
		}
	}

	function GetImgIndex(images, img) {
		for (var i = 0; i < images.length; i++) {
			if (images[i] == img)
				return i;
		}
		return -1;
	}
	var imgIndex = GetImgIndex(imagesSources, currentImageSrc);
	if (imagesTitles[imgIndex])
		$('.ltbx-img-title').html(imagesTitles[imgIndex]);
	var prevImage = $('#previousImage');
	var nextImage = $('#nextImage');
	ShowHideArrows(imgIndex);


	$(prevImage).bind('click', function() {
		imgIndex--;
		newImage();
		img.src = srcPath + imagesSources[imgIndex];
		if (imagesTitles[imgIndex])
			$('.ltbx-img-title').html(imagesTitles[imgIndex]);
	
		ShowHideArrows(imgIndex);
		return false;
	});

	$(nextImage).bind('click', function() {
		imgIndex++;
		newImage();
		img.src = srcPath + imagesSources[imgIndex];
		if (imagesTitles[imgIndex])
			$('.ltbx-img-title').html(imagesTitles[imgIndex]);
		
		ShowHideArrows(imgIndex);
		return false;
	});
	$(prevImageEmpty).click(function() { return false; });
	$(nextImageEmpty).click(function() { return false; });
	$("#previousNextContainer").click(function() {
		lightBox.hide();
	});
	if (imagesSources.length <= 1) {
		$(prevImageEmpty).hide();
		$(nextImageEmpty).hide();
	}

}

function ShowYandexMap(centerPoint, otherPoints) {	
	
	var lightBoxId = '#MapLightBox';
	lightBox.show("MapLightBox");

	YMaps.load("pmap", function () {
	    var mapContainer = YMaps.jQuery("#mapId");
	    mapContainer.html('');
	    var map = new YMaps.Map(mapContainer[0]);
	    map.setCenter(new YMaps.GeoPoint(centerPoint.coordinates[0], centerPoint.coordinates[1]), 100);

	    if (map.getMaxZoom() <= 14) {
	        //Если карта плохо прорисована, то показывать народную карту
	        map.setType(YMaps.MapType.PMAP);
	        map.setZoom(17);
	        // Добавляем кнопки
	        map.addControl(new YMaps.TypeControl([YMaps.MapType.PMAP, YMaps.MapType.PHYBRID]));
	    } else {
	        //Добавляем кнопки "Схема", "Спутник", "Гибрид"
	        map.addControl(new YMaps.TypeControl());

	    }

	    //Добавляем масштабирование
	    map.addControl(new YMaps.Zoom());
	    //Добавляем панель инструментов ("Рука", "Лупа", "Линейка")
	    map.addControl(new YMaps.ToolBar());
	    map.addControl(new YMaps.MiniMap());
	    //Включаем масштабирование колесиком мыши
	    map.enableScrollZoom();

	    //Добавляем офис на карту
	    // Настраиваем стиль значка метки
	    var officeMarkStyle = new YMaps.Style();
	    officeMarkStyle.iconStyle = new YMaps.IconStyle();
	    officeMarkStyle.iconStyle.href = "/theme/images/map_icon.png";
	    officeMarkStyle.iconStyle.size = new YMaps.Point(25, 19);

	    //Добавляем другие метки
	    for (var i = 0; i < otherPoints.length; i++) {
	        //Если точка является центральной, то ее пропускаем			
	        if (otherPoints[i].coordinates[0] == centerPoint.coordinates[0] && otherPoints[i].coordinates[1] == centerPoint.coordinates[1])
	            continue;
	        var point = new YMaps.Placemark(new YMaps.GeoPoint(otherPoints[i].coordinates[0], otherPoints[i].coordinates[1]));
	        point.name = otherPoints[i].title;
	        point.description = '<table><tr><td>' + otherPoints[i].address + '</td></tr><tr><td>' + otherPoints[i].phone + '</td></tr><tr><td>' + otherPoints[i].email + '</td></tr></table>';
	        point.setStyle(officeMarkStyle);
	        map.addOverlay(point);
	    }

	    //Добавляем балун и метку для текущего объекта
	    var placemark = new YMaps.Placemark(new YMaps.GeoPoint(centerPoint.coordinates[0], centerPoint.coordinates[1]));
	    placemark.name = centerPoint.title;
	    placemark.description = '<table><tr><td>' + centerPoint.address + '</td></tr><tr><td>' + centerPoint.phone + '</td></tr><tr><td>' + centerPoint.email + '</td></tr></table>';
	    placemark.setStyle(officeMarkStyle);
	    map.addOverlay(placemark);
	    placemark.openBalloon();
	});
}

//подсказка в текстовом поле
function textNote(inputId, note) {
	var input = document.getElementById(inputId);
	if (!input) return false;
	var name = input.name;
	var onblur = function() {
		if (input.value == '') {
			input.value = note;
			input.empty = true;
			input.style.color = '#999';
			$(input).addClass('empty');
			input.removeAttribute("name");
		}
		else {
			input.empty = false;
			input.name = name;
			$(input).removeClass('empty');
		}
	};
    var onfocus = function() {
        if (input.empty) input.value = '';
        input.style.color = '#000';
        $(input).addClass('empty');
        input.removeAttribute("name");
    };
    var onkeyup = function() {
		if (this.value) this.empty = false;
		input.name = name;
    };
    $(input).bind('blur', onblur);
    $(input).bind('focus', onfocus);
    $(input).bind('keyup', onkeyup);
    if (input.value == note) input.value = '';
    onblur();
}
function clearNotes(formId) {
    var form = (typeof (formId) == 'string') ? document.getElementById(form) : formId;
    for (var i = 0; i < form.elements.length; i++)
        if (form.elements[i].empty) form.elements[i].value = '';
}

function createSuggest(opts) {
    var ie = document.all && (!window.opera);
    var emptyMessage = typeof (opts.msg) != 'undefined' ? opts.msg : 'По вашему запросу ничего не найдено';
    var inp = document.getElementById(opts.input);
    inp.oldvalue = inp.value;
 
    if (!inp) return false;
    inp.suggestEnabled = true;
    inp.url = opts.url;
    inp.hidden = document.getElementById(opts.hidden);
    inp.key = document.getElementById(opts.key);
    inp.txt = document.getElementById(opts.title);
    inp.comment = document.getElementById(opts.comment);
    inp.callback = opts.callback;
    inp.callbackParams = opts.callbackParams;
    inp.create = function () {
        var suggest = document.createElement('div');
        if (inp.nextSibling)
            inp.parentNode.insertBefore(suggest, inp.nextSibling);
        else
            inp.parentNode.appendChild(suggest);
        suggest.className = "suggest";

        inp.w = document.createElement("div"); //inp.w = window.opera ? document.createElement("iframe") : document.createElement("div");

        suggest.insertBefore(inp.w, suggest.firstChild);
        inp.w.style.cssText = "width:1px;height:1px;position:absolute;left:0;top:0;font-size:0;border:solid 0;"; //opacity//

        document.body.appendChild(inp.abs = document.createElement("div"));
        inp.abs.style.cssText = "position:absolute;";
        inp.abs.className = "suggest";

        if (ie) {
            inp.abs.appendChild(inp.ifr = document.createElement('iframe'));
            inp.ifr.style.cssText = 'position:absolute;left:0;top:0;display:none;/*filter:alpha(opacity=0);opacity:0*/';
        }

        var ul = document.createElement('ul')
        inp.abs.appendChild(ul);
        ul.style.display = 'none';
        inp.setAttribute("autocomplete", "off");
        inp.suggest = suggest;
        inp.ul = ul;
    };
    inp.undoSubmit = function(undo) {
        if (undo) {
            if (!inp.formSubmit) {
                inp.formSubmit = inp.form.onsubmit ? inp.form.onsubmit : function() { ; };
                inp.form.onsubmit = function() { return false; };
            }
        } else {
            if (inp.formSubmit) {
                inp.form.onsubmit = inp.formSubmit;
                inp.formSubmit = null;
            }
        }
    };

    inp.onkeyup = function (Event) {
        
        if (!inp.suggest) inp.create();
        var evt = Event ? Event : event;
        var ul = inp.ul;

        if (inp.oldvalue != inp.value) {
            if (inp.callback) inp.callback('', inp.callbackParams);
            if (inp.txt) inp.txt.innerHTML = '';
        }
        var offsetFocus = function (offset) {
            var ul = inp.ul;
            if (!ul.childNodes.length) return false;
            if (ul.firstChild.className == "empty") return false;
            for (var i = 0; i < ul.childNodes.length; i++) {
                if (ul.childNodes[i].className.match('hover')) {
                    ul.childNodes[i].className = ul.childNodes[i].className.replace('hover', '');
                    if ((i + offset) < 0) i = ul.childNodes.length;
                    if ((i + offset) > (ul.childNodes.length - 1)) i = -1;
                    ul.childNodes[i + offset].className += ' hover';
                    inp.data(ul.childNodes[i + offset]);
                    return 0;
                }
            }
            if (offset > 0) {
                ul.childNodes[0].className += ' hover';
                inp.data(ul.childNodes[0]);
            };
            if (offset < 0) {
                ul.childNodes[ul.childNodes.length - 1].className += ' hover';
                inp.data(ul.childNodes[ul.childNodes.length - 1]);
            };
            inp.oldvalue = inp.value;
        }
        //console.log(1);
        //console.log(evt.keyCode);
        if (evt.keyCode == 38)//point up
        {
            offsetFocus(-1);
            return false;
        }
        if (evt.keyCode == 40)//point down
        {
            offsetFocus(1);
            return false;
        }
        if (evt.keyCode == 13)//enter
        {

            ul.innerHTML = '';
            ul.style.display = inp.abs.style.display = 'none';
            if (ie) inp.ifr.style.display = 'none';
            inp.undoSubmit();
            return false;
        }
        if (evt.keyCode == 27)//esc
        {
            ul.innerHTML = '';
            ul.style.display = inp.abs.style.display = 'none';
            if (ie) inp.ifr.style.display = 'none';
            inp.undoSubmit();
            return false;
        }

        inp.suggest.style.width = (inp.offsetWidth - 2) + 'px'; //suggest min-width

        if (inp.suggestEnabled && inp.value && (inp.value.length > 0)) {
            if (inp.oldvalue == inp.value) return false; //if value not changed
            clearTimeout(this.timeout);
            inp.timeout = setTimeout(function () { inp.query(inp); }, 10); //set timeout request
            inp.oldvalue = inp.value;
        } else {
            ul.innerHTML = '';
            ul.style.display = inp.abs.style.display = 'none';
            if (ie) inp.ifr.style.display = 'none';
            inp.undoSubmit();
        }
    };
    /*inp.onkeydown = function()
    {
    //if (document.all && event.keyCode == 13)//stop submit propagation
    //	return false;
    };*/
    var onblur = function()//onblur - hide suggest
    {
        if (!inp.ul) return false;
        clearTimeout(this.timeout);
        this.timeout = false;
        inp.ul.innerHTML = '';
        inp.ul.style.display = inp.abs.style.display = 'none';
        if (ie) inp.ifr.style.display = 'none';
        inp.undoSubmit();
        if (inp.oldvalue != inp.value) {
            if (inp.txt) inp.txt.innerHTML = '';
        }
    };
    $(inp).bind('blur', onblur);

    inp.query = function(inp)//get data
    {
        if (!inp.value || FormatInput(inp.value, true).length == 0)
            return;
        $.ajax({
            url: inp.url + escape(FormatInput(inp.value, true)), //escape wrong for safari
            dataType: 'json',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function(data) { inp.ready(data); }
        });
    };
    inp.data = function(obj)//set values text input [and hidden input]
    {
        inp.value = obj.data;
        if (inp.hidden) inp.hidden.value = obj.key ? obj.key : "";
        if (inp.txt) inp.txt.innerHTML = obj.txt ? obj.txt : "";
        if (inp.callback) inp.callback(obj.data, inp.callbackParams);
        if (inp.comment) inp.comment.innerHTML = obj.comment ? obj.comment : "";
        inp.oldvalue = inp.value;
    };
    inp.ready = function (data)//create suggest list
    {
        if (this.timeout === false) return false;
        var ul = inp.ul;
        var li;
        var esc = document.createElement("div");
        ul.innerHTML = '';
        if (!data.length) {
            if (emptyMessage === false) {
                inp.ul.style.display = inp.abs.style.display = 'none';
                if (ie) inp.ifr.style.display = "none";
                return;
            }
            ul.appendChild(li = document.createElement('li'));
            li.className = 'empty';
            li.innerHTML = emptyMessage;
            li.data = "";
        }
        for (var i = 0; i < data.length; i++) {
            ul.appendChild(li = document.createElement('li'));
            if (typeof (data[i]) == 'object') {
                //li.innerHTML = data[i].valueEncoded;//если здесь ошибок не возникло, стоит убрать valueEncoded из серверной части
                if (document.all)
                    esc.innerText = data[i].value;
                else
                    esc.textContent = data[i].value;
                li.innerHTML = esc.innerHTML;
                //li.innerHTML = data[i].value;
                if (data[i].key) li.key = data[i].key;
                if (data[i].value) li.data = data[i].value;
                if (data[i].title) {
                    li.txt = data[i].title;
                }
                if (data[i].cssClass) li.className = data[i].cssClass;
            }
            else {
                li.innerHTML = data[i];
                li.data = data[i];
            }
            //li.innerHTML += data[i].comment ? "<div class='comment'>" + data[i].comment + "</div>" : '';
            var re = new RegExp('(' + FormatInput(inp.value, false) + ')', 'gi')
            if (opts.light) {
                li.innerHTML = li.innerHTML.replace(re, '<b>$1</b>');
                if (data[i].comment != null) {
                    var comm = data[i].comment.replace(re, '<b>$1</b>')
                    li.innerHTML += data[i].comment ? "<div class='comment'>" + comm + "</div>" : '';
                }
            }
            li.innerHTML += data[i].title ? "&nbsp;&nbsp;" + data[i].title + "" : '';
            li.onmouseover = function () {
                for (var i = 0; i < this.parentNode.childNodes.length; i++) {
                    this.parentNode.childNodes[i].className = this.parentNode.childNodes[i].className.replace(/\s?hover/, '');
                }
                this.className += ' hover';
            };
            li.onmousedown = function () { inp.data(this); };
        }
        esc = null;

        var sx, sy, sw, sh;
        sw = $(document).width();
        sh = $(document).height();
        sx = $(inp.suggest).offset().left;
        sy = $(inp.suggest).offset().top;

        inp.abs.style.left = sx + "px";
        inp.abs.style.top = sy + "px";

        inp.abs.style.width = (sw - sx - 20) + "px";

        ul.style.display = inp.abs.style.display = '';
        if (ie) inp.ifr.style.display = '';
        inp.undoSubmit(!opts.freeSubmit);
        if (ie) inp.ifr.style.width = ul.clientWidth + 2 + 'px';
        if (ie) inp.ifr.style.height = ul.clientHeight + 2 + 'px';

        if (inp.offsetWidth > inp.ul.offsetWidth) inp.ul.style.width = (inp.offsetWidth - 2) + "px";
    };
}


function StringRemove(str, regex) {
    var flags = "g";
    if (regex.ignoreCase) flags += "i";
    if (regex.multiline) flags += "m";
    var globalRegex = new RegExp(regex.source, flags);
    return str.replace(globalRegex, "");
}

function StringTrim(str) {
    return StringRemove(str, /^\s+|\s+$/);
}

function StringRemoveMultipleSpaces(str) {
    return str.replace(/\s+/g, " ");
}

function FormatInput(str, removeQuotes) {
    if (removeQuotes) {
        var str = str.replace(/\"/g, "");
    }
    return StringTrim(StringRemoveMultipleSpaces(str));
}

/**
* SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
*
* SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
* http://www.opensource.org/licenses/mit-license.php
*
*/
if (typeof deconcept == "undefined") { var deconcept = new Object(); } if (typeof deconcept.util == "undefined") { deconcept.util = new Object(); } if (typeof deconcept.SWFObjectUtil == "undefined") { deconcept.SWFObjectUtil = new Object(); } deconcept.SWFObject = function(_1, id, w, h, _5, c, _7, _8, _9, _a) { if (!document.getElementById) { return; } this.DETECT_KEY = _a ? _a : "detectflash"; this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY); this.params = new Object(); this.variables = new Object(); this.attributes = new Array(); if (_1) { this.setAttribute("swf", _1); } if (id) { this.setAttribute("id", id); } if (w) { this.setAttribute("width", w); } if (h) { this.setAttribute("height", h); } if (_5) { this.setAttribute("version", new deconcept.PlayerVersion(_5.toString().split("."))); } this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion(); if (!window.opera && document.all && this.installedVer.major > 7) { deconcept.SWFObject.doPrepUnload = true; } if (c) { this.addParam("bgcolor", c); } var q = _7 ? _7 : "high"; this.addParam("quality", q); this.setAttribute("useExpressInstall", false); this.setAttribute("doExpressInstall", false); var _c = (_8) ? _8 : window.location; this.setAttribute("xiRedirectUrl", _c); this.setAttribute("redirectUrl", ""); if (_9) { this.setAttribute("redirectUrl", _9); } }; deconcept.SWFObject.prototype = { useExpressInstall: function(_d) { this.xiSWFPath = !_d ? "expressinstall.swf" : _d; this.setAttribute("useExpressInstall", true); }, setAttribute: function(_e, _f) { this.attributes[_e] = _f; }, getAttribute: function(_10) { return this.attributes[_10]; }, addParam: function(_11, _12) { this.params[_11] = _12; }, getParams: function() { return this.params; }, addVariable: function(_13, _14) { this.variables[_13] = _14; }, getVariable: function(_15) { return this.variables[_15]; }, getVariables: function() { return this.variables; }, getVariablePairs: function() { var _16 = new Array(); var key; var _18 = this.getVariables(); for (key in _18) { _16[_16.length] = key + "=" + _18[key]; } return _16; }, getSWFHTML: function() { var _19 = ""; if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) { if (this.getAttribute("doExpressInstall")) { this.addVariable("MMplayerType", "PlugIn"); this.setAttribute("swf", this.xiSWFPath); } _19 = "<embed type=\"application/x-shockwave-flash\" src=\"" + this.getAttribute("swf") + "\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\" style=\"" + this.getAttribute("style") + "\""; _19 += " id=\"" + this.getAttribute("id") + "\" name=\"" + this.getAttribute("id") + "\" "; var _1a = this.getParams(); for (var key in _1a) { _19 += [key] + "=\"" + _1a[key] + "\" "; } var _1c = this.getVariablePairs().join("&"); if (_1c.length > 0) { _19 += "flashvars=\"" + _1c + "\""; } _19 += "/>"; } else { if (this.getAttribute("doExpressInstall")) { this.addVariable("MMplayerType", "ActiveX"); this.setAttribute("swf", this.xiSWFPath); } _19 = "<object id=\"" + this.getAttribute("id") + "\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"" + this.getAttribute("width") + "\" height=\"" + this.getAttribute("height") + "\" style=\"" + this.getAttribute("style") + "\">"; _19 += "<param name=\"movie\" value=\"" + this.getAttribute("swf") + "\" />"; var _1d = this.getParams(); for (var key in _1d) { _19 += "<param name=\"" + key + "\" value=\"" + _1d[key] + "\" />"; } var _1f = this.getVariablePairs().join("&"); if (_1f.length > 0) { _19 += "<param name=\"flashvars\" value=\"" + _1f + "\" />"; } _19 += "</object>"; } return _19; }, write: function(_20) { if (this.getAttribute("useExpressInstall")) { var _21 = new deconcept.PlayerVersion([6, 0, 65]); if (this.installedVer.versionIsValid(_21) && !this.installedVer.versionIsValid(this.getAttribute("version"))) { this.setAttribute("doExpressInstall", true); this.addVariable("MMredirectURL", escape(this.getAttribute("xiRedirectUrl"))); document.title = document.title.slice(0, 47) + " - Flash Player Installation"; this.addVariable("MMdoctitle", document.title); } } if (this.skipDetect || this.getAttribute("doExpressInstall") || this.installedVer.versionIsValid(this.getAttribute("version"))) { var n = (typeof _20 == "string") ? document.getElementById(_20) : _20; n.innerHTML = this.getSWFHTML(); return true; } else { if (this.getAttribute("redirectUrl") != "") { document.location.replace(this.getAttribute("redirectUrl")); } } return false; } }; deconcept.SWFObjectUtil.getPlayerVersion = function() { var _23 = new deconcept.PlayerVersion([0, 0, 0]); if (navigator.plugins && navigator.mimeTypes.length) { var x = navigator.plugins["Shockwave Flash"]; if (x && x.description) { _23 = new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".")); } } else { if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) { var axo = 1; var _26 = 3; while (axo) { try { _26++; axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + _26); _23 = new deconcept.PlayerVersion([_26, 0, 0]); } catch (e) { axo = null; } } } else { try { var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"); } catch (e) { try { var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"); _23 = new deconcept.PlayerVersion([6, 0, 21]); axo.AllowScriptAccess = "always"; } catch (e) { if (_23.major == 6) { return _23; } } try { axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"); } catch (e) { } } if (axo != null) { _23 = new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(",")); } } } return _23; }; deconcept.PlayerVersion = function(_29) { this.major = _29[0] != null ? parseInt(_29[0]) : 0; this.minor = _29[1] != null ? parseInt(_29[1]) : 0; this.rev = _29[2] != null ? parseInt(_29[2]) : 0; }; deconcept.PlayerVersion.prototype.versionIsValid = function(fv) { if (this.major < fv.major) { return false; } if (this.major > fv.major) { return true; } if (this.minor < fv.minor) { return false; } if (this.minor > fv.minor) { return true; } if (this.rev < fv.rev) { return false; } return true; }; deconcept.util = { getRequestParameter: function(_2b) { var q = document.location.search || document.location.hash; if (_2b == null) { return q; } if (q) { var _2d = q.substring(1).split("&"); for (var i = 0; i < _2d.length; i++) { if (_2d[i].substring(0, _2d[i].indexOf("=")) == _2b) { return _2d[i].substring((_2d[i].indexOf("=") + 1)); } } } return ""; } }; deconcept.SWFObjectUtil.cleanupSWFs = function() { var _2f = document.getElementsByTagName("OBJECT"); for (var i = _2f.length - 1; i >= 0; i--) { _2f[i].style.display = "none"; for (var x in _2f[i]) { if (typeof _2f[i][x] == "function") { _2f[i][x] = function() { }; } } } }; if (deconcept.SWFObject.doPrepUnload) { if (!deconcept.unloadSet) { deconcept.SWFObjectUtil.prepUnload = function() { __flash_unloadHandler = function() { }; __flash_savedUnloadHandler = function() { }; window.attachEvent("onunload", deconcept.SWFObjectUtil.cleanupSWFs); }; window.attachEvent("onbeforeunload", deconcept.SWFObjectUtil.prepUnload); deconcept.unloadSet = true; } } if (!document.getElementById && document.all) { document.getElementById = function(id) { return document.all[id]; }; } var getQueryParamValue = deconcept.util.getRequestParameter; var FlashObject = deconcept.SWFObject; var SWFObject = deconcept.SWFObject;

var ExecuteWithDelay = (function() {
    var timer;
    return function(callback, ms) {
        if (timer != null) {
            clearTimeout(timer);
        }
        timer = setTimeout(callback, ms);
    }
})();




lightBox = {
    div: null,
    sx: 0,
    sy: 0,
    show: function (MessageBlock, opts) {
        if (!opts) opts = {};
        opts.centerX = opts.centerX == undefined ? true : opts.centerX;
        opts.centerY = opts.centerY == undefined ? true : opts.centerY;
        div = document.createElement('div');
        div.className = "LightBox";
        if (!(div.msg = document.getElementById(MessageBlock))) return;
        document.body.appendChild(div);
        sx = document.documentElement.scrollLeft;
        sy = document.documentElement.scrollTop;
        /*document.documentElement.style.width = document.documentElement.clientWidth + "px"; ///////////
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.position = "relative";
        document.documentElement.style.left = (-sx) + "px";
        document.documentElement.style.top = (-sy) + "px";*/

        div.style.cssText = "width:100%;_width:expression(documentElement.clientWidth);\
			height:100%;_height:expression(documentElement.clientHeight);position:fixed;_position:absolute;\
			left:0;_left:expression(documentElement.scrollLeft-document.body.offsetLeft);\
			top:0;_top:expression(documentElement.scrollTop-document.body.offsetTop);";
        div.appendChild(div.bg = document.createElement('div'));
        div.bg.style.cssText = "width:100%;height:100%;_height:expression(this.parentNode.clientHeight);position:absolute;left:0;top:0;\
			background:#000;opacity:0.4;filter:alpha(opacity=40);";
        div.appendChild(div.ifr = document.createElement('iframe'));
        div.ifr.style.cssText = 'width:100%;height:100%;position:absolute;left:0;top:0;filter:alpha(opacity=0);opacity:0';
        div.appendChild(div.scroll = document.createElement('div'));
        div.scroll.style.cssText = "width:100%;height:100%;position:absolute;left:0;top:0;/*overflow:auto;*/overflow:hidden;";
        div.scroll.appendChild(div.rel = document.createElement('div'));
        div.rel.style.cssText = "height:100%;_height:100%;position:relative;";
        div.rel.appendChild(div.table = document.createElement('table'));
        div.td = div.table.insertRow(0).insertCell(0);
        div.table.style.cssText = 'width:100%;_width:expression(documentElement.clientWidth);\
			height:100%;_height:expression(documentElement.clientHeight);position:absolute;left:0;top:0;\
			border-collapse:collapse;border:solid 0;';
        //div.td.style.cssText = "text-align:center;vertical-align:middle;";
        div.td.style.textAlign = opts.centerX ? "center" : "left";
        div.td.style.verticalAlign = opts.centerY ? "middle" : "top";
        div.appendChild(div.over = document.createElement("div"));
        div.over.style.cssText = "width:100%;height:100%;position:absolute;left:0;top:0;display:none;";

        div.msgparent = div.msg.parentNode;
        div.td.appendChild(div.box = div.msgparent.removeChild(div.msg));
        div.box.style.cssText = 'display:table;//display:inline;visibility:visible;';
        div.box.style.margin = opts.centerX ? "0 auto" : "0";

        _window_onkeydown = document.documentElement.onkeydown;

        document.documentElement.onkeydown = function (Event) {
            evt = window.event ? event : Event;
            if (evt.keyCode == 27) {
                lightBox.hide();
                hideMap();
            }
        }
        var boxClick = false;
        div.td.onclick = function () { if (boxClick) { boxClick = false; } else { lightBox.hide(); hideMap(); } };
        div.box.onclick = function () { boxClick = true; };

        return div;
    },
    hide: function () {
        document.documentElement.onkeydown = _window_onkeydown;
        function tmpHide() {
            if (!div) return;
            div.box.style.display = 'none';
            div.msgparent.appendChild(div.td.removeChild(div.box));
            document.body.removeChild(div);
            div = null;

            /*document.documentElement.style.width = "auto";
            document.documentElement.style.overflow = "";*/
            var sdiv = document.createElement("div");
            document.body.appendChild(sdiv);
            sdiv.style.height = "1px";
            setTimeout(function () {
                document.body.removeChild(sdiv);
                /*document.documentElement.style.left = 0 + "px";
                document.documentElement.style.top = 0 + "px";
                document.documentElement.scrollLeft = sx;
                document.documentElement.scrollTop = sy;*/

            }, 0);
        }
        div.over.style.display = "block";
        $(div.table).fadeOut(400);
        $(div.bg).fadeOut(400, tmpHide);
    }
}

function removeHrefFromYears() {
    $('.news-calendar .year- a').removeAttr('href');
}

function switchTerm(blockId) {
    var block = $("#" + blockId);
    if (block.get(0).className == 'termText') {
        block.get(0).className = 'termText termOpen';
        block.show();
    } else {
        block.get(0).className = 'termText';
        block.hide();
    }
}