var config = {
	picWidth : 600,
    xDown: null,
    yDown: null,
    xUp: [],
    firstPic: 1,
    lastPic: 30,
    inx: 1,
	moveRatio : 0,
    preloaded: {},
    arrowMap: {
        'arrow-right-group1': 6,
        'arrow-left-group2': 1,
        'arrow-right-group2': 11,
        'arrow-left-group3': 6,
        'arrow-right-group3': 16,
        'arrow-left-group4': 11,
        'arrow-right-group4': 21,
        'arrow-left-group5': 16, 
		'arrow-left-group6': 21,
		'arrow-right-group5': 26, 
		'arrow-right-group6': 31,
		'arrow-right-group7': 35, // change to 36 with gr 8!
		'arrow-left-group7': 30
    }
};
if ('ontouchstart' in document.documentElement) {
    document.addEventListener('touchstart', function(e) {
        config.xDown = e.touches[0].clientX;
        config.yDown = e.touches[0].clientY;
        labelClickHandler(e.target);
    });
    document.addEventListener('touchmove', function(e) {
        if (!config.xDown || !config.yDown) {
            return;
        }
		config.xUp = [];
        config.xUp.push(e.touches[0].clientX);
		config.moveRatio = config.xUp[config.xUp.length-1] - config.xDown;
		if(config.xUp.length && config.xDown > config.xUp[config.xUp.length - 1] && config.inx != config.lastPic){
			marginLeftSet('.accordeon-view', "-" + (checkedInputId() * config.picWidth + config.moveRatio) + 'px');
		}
		if (config.xUp.length && config.xDown < config.xUp[config.xUp.length - 1] && config.inx !== config.firstPic) {
			marginLeftSet('.accordeon-view', "-" + (((checkedInputId() -1) * config.picWidth) - config.moveRatio) + 'px'); 
		}
    });
    document.addEventListener('touchend', function(e) {
		marginNullify('.accordeon-view');
		if(Math.abs(config.moveRatio) > 60){
			handleRightward();
			handleLeftward();
		}
        config.xUp = [];
    });
} else {
    document.addEventListener('mousedown', function(e) {
        labelClickHandler(e.target);
    });
	
	document.addEventListener('keydown', function(e) {
		switch(e.keyCode.toString()){
			case '37':	{
				if(config.firstPic !== checkedInputId()){
					var selector = "label[for*=" + "'pic" + (checkedInputId() - 1) + "'" + "]";
					labelClickHandler(document.querySelector(selector));
				}
				break;
			}
			case '39':	{
				var selector = "label[for*=" + "'pic" + (checkedInputId() + 1) + "'" + "]";
				labelClickHandler(document.querySelector(selector));
				break;
			}
		}
    });
}
function marginLeftSet(selector, val){
	document.querySelector(selector).style.marginLeft = val;
}
function marginNullify(selector){
	document.querySelector(selector).style.marginLeft = "";
}
function whichInputIsChecked() {
    return document.querySelector('input[checked]');
}
function checkedInputId() {
    return parseInt(whichInputIsChecked().id.match(/\d+/)[0]);
}
function removeAttrChecked(inx) {
    var input = document.querySelector("input[id*='pic" + inx + "'" + "]");
    if (input) {
        input.removeAttribute('checked');
    }
}
function setAttrChecked(inx) {
    var input = document.querySelector("input[id*='pic" + inx + "'" + "]");
    if (input) {
        input.setAttribute('checked', true);
    }
}
function getAttr(el, attr) {
    return el.getAttribute(attr);
}
function handleLeftward() {
    if (config.xUp.length && config.xDown > config.xUp[config.xUp.length - 1] && config.inx != config.lastPic) {
        if (config.inx == checkedInputId()) {
            setAttrChecked(config.inx + 1);
            removeAttrChecked(config.inx);
            config.inx = config.inx + 1;
			document.getElementById('console').children[0].innerHTML = config.inx + " leftwards";
            if (config.inx > 2) {
                for (var i = config.inx; i < config.inx + 2; i++) {
                    checkPreloaded(i);
                }
            }
        }
    }
}
function handleRightward() {
    if (config.xUp.length && config.xDown < config.xUp[config.xUp.length - 1] && config.inx !== config.firstPic) {
        if (config.inx == checkedInputId()) {
            setAttrChecked(config.inx - 1);
            removeAttrChecked(config.inx);
            config.inx = config.inx - 1;
			document.getElementById('console').children[0].innerHTML = config.inx + " rightwards";
            if (config.inx > 2) {
                for (var i = config.inx; i < config.inx + 2; i++) {
                    checkPreloaded(i);
                }
            }
        }
    }
}
function checkPreloaded(inx) {
    if (!config.preloaded[inx]) {
        var el = document.querySelector('.accordeon-view  > div:nth-child(' + inx + '):not([class])');
        if (el) {
            el.setAttribute('class', 'added');
            config.preloaded[inx] = true;
        }
    }
}
function labelClickHandler(trg){
	if (trg && trg.tagName == 'LABEL') {
            var targetInx;
            if (getAttr(trg, 'for').match(/arrow-[right|left]+-group\d+/)) {
                targetInx = config.arrowMap[getAttr(trg, 'for').match(/arrow-[right|left]+-group\d+/)[0]];
            } else {
                targetInx = parseInt(getAttr(trg, 'for').match(/\d+/)[0], 10);
            }
            var checkedInputInx = checkedInputId();
            removeAttrChecked(checkedInputInx);
            setAttrChecked(targetInx);
            config.inx = targetInx;
            if (targetInx > 2) {
                for (var i = targetInx; i < targetInx + 2; i++) {
                    checkPreloaded(i);
                }
            }
        }
}