/**
 * Created by secretariat21 on 9/3/15.
 */
/**
 * Created by bsaund on 6/9/15.
 */

function targetMotion(target) {
    var w = panelPtMass.width;
    var h = panelPtMass.height;
    var t = target.motionTime;
    var coords;
    switch (target.motionType) {
        case "off":
            return;
        case "sinusoid":
            target.setCoords([w / 2 + w / 4 * Math.sin(t), h / 2]);
            break;
        case "circle":
            target.setCoords([w / 2 + h / 4 * Math.sin(t),
                h / 2 + h / 4 * Math.cos(t)
            ]);
            break;
        case "jump":
            var jumpRate = 0.5;
            var jumpIdx = Math.floor((jumpRate * t) % 4)
            switch (jumpIdx) {
                case 0:
                    target.setCoords([w / 4, h / 3]);
                    break;
                case 1:
                    target.setCoords([3 * w / 4, h / 3]);
                    break;
                case 2:
                    target.setCoords([3 * w / 4, 2 * h / 3]);
                    break;
                case 3:
                    target.setCoords([w / 4, 2 * h / 3]);
                    break;
            }
            break;
    }
    target.motionTime = target.motionTime + .03;
}


function onGravityChange(checked) {
    gravity = 10000 * checked
}


sliderDamp.onRedraw = function() {

    setAll("xValue", sliderDamp.getValue());
    setAll("y0Value", 8.3145*273*Math.log(1-sliderDamp.getValue()));
    setAll("y1Value", 8.3145*273*Math.log(sliderDamp.getValue()));
    setAll("GValue", gibbs_of_mixing(sliderDamp.getValue()));

};

function setAll(classname, value) {
    var elements = document.getElementsByClassName(classname)
    for (var i in elements) {
        elements[i].innerHTML = value.toFixed(2);
    }

}
