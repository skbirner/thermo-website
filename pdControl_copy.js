/**
 * Created by secretariat21 on 9/3/15.
 */
//This page is for variable and function definitions

/*
 Returns the input clipped my min and max values
 */
function bound(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

var panelPtMass = {
    width: parseInt(document.getElementById("panelPtMass").style.width),
    height: parseInt(document.getElementById("panelPtMass").style.height),
    svg: d3.select("#panelPtMass"),
};

var formatLabelString = d3.format(".2f");

/*
 Define a slider class
 */
function Slider(domain, range, sliderName, circleName, labelName, initialValue) {
    this.x = 0;
    this.y = document.getElementById(sliderName).getAttribute("y2");
    this.value = initialValue ? initialValue : 0;
    this.needsRedraw = true;

    this.xRange = domain;
    this.valueRange = range;

    this.scaleXToValue = d3.scale.linear()
        .domain(this.xRange)
        .range(this.valueRange);
    this.scaleValueToX = d3.scale.linear()
        .domain(this.valueRange)
        .range(this.xRange);


    this.getValue = function() {
        return this.value
    };
    this.setValue = function(value) {
        this.setX(this.scaleValueToX(value));
    }
    this.setX = function(x) {
        this.x = bound(x, this.xRange[0], this.xRange[1]);
        this.value = this.scaleXToValue(this.x);
        this.needsRedraw = true;
    }
    this.redraw = function() {
        if (!this.needsRedraw) {
            return;
        }
        this.needsRedraw = false;
        d3.select(circleName)
            .attr("cx", this.x)
            .attr("cy", this.y);
        d3.select(labelName)
            .text(formatLabelString(this.value))
            .attr("x", this.x);
        this.onRedraw();
    }

    this.onRedraw = function() {}

    this.initialize = function() {
        this.setValue(this.value);
        var sliderReference = this;

        d3.select(circleName).call(
            d3.behavior.drag()
                .on("drag", function() {
                    sliderReference.setX(d3.event.x);
                }));

        d3.select("#" + sliderName).on("click", function() {
            var clickPos = d3.mouse(this);
            sliderReference.setX(clickPos[0]);
        })
    }

    this.initialize();
}

var sliderDamp = new Slider([160, 300], [0, 0.5], "dampingRail", "#dampingCircle", "#dampingLabel");

var stepResponse = {
    tLow: 0,
    tUpp: 1.0,
    data: new Array(100),

    m: 0.1,
    b: 2.0,
    R: 8.3145,
    T: 273,

    xScale: d3.scale.linear()
        .domain([0, 1.0])       //range for x values
        .range([450, 700]),     //location of x axis on screen (pixels)

    yScale: d3.scale.linear()
        .domain([-1550, 0])  //range for y values
        .range([150, 30]),      //location of y axis on screen (pixels)

    myDataCurve: function(t) {
            m = this.R*this.T*(Math.log(this.x) - Math.log(1-this.x));
            b = this.R*this.T*(Math.log(1-this.x));

            var x = m*t + b;

            return this.yScale(x);
    },

    buildData: function() {
        var nData = this.data.length;
        var shift = this.tLow;
        var slope = (this.tUpp - this.tLow) / (nData - 1);
        for (var i = 0; i < nData; i++) {
            var t = shift + i * slope;
            this.data[i] = [this.xScale(t), this.myDataCurve(t)];
        }

    },
    redraw: function() {
        this.x = sliderDamp.getValue();
        this.buildData();
        d3.select("#panelTwo").select(".curve")
            .attr("d", smoothCurve(this.data));
    }
}

//Initialize the step response curve
d3.select("#panelTwo").append("path")
    .attr("class", "curve");

stepResponse.buildData();


var GT_response = {
    tLow: 0.4,
    tUpp: 1,
    data: new Array(100),
    data2: new Array(100),

    R: 8.3145,
    T: 273,
    S: 80,
    b: 10,

    xScale: d3.scale.linear()
        .domain([0.4, 1])       //range for x values
        .range([300, 575]),     //location of x axis on screen (pixels)

    yScale: d3.scale.linear()
        .domain([-10, 30])  //range for y values
        .range([50, -50]),      //location of y axis on screen (pixels)

    myDataCurve: function(t) {
        Gibbs_o = -this.S*t+this.b;
        Gibbs_mix = this.R*t*Math.log(1-this.x);

        var x = Gibbs_o + Gibbs_mix;

        return this.yScale(x);
    },

    //X_Intercept: this.myDataCurve(0.6),


    buildData: function() {
        var nData = this.data.length;
        var shift = this.tLow;
        var slope = (this.tUpp - this.tLow) / (nData - 1);
        for (var i = 0; i < nData; i++) {
            var t = shift + i * slope;
            this.data[i] = [this.xScale(t), this.myDataCurve(t)];
         //   this.data2[i] = [0.6, this.yScale(t)];
        }
    },

    redraw: function() {
        this.x = sliderDamp.getValue();
        this.buildData();
        d3.select("#panelPtMass").select(".curve")
            .attr("d", smoothCurve(this.data));
        //d3.select("#panelPtMass").select(".curve")
        //    .attr("d", smoothCurve(this.data2));
    }
}

var smoothCurve = d3.svg.line()
    .x(function(d) {
        return d[0];
    })
    .y(function(d) {
        return d[1];
    })
    .interpolate("monotone");

//Initialize the GT curve
d3.select("#panelPtMass").append("path")
    .attr("class", "curve");

GT_response.buildData();


//ANIMATION LOOP:
var tLast = 0,
    dt = 0;
d3.timer(function(t) {
    dt = t - tLast;
    tLast = t;

    sliderDamp.redraw();
    stepResponse.redraw();
    GT_response.redraw();
});

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