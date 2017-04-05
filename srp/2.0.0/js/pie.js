function renderPie(selector, csvString) {

  // If csvString missing or only header row without data
  if (csvString == undefined || csvString.trim().length==0 || csvString.trim().split('\n').length<2) {
    csvString = 'classification,percentage\n'
                  +'No data,100 \n';
  }

  var svg = d3.select(selector),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      radius = Math.min(width, height) / 2,
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal([/*"#3B00F2", "#0008FC", "#0B4BE5",*/ "#0072ce", "#0BBDE5", "#0BDBC9", "#00F299", "#00E851", /*"#0CF91C",*/ "#3DE800"]);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.percentage; });

  var path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  var data = d3.csvParse(csvString, function(d) {
    d.percentage = +d.percentage;
    return d;
  });

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.classification); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.classification; });
}
