function renderStacked(selector, csvString, options) {
  var defaultOptions = {
    colors: ["#0B4BE5", "#0072CE", "#0BBDE5", "#0BDBC9", "#00F299"],
    xAxisLabel: "Financial Years",
    yAxisLabel: "Tonnes CO\u2082e"
  }
  options = $.extend(defaultOptions, options == undefined ? {} : options);

  var svg = d3.select(selector),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(options.colors);

  var data = d3.csvParse(csvString, function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  });

  var keys = data.columns.slice(1);

  //data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d) { return d.Period; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Period); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("x", width)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "-0.2em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(options.xAxisLabel);

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text(options.yAxisLabel);

  // Climate Change Act 2008 target line
  // Interpreted in the NHS as
  // - a 10% reduction between 2007-08 and 2015-16 ; and
  // - an overall 34% reduction by 2020/21
  // Only to be applied to the core emissions.
  var x1 = 0;
  var y1 = data[0]['Core emissions']; // Core emissions in 2007-08 is 100% (baseline)
  var x2 = x('15-16'); // x dimension scaled to 2015-16
  var y2 = y1 * (1 - ((100-90) / 100)); // 10% reduction from 2007-08 baseline
  var ccaPhase1 = [[x1,y1,x2,y2]];
  var x3 = x('20-21'); // x dimension scaled to 2020
  var y3 = y2 * (1 - ((100-66   ) / 100)); // 34% reduction from 2015-16 to 20-21
  var ccaPhase2 = [[x2,y2,x3,y3]];

  g.selectAll(".ccaPhase1")
      .data(ccaPhase1)
      .enter()
    .append("line")
      .attr("class", "ccaPhase1")
      .attr("x1", function(d) { return d[0]; })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return d[2]; })
      .attr("y2", function(d) { return y(d[3]); })
      .attr("stroke", "black")
      .attr("stroke-width", 1);

  g.selectAll(".ccaPhase2")
      .data(ccaPhase2)
      .enter()
    .append("line")
      .attr("class", "ccaPhase2")
      .attr("x1", function(d) { return d[0]; })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return d[2]; })
      .attr("y2", function(d) { return y(d[3]); })
      .attr("stroke", "black")
      .attr("stroke-width", 1);

  var legend = g.append("g")
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // Organisation's own target - n% reduction in emissions from base year by 2020/21
  var n = 32;
  var x4 = x('11-12'); // x dimension scaled to baseline year
  var y4 = data[4]['total']; //
  var x5 = x('20-21'); // x dimension scaled to 2020
  var y5 = y4 * (1 - ((n) / 100)); // n% reduction from baseline
  var orgTarget = [[x4,y4,x5,y5]];

  g.selectAll(".orgTarget")
      .data(orgTarget)
      .enter()
    .append("line")
      .attr("class", "orgTarget")
      .attr("x1", function(d) { return d[0]; })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return d[2]; })
      .attr("y2", function(d) { return y(d[3]); })
      .attr("stroke", "#0B4BE5")
      .attr("stroke-width", 1);

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

  var legend2 = g.append("g")
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(["CCA 2008", "Org'n Target"])
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + (i+4) * 20 + ")"; });

  var z2 = d3.scaleOrdinal().range(['#000',"#0B4BE5"]);
  legend2.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 3)
      .attr("fill", z2);

  legend2.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "-0.2em")
      .text(function(d) { return d; });
}
