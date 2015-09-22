/**
 * Created by secretariat21 on 9/21/15.
 */

/*var GT_response2 = {
    tLow: 0.4,
    tUpp: 1,
    data: new Array(100),

    xlim: [0.4, 1],    //range for x values
    ylim: [-10,30],     //range for y values

    xpos: [300, 575],   //location of x axis on screen (pixels)
    ypos: [50, -50],    //location of y axis on screen (pixels)

    xScale: d3.scale.linear()
        .domain(this.xlim)
        .range(this.xpos),

    yScale: d3.scale.linear()
        .domain(this.ylim)
        .range(this.ypos),

    myDataCurve: function(t) {
        var x = 5*t;

        return this.yScale(x);
    },


    buildData: function() {

        /*var x1 = d3.scale.linear().domain([0, 1000]).range(this.xlim);
        var data = d3.range(1000).map(function(i){ return {
            x: this.xScale(x1(i)),
            y: this.myDataCurve(x1(i))};   // creates the data (x is x, f is y, for each point in xmin to xmax)
        })

        //var x = d3.scale.linear().domain(xlim).range([xpos); // puts the graph in the correct place on the screen
        //var y = d3.scale.linear().domain(d3.extent(data.map(function(d){return d.f;}))).range(this.ypos);

        var line = d3.svg.line()    // turns the data into a line object
            .x(function(d) { return data.x(d); })
            .y(function(d) { return data.y(d); })

        d3.select("#panelPtMass").append("path").attr("d", line(data))     // puts the line in the correct panel
            .attr("class", "curve2");*/

        /*var nData = this.data.length;
        var shift = this.tLow;
        var slope = (this.tUpp - this.tLow) / (nData - 1);
        for (var i = 0; i < nData; i++) {
            var t = shift + i * slope;
            this.data[i] = [this.xScale(t), this.myDataCurve(t)];
        }

        /*var nData = this.data.length;
        var shift = this.tLow;
        var slope = (this.tUpp - this.tLow) / (nData - 1);
        for (var i = 0; i < nData; i++) {
            var t = shift + i * slope;
            this.data[i] = [this.xScale(t), this.myDataCurve(t)];
        }*/
/*    },

    redraw: function() {
        this.x = sliderDamp.getValue();
        this.buildData();
        //d3.select("#panelPtMass").append("path").attr("d", line(data))     // puts the line in the correct panel
        //    .attr("class", "curve2");
        d3.select("#panelPtMass").select(".curve2")
            .attr("d", smoothCurve(this.data));
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
    .attr("class", "curve2");

GT_response2.buildData();*/

var GT_response2 = {
    tLow: 0.4,
    tUpp: 1,
    data: new Array(100),

    R: 8.3145,
    T: 273,
    S: 80,
    b: 10,

    xlim: [0.4, 1],    //range for x values
    xmin: 0.4,
    xmax: 1,
    ylim: [-10, 30],     //range for y values

    xpos: [300, 575],   //location of x axis on screen (pixels)
    ypos: [50, -50],    //location of y axis on screen (pixels)

    xScale: d3.scale.linear()
        //.domain(this.xlim)                    //this doesn't work :( -- nothing plots
        //.domain([this.xmin, this.xmax])       //neither does this :( -- just this doesn't plot
        .domain([0.4, 1])       //range for x values
        .range([300, 575]),     //location of x axis on screen (pixels)

    yScale: d3.scale.linear()
        .domain([-10, 30])  //range for y values
        .range([50, -50]),      //location of y axis on screen (pixels)

    myDataCurve: function(t) {
        Gibbs_o = -this.S*t+this.b;
        Gibbs_mix = this.R*t*Math.log(1-this.x);

        var x = Gibbs_o + Gibbs_mix+10;

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
        d3.select("#panelPtMass").select(".curve2")
            .attr("d", smoothCurve(this.data));
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
    .attr("class", "curve2");

GT_response2.buildData();