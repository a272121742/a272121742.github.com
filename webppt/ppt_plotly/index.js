var slideAnime = {};

slideshow.on('showSlide', function(slide){
  if(!slide.showAnime && ~Object.keys(slideAnime).indexOf(slide.properties.name)){
    slideAnime[slide.properties.name]();
    slide.showAnime = true;
  }
  return;
});

// Highcharts Weather案例
slideAnime.Highcharts_Weather = function(){
  function Meteogram(xml, container) {
    // Parallel arrays for the chart data, these are populated as the XML/JSON file
    // is loaded
    this.symbols = [];
    this.symbolNames = [];
    this.precipitations = [];
    this.windDirections = [];
    this.windDirectionNames = [];
    this.windSpeeds = [];
    this.windSpeedNames = [];
    this.temperatures = [];
    this.pressures = [];
    // Initialize
    this.xml = xml;
    this.container = container;
    // Run
    this.parseYrData();
  }
  /**
   * Return weather symbol sprites as laid out at http://om.yr.no/forklaring/symbol/
   */
  Meteogram.prototype.getSymbolSprites = function (symbolSize) {
      return {
          '01d': {
              x: 0,
              y: 0
          },
          '01n': {
              x: symbolSize,
              y: 0
          },
          '16': {
              x: 2 * symbolSize,
              y: 0
          },
          '02d': {
              x: 0,
              y: symbolSize
          },
          '02n': {
              x: symbolSize,
              y: symbolSize
          },
          '03d': {
              x: 0,
              y: 2 * symbolSize
          },
          '03n': {
              x: symbolSize,
              y: 2 * symbolSize
          },
          '17': {
              x: 2 * symbolSize,
              y: 2 * symbolSize
          },
          '04': {
              x: 0,
              y: 3 * symbolSize
          },
          '05d': {
              x: 0,
              y: 4 * symbolSize
          },
          '05n': {
              x: symbolSize,
              y: 4 * symbolSize
          },
          '18': {
              x: 2 * symbolSize,
              y: 4 * symbolSize
          },
          '06d': {
              x: 0,
              y: 5 * symbolSize
          },
          '06n': {
              x: symbolSize,
              y: 5 * symbolSize
          },
          '07d': {
              x: 0,
              y: 6 * symbolSize
          },
          '07n': {
              x: symbolSize,
              y: 6 * symbolSize
          },
          '08d': {
              x: 0,
              y: 7 * symbolSize
          },
          '08n': {
              x: symbolSize,
              y: 7 * symbolSize
          },
          '19': {
              x: 2 * symbolSize,
              y: 7 * symbolSize
          },
          '09': {
              x: 0,
              y: 8 * symbolSize
          },
          '10': {
              x: 0,
              y: 9 * symbolSize
          },
          '11': {
              x: 0,
              y: 10 * symbolSize
          },
          '12': {
              x: 0,
              y: 11 * symbolSize
          },
          '13': {
              x: 0,
              y: 12 * symbolSize
          },
          '14': {
              x: 0,
              y: 13 * symbolSize
          },
          '15': {
              x: 0,
              y: 14 * symbolSize
          },
          '20d': {
              x: 0,
              y: 15 * symbolSize
          },
          '20n': {
              x: symbolSize,
              y: 15 * symbolSize
          },
          '20m': {
              x: 2 * symbolSize,
              y: 15 * symbolSize
          },
          '21d': {
              x: 0,
              y: 16 * symbolSize
          },
          '21n': {
              x: symbolSize,
              y: 16 * symbolSize
          },
          '21m': {
              x: 2 * symbolSize,
              y: 16 * symbolSize
          },
          '22': {
              x: 0,
              y: 17 * symbolSize
          },
          '23': {
              x: 0,
              y: 18 * symbolSize
          }
      };
  };
  /**
   * Function to smooth the temperature line. The original data provides only whole degrees,
   * which makes the line graph look jagged. So we apply a running mean on it, but preserve
   * the unaltered value in the tooltip.
   */
  Meteogram.prototype.smoothLine = function (data) {
      var i = data.length,
          sum,
          value;
      while (i--) {
          data[i].value = value = data[i].y; // preserve value for tooltip
          // Set the smoothed value to the average of the closest points, but don't allow
          // it to differ more than 0.5 degrees from the given value
          sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y;
          data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5));
      }
  };
  /**
   * Callback function that is called from Highcharts on hovering each point and returns
   * HTML for the tooltip.
   */
  Meteogram.prototype.tooltipFormatter = function (tooltip) {
      // Create the header with reference to the time interval
      var index = tooltip.points[0].point.index,
          ret = '<small>' + Highcharts.dateFormat('%A, %b %e, %H:%M', tooltip.x) + '-' +
          Highcharts.dateFormat('%H:%M', tooltip.points[0].point.to) + '</small><br>';
      // Symbol text
      ret += '<b>' + this.symbolNames[index] + '</b>';
      ret += '<table>';
      // Add all series
      Highcharts.each(tooltip.points, function (point) {
          var series = point.series;
          ret += '<tr><td><span style="color:' + series.color + '">\u25CF</span> ' + series.name +
              ': </td><td style="white-space:nowrap">' + Highcharts.pick(point.point.value, point.y) +
              series.options.tooltip.valueSuffix + '</td></tr>';
      });
      // Add wind
      ret += '<tr><td style="vertical-align: top">\u25CF Wind</td><td style="white-space:nowrap">' + this.windDirectionNames[index] +
          '<br>' + this.windSpeedNames[index] + ' (' +
          Highcharts.numberFormat(this.windSpeeds[index], 1) + ' m/s)</td></tr>';
      // Close
      ret += '</table>';
      return ret;
  };
  /**
   * Draw the weather symbols on top of the temperature series. The symbols are sprites of a single
   * file, defined in the getSymbolSprites function above.
   */
  Meteogram.prototype.drawWeatherSymbols = function (chart) {
      var meteogram = this,
          symbolSprites = this.getSymbolSprites(30);
      $.each(chart.series[0].data, function (i, point) {
          var sprite,
              group;
          if (meteogram.resolution > 36e5 || i % 2 === 0) {
              sprite = symbolSprites[meteogram.symbols[i]];
              if (sprite) {
                  // Create a group element that is positioned and clipped at 30 pixels width and height
                  group = chart.renderer.g()
                      .attr({
                      translateX: point.plotX + chart.plotLeft - 15,
                      translateY: point.plotY + chart.plotTop - 30,
                      zIndex: 5
                  })
                      .clip(chart.renderer.clipRect(0, 0, 30, 30))
                      .add();
                  // Position the image inside it at the sprite position
                  chart.renderer.image(
                      'https://www.highcharts.com/samples/graphics/meteogram-symbols-30px.png',
                      -sprite.x,
                      -sprite.y,
                      90,
                      570
                  )
                      .add(group);
              }
          }
      });
  };
  /**
   * Create wind speed symbols for the Beaufort wind scale. The symbols are rotated
   * around the zero centerpoint.
   */
  Meteogram.prototype.windArrow = function (name) {
      var level,
          path;
      // The stem and the arrow head
      path = [
          'M', 0, 7, // base of arrow
          'L', -1.5, 7,
          0, 10,
          1.5, 7,
          0, 7,
          0, -10 // top
      ];
      level = $.inArray(name, ['平静', '微风', '清风', '和风', '四级风',
                               '清劲风', '大风', '强风', '狂风', '裂风', '暴风',
                               '大风暴', '飓风']);
      if (level === 0) {
          path = [];
      }
      if (level === 2) {
          path.push('M', 0, -8, 'L', 4, -8); // short line
      } else if (level >= 3) {
          path.push(0, -10, 7, -10); // long line
      }
      if (level === 4) {
          path.push('M', 0, -7, 'L', 4, -7);
      } else if (level >= 5) {
          path.push('M', 0, -7, 'L', 7, -7);
      }
      if (level === 5) {
          path.push('M', 0, -4, 'L', 4, -4);
      } else if (level >= 6) {
          path.push('M', 0, -4, 'L', 7, -4);
      }
      if (level === 7) {
          path.push('M', 0, -1, 'L', 4, -1);
      } else if (level >= 8) {
          path.push('M', 0, -1, 'L', 7, -1);
      }
      return path;
  };
  /**
   * Draw the wind arrows. Each arrow path is generated by the windArrow function above.
   */
  Meteogram.prototype.drawWindArrows = function (chart) {
      var meteogram = this;
      $.each(chart.series[0].data, function (i, point) {
          var sprite, arrow, x, y;
          if (meteogram.resolution > 36e5 || i % 2 === 0) {
              // Draw the wind arrows
              x = point.plotX + chart.plotLeft + 7;
              y = 255;
              if (meteogram.windSpeedNames[i] === 'Calm') {
                  arrow = chart.renderer.circle(x, y, 10).attr({
                      fill: 'none'
                  });
              } else {
                  arrow = chart.renderer.path(
                      meteogram.windArrow(meteogram.windSpeedNames[i])
                  ).attr({
                      rotation: parseInt(meteogram.windDirections[i], 10),
                      translateX: x, // rotation center
                      translateY: y // rotation center
                  });
              }
              arrow.attr({
                  stroke: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                  'stroke-width': 1.5,
                  zIndex: 5
              })
                  .add();
          }
      });
  };
  /**
   * Draw blocks around wind arrows, below the plot area
   */
  Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
      var xAxis = chart.xAxis[0],
          x,
          pos,
          max,
          isLong,
          isLast,
          i;
      for (pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {
          // Get the X position
          isLast = pos === max + 36e5;
          x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
          // Draw the vertical dividers and ticks
          if (this.resolution > 36e5) {
              isLong = pos % this.resolution === 0;
          } else {
              isLong = i % 2 === 0;
          }
          chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                               'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
              .attr({
              'stroke': chart.options.chart.plotBorderColor,
              'stroke-width': 1
          })
              .add();
      }
  };
  /**
   * Get the title based on the XML data
   */
  Meteogram.prototype.getTitle = function () {
      return 'Meteogram for ' + this.xml.location.name + ', ' + this.xml.location.country;
  };
  /**
   * Build and return the Highcharts options structure
   */
  Meteogram.prototype.getChartOptions = function () {
      var meteogram = this;
      return {
          chart: {
              renderTo: this.container,
              marginBottom: 70,
              marginRight: 40,
              marginTop: 50,
              plotBorderWidth: 1,
              width: 800,
              height: 310
          },
          title: {
              text: this.getTitle(),
              align: 'left'
          },
          credits: {
              text: '根据<a href="https://yr.no">yr.no</a>预测',
              href: this.xml.credit.link['@attributes'].url,
              position: {
                  x: -40
              }
          },
          tooltip: {
              shared: true,
              useHTML: true,
              formatter: function () {
                  return meteogram.tooltipFormatter(this);
              }
          },
          xAxis: [{ // Bottom X axis
              type: 'datetime',
              tickInterval: 2 * 36e5, // two hours
              minorTickInterval: 36e5, // one hour
              tickLength: 0,
              gridLineWidth: 1,
              gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0',
              startOnTick: false,
              endOnTick: false,
              minPadding: 0,
              maxPadding: 0,
              offset: 30,
              showLastLabel: true,
              labels: {
                  format: '{value:%H}'
              }
          }, { // Top X axis
              linkedTo: 0,
              type: 'datetime',
              tickInterval: 24 * 3600 * 1000,
              labels: {
                  format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                  align: 'left',
                  x: 3,
                  y: -5
              },
              opposite: true,
              tickLength: 20,
              gridLineWidth: 1
          }],
          yAxis: [{ // temperature axis
              title: {
                  text: null
              },
              labels: {
                  format: '{value}°',
                  style: {
                      fontSize: '10px'
                  },
                  x: -3
              },
              plotLines: [{ // zero plane
                  value: 0,
                  color: '#BBBBBB',
                  width: 1,
                  zIndex: 2
              }],
              // Custom positioner to provide even temperature ticks from top down
              tickPositioner: function () {
                  var max = Math.ceil(this.max) + 1,
                      pos = max - 12, // start
                      ret;
                  if (pos < this.min) {
                      ret = [];
                      while (pos <= max) {
                          ret.push(pos += 1);
                      }
                  } // else return undefined and go auto
                  return ret;
              },
              maxPadding: 0.3,
              tickInterval: 1,
              gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0'
          }, { // precipitation axis
              title: {
                  text: null
              },
              labels: {
                  enabled: false
              },
              gridLineWidth: 0,
              tickLength: 0
          }, { // Air pressure
              allowDecimals: false,
              title: { // Title on top of axis
                  text: 'hPa',
                  offset: 0,
                  align: 'high',
                  rotation: 0,
                  style: {
                      fontSize: '10px',
                      color: Highcharts.getOptions().colors[2]
                  },
                  textAlign: 'left',
                  x: 3
              },
              labels: {
                  style: {
                      fontSize: '8px',
                      color: Highcharts.getOptions().colors[2]
                  },
                  y: 2,
                  x: 3
              },
              gridLineWidth: 0,
              opposite: true,
              showLastLabel: false
          }],
          legend: {
              enabled: false
          },
          plotOptions: {
              series: {
                  pointPlacement: 'between'
              }
          },
          series: [{
              name: '温度',
              data: this.temperatures,
              type: 'spline',
              marker: {
                  enabled: false,
                  states: {
                      hover: {
                          enabled: true
                      }
                  }
              },
              tooltip: {
                  valueSuffix: '°C'
              },
              zIndex: 1,
              color: '#FF3333',
              negativeColor: '#48AFE8'
          }, {
              name: '降水',
              data: this.precipitations,
              type: 'column',
              color: '#68CFE8',
              yAxis: 1,
              groupPadding: 0,
              pointPadding: 0,
              borderWidth: 0,
              shadow: false,
              dataLabels: {
                  enabled: true,
                  formatter: function () {
                      if (this.y > 0) {
                          return this.y;
                      }
                  },
                  style: {
                      fontSize: '8px'
                  }
              },
              tooltip: {
                  valueSuffix: 'mm'
              }
          }, {
              name: '气压',
              color: Highcharts.getOptions().colors[2],
              data: this.pressures,
              marker: {
                  enabled: false
              },
              shadow: false,
              tooltip: {
                  valueSuffix: ' hPa'
              },
              dashStyle: 'shortdot',
              yAxis: 2
          }]
      }
  };
  /**
   * Post-process the chart from the callback function, the second argument to Highcharts.Chart.
   */
  Meteogram.prototype.onChartLoad = function (chart) {
      this.drawWeatherSymbols(chart);
      this.drawWindArrows(chart);
      this.drawBlocksForWindArrows(chart);
  };
  /**
   * Create the chart. This function is called async when the data file is loaded and parsed.
   */
  Meteogram.prototype.createChart = function () {
      var meteogram = this;
      this.chart = new Highcharts.Chart(this.getChartOptions(), function (chart) {
          meteogram.onChartLoad(chart);
      });
  };
  /**
   * Handle the data. This part of the code is not Highcharts specific, but deals with yr.no's
   * specific data format
   */
  Meteogram.prototype.parseYrData = function () {
      var meteogram = this,
          xml = this.xml,
          pointStart;
      if (!xml || !xml.forecast) {
          $('#loading').html('<i class="fa fa-frown-o"></i> 加载数据失败，请稍后再试');
          return;
      }
      // The returned xml variable is a JavaScript representation of the provided XML,
      // generated on the server by running PHP simple_load_xml and converting it to
      // JavaScript by json_encode.
      $.each(xml.forecast.tabular.time, function (i, time) {
          // Get the times - only Safari can't parse ISO8601 so we need to do some replacements
          var from = time['@attributes'].from + ' UTC',
              to = time['@attributes'].to + ' UTC';
          from = from.replace(/-/g, '/').replace('T', ' ');
          from = Date.parse(from);
          to = to.replace(/-/g, '/').replace('T', ' ');
          to = Date.parse(to);
          if (to > pointStart + 4 * 24 * 36e5) {
              return;
          }
          // If it is more than an hour between points, show all symbols
          if (i === 0) {
              meteogram.resolution = to - from;
          }
          // Populate the parallel arrays
          meteogram.symbols.push(time.symbol['@attributes']['var'].match(/[0-9]{2}[dnm]?/)[0]);
          meteogram.symbolNames.push(time.symbol['@attributes'].name);
          meteogram.temperatures.push({
              x: from,
              y: parseInt(time.temperature['@attributes'].value),
              // custom options used in the tooltip formatter
              to: to,
              index: i
          });
          meteogram.precipitations.push({
              x: from,
              y: parseFloat(time.precipitation['@attributes'].value)
          });
          meteogram.windDirections.push(parseFloat(time.windDirection['@attributes'].deg));
          meteogram.windDirectionNames.push(time.windDirection['@attributes'].name);
          meteogram.windSpeeds.push(parseFloat(time.windSpeed['@attributes'].mps));
          meteogram.windSpeedNames.push(time.windSpeed['@attributes'].name);
          meteogram.pressures.push({
              x: from,
              y: parseFloat(time.pressure['@attributes'].value)
          });
          if (i == 0) {
              pointStart = (from + to) / 2;
          }
      });
      // Smooth the line
      this.smoothLine(this.temperatures);
      // Create the chart when the data is loaded
      this.createChart();
  };
  // End of the Meteogram protype
  $(function () { // On DOM ready...
      var place = 'United_Kingdom/England/London';
      var loc = 'https://www.yr.no/place/' + place + '/forecast_hour_by_hour.xml';
      // if (!location.hash) {
      //     var place = 'United_Kingdom/England/London';
      //     //place = 'France/Rhône-Alpes/Val_d\'Isère~2971074';
      //     //place = 'Norway/Sogn_og_Fjordane/Vik/Målset';
      //     //place = 'United_States/California/San_Francisco';
      //     //place = 'United_States/Minnesota/Minneapolis';
      //     location.hash = 'http://www.yr.no/place/' + place + '/forecast_hour_by_hour.xml';
      // }
      // Then get the XML file through Highcharts' jsonp provider, see
      // https://github.com/highslide-software/highcharts.com/blob/master/samples/data/jsonp.php
      // for source code.
      $.getJSON(
          'https://www.highcharts.com/samples/data/jsonp.php?url=' + loc + '&callback=?',
          function (xml) {
              var meteogram = new Meteogram(xml, 'Highcharts_Weather');
          }
      );
  });
};

// Highcharts Homology Event同源事件
slideAnime.HighCharts_Homology_Event = function(){
  var names = ['MSFT', 'AAPL', 'GOOG'],
  createChart = function (series) {
    var options = {
      tooltip : {
        crosshairs:true,
        dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%Y-%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
        }
      },
      series: [series],
      credits: { 
        enabled: false //不显示LOGO 
      },
      xAxis:{
        type: 'datetime',
        dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
        }
      }
    };
    options.title = {text : ''};
    $('#chart_' + series.name).highcharts('Chart', options);
    $('#stock_' + series.name).highcharts('StockChart', options);
  };
  $.each(names, function (i, name) {
    $.getJSON('http://data.jianshukeji.com/jsonp?filename=json/' + name.toLowerCase() + '-c.json&callback=?', function (data) {
      createChart({name : name.toLowerCase(), data : data});
    });
  });
  /*
   *  同源事件的关键性代码
   *  window.event是单例，因此需要进行属性拷贝，模拟一个新的鼠标事件
   */
  $(document).delegate('.container .child_container','mousemove', function(e){
    var sourceChartContainer = $(this);
    var sourceChart = sourceChartContainer.highcharts();
    var sourceXAxis = sourceChart.xAxis[0];
    var extremes = sourceXAxis.getExtremes();
    var targetChartContainerList = sourceChartContainer.siblings();
    targetChartContainerList.each(function(index, targetChartContainerElement){
      var targetChartContainer = $(targetChartContainerElement);
      var targetChart = targetChartContainer.highcharts();
      var sourceOffset = sourceChartContainer.offset();
      var targetOffset = targetChartContainer.offset();
      var targetE = {};
      for(var i in e){
        targetE[i] = e[i];
      }
      targetE.pageX = e.pageX + targetOffset.left - sourceOffset.left;
      targetE.pageY = e.pageY + targetOffset.top - sourceOffset.top;
      var targetEl =  targetChartContainer.find('rect.highcharts-background')[0] || targetChartContainer.find('path.highcharts-tracker')[0];
      targetE.target = targetE.srcElement = targetE.fromElement = targetE.toElement = targetEl;
      targetE.delegateTarget = targetE.currentTarget = targetChartContainer[0];
      targetE.originalEvent = targetE;
      if(targetChart && targetChart.pointer){
        targetChart.pointer.onContainerMouseMove(targetE);
      }
      if(targetChart && targetChart.scroller){
        targetChart.scroller.mouseMoveHandler(targetE);
      }
      if(sourceChart.mouseIsDown == 'mouseup' || sourceChart.mouseIsDown == 'mousedown'){
        if(targetChart && targetChart.xAxis[0]){
          var targetXAxis = targetChart.xAxis[0];
          targetXAxis.setExtremes(extremes.min, extremes.max);
        }
      }
    });
    return false;
  });
  $(document).delegate('.container .child_container','mouseleave', function(e){
    var sourceChartContainer = $(this);
    var sourceChart = sourceChartContainer.highcharts();
    if(sourceChart && sourceChart.pointer){
      sourceChart.pointer.reset();
      sourceChart.pointer.chartPosition = null;
    }
    var targetChartContainerList = sourceChartContainer.siblings();
    targetChartContainerList.each(function(index, targetChartContainerElement){
      var targetChartContainer = $(targetChartContainerElement);
      var targetChart = targetChartContainer.highcharts();
      if(targetChart && targetChart.pointer){
        targetChart.pointer.reset();
        targetChart.pointer.chartPosition = null;
      }
    });
    return false;
  });
  $(document).delegate('.container .child_container','mouseup', function(e){
    var sourceChartContainer = $(this);
    var sourceChart = sourceChartContainer.highcharts();
    var targetChartContainerList = sourceChartContainer.siblings();
    e.type = 'mouseup';
    if(sourceChart && sourceChart.pointer){
      sourceChart.pointer.drop(e);
      sourceChart.mouseIsDown = 'mouseup';
    }
  });
};

// Highcharts图表
slideAnime.HighCharts_Demo = function(){
  var chart = Highcharts.chart('highchartsDemo', {
    title: {
        text: 'Chart.update'
    },
    subtitle: {
        text: 'Plain'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        type: 'column',
        colorByPoint: true,
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        showInLegend: false
    }]
  });
  $(document).delegate('#plain', 'click', function () {
        chart.update({
            chart: {
                inverted: false,
                polar: false
            },
            subtitle: {
                text: '普通的'
            }
        });
    });
    $(document).delegate('#inverted', 'click', function () {
        // chart.update 支持全部属性动态更新
        chart.update({
            chart: {
                inverted: true,
                polar: false
            },
            subtitle: {
                text: '反转'
            }
        });
    });
    $(document).delegate('#polar', 'click', function () {
        chart.update({
            chart: {
                inverted: false,
                polar: true
            },
            subtitle: {
                text: '极地图'
            }
        });
    });
}

// Echarts图表
slideAnime.Echarts_Anscombe_QuartetChart = function(){
  var myChart = echarts.init(document.getElementById('baiduCharts'));
  var dataAll = [
    [
        [10.0, 8.04],
        [8.0, 6.95],
        [13.0, 7.58],
        [9.0, 8.81],
        [11.0, 8.33],
        [14.0, 9.96],
        [6.0, 7.24],
        [4.0, 4.26],
        [12.0, 10.84],
        [7.0, 4.82],
        [5.0, 5.68]
    ],
    [
        [10.0, 9.14],
        [8.0, 8.14],
        [13.0, 8.74],
        [9.0, 8.77],
        [11.0, 9.26],
        [14.0, 8.10],
        [6.0, 6.13],
        [4.0, 3.10],
        [12.0, 9.13],
        [7.0, 7.26],
        [5.0, 4.74]
    ],
    [
        [10.0, 7.46],
        [8.0, 6.77],
        [13.0, 12.74],
        [9.0, 7.11],
        [11.0, 7.81],
        [14.0, 8.84],
        [6.0, 6.08],
        [4.0, 5.39],
        [12.0, 8.15],
        [7.0, 6.42],
        [5.0, 5.73]
    ],
    [
        [8.0, 6.58],
        [8.0, 5.76],
        [8.0, 7.71],
        [8.0, 8.84],
        [8.0, 8.47],
        [8.0, 7.04],
        [8.0, 5.25],
        [19.0, 12.50],
        [8.0, 5.56],
        [8.0, 7.91],
        [8.0, 6.89]
    ]
  ];

  var markLineOpt = {
    animation: false,
    label: {
        normal: {
            formatter: 'y = 0.5 * x + 3',
            textStyle: {
                align: 'right'
            }
        }
    },
    lineStyle: {
        normal: {
            type: 'solid'
        }
    },
    tooltip: {
        formatter: 'y = 0.5 * x + 3'
    },
    data: [[{
        coord: [0, 3],
        symbol: 'none'
    }, {
        coord: [20, 13],
        symbol: 'none'
    }]]
  };

  option = {
    title: {
        text: 'Anscombe\'s quartet',
        x: 'center',
        y: 0
    },
    grid: [
        {x: '7%', y: '7%', width: '38%', height: '38%'},
        {x2: '7%', y: '7%', width: '38%', height: '38%'},
        {x: '7%', y2: '7%', width: '38%', height: '38%'},
        {x2: '7%', y2: '7%', width: '38%', height: '38%'}
    ],
    tooltip: {
        formatter: 'Group {a}: ({c})'
    },
    xAxis: [
        {gridIndex: 0, min: 0, max: 20},
        {gridIndex: 1, min: 0, max: 20},
        {gridIndex: 2, min: 0, max: 20},
        {gridIndex: 3, min: 0, max: 20}
    ],
    yAxis: [
        {gridIndex: 0, min: 0, max: 15},
        {gridIndex: 1, min: 0, max: 15},
        {gridIndex: 2, min: 0, max: 15},
        {gridIndex: 3, min: 0, max: 15}
    ],
    series: [
        {
            name: 'I',
            type: 'scatter',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: dataAll[0],
            markLine: markLineOpt
        },
        {
            name: 'II',
            type: 'scatter',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: dataAll[1],
            markLine: markLineOpt
        },
        {
            name: 'III',
            type: 'scatter',
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: dataAll[2],
            markLine: markLineOpt
        },
        {
            name: 'IV',
            type: 'scatter',
            xAxisIndex: 3,
            yAxisIndex: 3,
            data: dataAll[3],
            markLine: markLineOpt
        }
    ]
  };
  myChart.setOption(option);
};
// svg d3 wather
slideAnime.SVG_D3_Water = function(){
  var LfgUtil = (function(){
    return {
      defaults : function(){
        return {
          minValue: 0,
          maxValue: 100,
          circleThickness: 0.05, 
          circleFillGap: 0.05, 
          circleColor: "#178BCA", 
          waveHeight: 0.05, 
          waveCount: 1,
          waveRiseTime: 1000,
          waveAnimateTime: 3000,
          waveRise: true,
          waveHeightScaling: true,
          waveAnimate: 1,
          waveColor: "#178BCA", 
          waveOffset: 0, 
          textVertPosition: .5,
          textSize: 1, 
          valueCountUp: true,
          displayPercent: true, 
          textColor: "#045681", 
          waveTextColor: "#A4DBf8"
        };
      },
      renderTo : function(elementId, value, config){
        var gauge = d3.select("#" + elementId);
        var config = config || this.defaults();
        var radius = Math.min(parseInt(gauge.style('width')), parseInt(gauge.style('height')))/2;
        var locationX = parseInt(gauge.style("width"))/2 - radius;
        var locationY = parseInt(gauge.style("height"))/2 - radius;
        var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

        var waveHeightScale;
        if(config.waveHeightScaling){
            waveHeightScale = d3.scale.linear()
                .range([0,config.waveHeight,0])
                .domain([0,50,100]);
        } else {
            waveHeightScale = d3.scale.linear()
                .range([config.waveHeight,config.waveHeight])
                .domain([0,100]);
        }

        var textPixels = (config.textSize*radius/2);
        var textFinalValue = parseFloat(value).toFixed(2);
        var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
        var percentText = config.displayPercent?"%":"";
        var circleThickness = config.circleThickness * radius;
        var circleFillGap = config.circleFillGap * radius;
        var fillCircleMargin = circleThickness + circleFillGap;
        var fillCircleRadius = radius - fillCircleMargin;
        var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

        var waveLength = fillCircleRadius*2/config.waveCount;
        var waveClipCount = 1+config.waveCount;
        var waveClipWidth = waveLength*waveClipCount;

        var textRounder = function(value){ return Math.round(value); };
        if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
            textRounder = function(value){ return parseFloat(value).toFixed(1); };
        }
        if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
            textRounder = function(value){ return parseFloat(value).toFixed(2); };
        }

        var data = [];
        for(var i = 0; i <= 40*waveClipCount; i++){
            data.push({x: i/(40*waveClipCount), y: (i/(40))});
        }

        var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
        var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

        var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
        var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

        var waveRiseScale = d3.scale.linear()
            .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
            .domain([0,1]);
        var waveAnimateScale = d3.scale.linear()
            .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
            .domain([0,1]);
        var textRiseScaleY = d3.scale.linear()
            .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
            .domain([0,1]);

        var gaugeGroup = gauge.append("g")
            .attr('transform','translate('+locationX+','+locationY+')');

        var gaugeCircleArc = d3.svg.arc()
            .startAngle(gaugeCircleX(0))
            .endAngle(gaugeCircleX(1))
            .outerRadius(gaugeCircleY(radius))
            .innerRadius(gaugeCircleY(radius-circleThickness));
        gaugeGroup.append("path")
            .attr("d", gaugeCircleArc)
            .style("fill", config.circleColor)
            .attr('transform','translate('+radius+','+radius+')');

        var text1 = gaugeGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.textColor)
            .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

        var clipArea = d3.svg.area()
            .x(function(d) { return waveScaleX(d.x); } )
            .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
            .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
        var waveGroup = gaugeGroup.append("defs")
            .append("clipPath")
            .attr("id", "clipWave" + elementId);
        var wave = waveGroup.append("path")
            .datum(data)
            .attr("d", clipArea);
        var waveAnimateEl = wave.append('animateTransform')
                                .attr('attributeName', 'transform')
                                .attr('type', 'translate')
                                .attr('form', waveAnimateScale(0.5 - config.waveAnimate * 0.5)+',0')
                                .attr('to', waveAnimateScale(0.5 + config.waveAnimate * 0.5)+',0')
                                .attr('dur', '2000ms')
                                .attr('begin', 'indefinite')
                                .attr('fill','freeze')
                                .attr('additive','sum')
                                .attr('repeatCount', 'indefinite')[0][0];

        var fillCircleGroup = gaugeGroup.append("g")
            .attr("clip-path", "url(#clipWave" + elementId + ")");
        fillCircleGroup.append("circle")
            .attr("cx", radius)
            .attr("cy", radius)
            .attr("r", fillCircleRadius)
            .style("fill", config.waveColor);

        var text2 = fillCircleGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.waveTextColor)
            .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

        

        var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;

        animateValueCountUp(value);
        animateWaveHeight(0, value);
        // animateWave(config.waveAnimate);

        

        function animateValueCountUp(to){
          if(config.valueCountUp){
            var toTextFinalValue = parseFloat(to).toFixed(2);
            var textTween = function(){
                var i = d3.interpolate(this.textContent, toTextFinalValue);
                return function(t) { this.textContent = textRounder(i(t)) + percentText; }
            };
            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
          }
        };
        function animateWaveHeight(form, to){
          var formFilePercent = Math.max(config.minValue, Math.min(config.maxValue, form))/config.maxValue;
          var toFillPercent = Math.max(config.minValue, Math.min(config.maxValue, to))/config.maxValue;
          if(config.waveRise){
            waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(formFilePercent)+')')
                .transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(toFillPercent)+')')
                .each("start", function(){ wave.attr('transform','translate(1,0)'); });
          } else {
              waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(toFillPercent)+')');
          }
        };
        function animateWave(waveAnimate) {
          if(waveAnimate){
            wave.transition()
                .duration(config.waveAnimateTime)
                .ease("linear")
                .attr('transform','translate('+waveAnimateScale(0.5 + waveAnimate * 0.5)+',0)')
                .each("end", function(){
                    wave.attr('transform','translate('+waveAnimateScale(0.5 - waveAnimate * 0.5)+',0)');
                    if(waveAnimate)animateWave(config.waveAnimate);
                });
          }
        }
        gauge.changeValue = function(newValue){
          animateValueCountUp(newValue);
          animateWaveHeight(value, newValue);
          value = newValue;
        };
        gauge.waveAnimate = function(value){
          if(value > 0){
            config.waveAnimate = 1;
            animateWave(1);
          }else if(value < 0){
            config.waveAnimate = -1;
            animateWave(-1);
          }else{
            config.waveAnimate = 0;
            animateWave(0);
          }
        };
        gauge.wtAnimate = function(value){
          if(value > 0){
            fillCircleGroup.select('circle').transition().duration(3000).style('fill','red');
          }else if(value < 0){
            fillCircleGroup.select('circle').transition().duration(3000).style('fill','blue');
          }else{
            fillCircleGroup.select('circle').transition().duration(3000).style('fill',config.waveColor);
          }
        };
        gauge.atAnimate = function(value){
          if(value > 0){
            gaugeGroup.select('path').transition().duration(3000).style('fill','red');
          }else if(value < 0){
            gaugeGroup.select('path').transition().duration(3000).style('fill','blue');
          }else{
            gaugeGroup.select('path').transition().duration(3000).style('fill',config.circleColor);
          }
        };
        gauge.end = function(){
          waveAnimateEl.endElement();
            
        };
        gauge.begin = function(){
          waveAnimateEl.beginElement();
        };
        return gauge;
      }
    }
  })();
  var defaultValue = 50;
  var lgf= LfgUtil.renderTo("fillgauge1", defaultValue);
  d3.select('#up').on('click', function(){
    defaultValue += 10;
    lgf.changeValue(defaultValue);
  });
  d3.select('#down').on('click', function(){
    defaultValue -= 10;
    lgf.changeValue(defaultValue);
  });
  d3.select('#left').on('click', function(){
    lgf.waveAnimate(-1);
  });
  d3.select('#stop').on('click', function(){
    lgf.waveAnimate(0);
  });
  d3.select('#right').on('click', function(){
    lgf.waveAnimate(1);
  });
  d3.select('#wtup').on('click', function(){
    lgf.wtAnimate(1);
  });
  d3.select('#wtrest').on('click', function(){
    lgf.wtAnimate(0);
  });
  d3.select('#wtdown').on('click', function(){
    lgf.wtAnimate(-1);
  });
  d3.select('#atup').on('click', function(){
    lgf.atAnimate(1);
  });
  d3.select('#atrest').on('click', function(){
    lgf.atAnimate(0);
  });
  d3.select('#atdown').on('click', function(){
    lgf.atAnimate(-1);
  });
  d3.select('#end').on('click', function(){
    lgf.end();
  });
  d3.select('#begin').on('click', function(){
    lgf.begin();
  });
};

slideAnime.Canvas_Demo = function(){
  var canvas = document.getElementById('myCanvasDemo'),  //获取canvas元素
      context = canvas.getContext('2d'),  //获取画图环境，指明为2d
      centerX = canvas.width/2,   //Canvas中心点x轴坐标
      centerY = canvas.height/2,  //Canvas中心点y轴坐标
      rad = Math.PI*2/100, //将360度分成100份，那么每一份就是rad度
      speed = 0.1; //加载的快慢就靠它了 
    //绘制蓝色外圈
    function blueCircle(n){
      context.save();
      context.strokeStyle = "#000"; //设置描边样式
      context.lineWidth = 5; //设置线宽
      context.beginPath(); //路径开始
      context.arc(centerX, centerY, 80 , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
      context.stroke(); //绘制
      context.closePath(); //路径结束
      context.restore();
    }
    //绘制白色外圈
    function whiteCircle(){
      context.save();
      context.beginPath();
      context.strokeStyle = "black";
      context.arc(centerX, centerY, 80 , 0, Math.PI*2, false);
      context.stroke();
      context.closePath();
      context.restore();
    }  
    //百分比文字绘制
    function text(n){
      context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
      context.strokeStyle = "#000"; //设置描边样式
      context.font = "40px Arial"; //设置字体大小和字体
      //绘制字体，并且指定位置
      context.strokeText(n.toFixed(0)+"%", centerX-30, centerY+10);
      context.stroke(); //执行绘制
      context.restore();
    } 
    //动画循环
    (function drawFrame(){
      window.requestAnimationFrame(drawFrame, canvas);
      context.clearRect(0, 0, canvas.width, canvas.height);
      whiteCircle();
      text(speed);
      blueCircle(speed);
      if(speed > 100) speed = 0;
      speed += 0.1;
    }());
};

slideAnime.Canvas_Game = function(){

  //Create canvas
  //document.body.innerHTML += '<canvas id="canvas" width="800" height="600"></canvas>';

  //Globals Variables
  //-----------------
  var fps = 15;
  var canvas = document.getElementById('myCanvasGame');
  var ctx = canvas.getContext("2d");      
  var bgColor = "rgb(40,40,40)"
  var ready;
  var enemyScore;
  var renderTimer = setInterval(render,1/fps*100);
  var difficultyTimer;
  var spawnTimer;
  var spawntime;
  var gameTime;
  var difficulty;
  var score;
  var highScore=0;
  var gameOver;
  var entities = [];
  var player;
  var fader;
  

  //Global Functions
  //----------------
  
  //Reset app back to 'Ready?' Screen
  function reset(){
    if (score > highScore) highScore = score;
    ready = true;
    enemyScore = 0;
    gameTime = 0;
    difficulty = 1;
    score = 0;
    spawntime = 1500;
    gameOver = false;
    fader = 0;
    entities = [];
    player = null;
    clearTimers()
  }
  
  //Clear all timers
  function clearTimers(){
    clearInterval(difficultyTimer);
    clearInterval(spawnTimer);
  }
  
  //Initialize all timers
  function initializeTimers(){
    difficultyTimer = setInterval(increaseDifficulty,2000);
    spawnTimer = setInterval(spawnEnemy,spawntime);
  }
  
  //Initialize / Start game
  function init(){
    ready = false;
    clearTimers();
    initializeTimers();
    
    //Spawn player
    player = new Player();
    player.position.set(canvas.width/2,canvas.height-player.size);
    player.render();
    entities.push(player);

  }
  
  //Update Entities
  function updateEntities(){
    entities.forEach(function(e){
      if (e.position.y > canvas.height + 20){
        if (e.name == "Enemy"){
          enemyScore += 1;
        }
        removeEntity(e);
      }
      e.update(1/fps);
    })
  }
  
  //Draw background
  function drawBG(){
    ctx.fillStyle = bgColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  
  //Draw Score / HUD
  function drawScore(){
    ctx.fillStyle = "#CCFF99";
    ctx.font = "24px sans-serif";
    ctx.fillText("Score: " + score,10,24);
    ctx.font = "16px sans-serif";
    ctx.fillText("High Score: " + highScore,10,48);
    var enemyScoreString = "";
    for (var i = 0; i < enemyScore; i++){
      enemyScoreString += "X";
    }
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#FF6666";
    ctx.fillText(enemyScoreString,canvas.width - 75,24);
    ctx.font = "16px sans-serif";
    ctx.fillText("Difficulty: " + difficulty,canvas.width/2 - 50,24);
  }
  
  //Draws some static.
  //@param alpha transparency
  function drawStatic(alpha){
    var s = 15 ;
    for (var x = 0; x < canvas.width; x+=s){
      for (var y = 0; y < canvas.width; y+=s){
        var n = Math.floor(Math.random() * 60);
        ctx.fillStyle = "rgba(" + n + "," + n + "," + n + "," + (Math.random() * alpha) + ")";
        ctx.fillRect(x,y,s,s);
      }
    }
  }
  
  //Draws 'Ready?' screen
  function drawReadyScreen(){
    drawBG();
    //drawStatic(.25);
    drawScore();
    fader += .1 * 1/fps;
    ctx.fillStyle = "rgba(255,255,255," + fader + ")";
    ctx.font = "72px sans-serif";
    ctx.fillText("READY?",canvas.width/2 - 140,canvas.height/2);
    drawScore();
  }
  
  //Draw all entities
  function drawEntities(){
    entities.forEach(function(e){e.render();});
  }
  
  //Draw 'Game Over' screen
  function drawGameOver(){
    ctx.fillStyle = "rgba(0,0,0,"+fader +")";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawStatic(fader/2);
    drawScore();
    fader += .1 * 1/fps
    ctx.fillStyle = "rgba(255,255,255," + fader + ")";
    ctx.font = "72px sans-serif";
    ctx.fillText("GAME OVER",canvas.width/2 - 220,canvas.height/2);
  }
  
  //Render everything
  function render(){
    drawBG();
    drawEntities();
    drawScore();
    if (gameOver){drawGameOver(); return;}
    else if (ready){drawReadyScreen(); return;}
    updateEntities();
    gameTime += 1/fps;
    if (enemyScore >= 3) {
      clearTimers();
      gameOver = true;
      fader = 0;
    }
  }
  
  //Return mouse position relative to canvas
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector2(evt.clientX - rect.left,
              evt.clientY - rect.top)
  }
      
  //Click Event
  function canvasClick(){
    if (gameOver){ if (fader > .5) reset();return;}
    if (ready)    {init(); return;}
    var bullet = new Bullet();
    bullet.position.set(player.position.x + player.size / 2 - bullet.size/2,player.position.y - player.size/2 - bullet.size /2);
    bullet.velocity.y = -30;
    entities.push(bullet);
    if (score > 0) score -= 1;
  }
  
  //Increment difficulty
  function increaseDifficulty(){
    difficulty += 1;
    if (spawntime > 20) spawntime -= 20;
    clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnEnemy,spawntime);
  }
  
  //Change alpha of color
  function setAlpha(color,alpha){
    if (color.indexOf('a') == -1){
      return color.replace(")",","+alpha+")").replace("rgb","rgba");
    }
  }
  
  //Entity death
  function death(entity){
    if (entity.name == "Enemy") {
      var particleCount = Math.floor((Math.random() * 6) + 3);
      for (var i = 0; i < particleCount; i++){
        var p = new Particle();
        p.color = entity.color;
        p.size = Math.floor((Math.random() * entity.size/2) + 5);
        p.position.set(entity.position.x+entity.size/2,entity.position.y+entity.size/2);
        entities.push(p);
      }
      score += 25;
    }
    removeEntity(entity);
  }
  
  //Remove Entity
  function removeEntity(entity){
    var idx = entities.indexOf(entity);
    if (idx > -1) entities.splice(idx,1);
  }
  
  //Check if two entities overlap
  function overlaps(entityA,entityB){
    var sa = entityA.size;
    var x1a = entityA.position.x;
    var x2a = entityA.position.x + sa;
    var y1a = entityA.position.y;
    var y2a = entityA.position.y + sa;
    var sb = entityB.size;
    var x1b = entityB.position.x;
    var x2b = entityB.position.x + sb;
    var y1b = entityB.position.y;
    var y2b = entityB.position.y + sb;
    return (x1a < x2b && x2a > x1b && y1a < y2b && y2a > y1b);
  }
  
  //Spawns new enemy
  function spawnEnemy(){
    var e = new Enemy();
    var px = Math.floor((Math.random() * canvas.width));
    var py = -e.size;
    var v = difficulty;
    var a = Math.floor((Math.random() * (v + 15)) + v);
    var f = Math.floor((Math.random() * (v + 15)) + v);
    e.position.set(px,py);
    var r = Math.random();
    if (r > .5){
      straightDownMotion(e,v);
    }
    else if (r > .3){
      sineMotion(e,a,f,v);
    }
    else if (r > .1){
      triangularMotion(e,a,f,v);
    }
    else{
      sawtoothMotion(e,a,f,v);
    }
    entities.push(e);
  }
  
  //Straight down motion
  function straightDownMotion(entity,speed){
    entity.update = function(deltatime){
      this.velocity.x = 0;
      this.velocity.y = speed;
      Entity.prototype.update.call(this,deltatime);
    }
  }
  
  //Define sin wave motion
  function sineMotion(entity,amplitude,freq,speed){
    entity.update = function(deltatime){
      this.velocity.x = amplitude * Math.cos(this.position.y/freq);
      this.velocity.y = speed;
      Entity.prototype.update.call(this,deltatime);
    }
  }
  
  //Define saw tooth motion (sorta)
  function sawtoothMotion(entity, amplitude,freq,speed){
    var modifier = 1;
    if (Math.random() > .5) modifier = -1;
    entity.update = function(deltatime){
      this.velocity.x = modifier * ((-2*amplitude)/Math.PI)*Math.atan(1/Math.tan(this.position.y / freq));
      this.velocity.y = speed;
      Entity.prototype.update.call(this,deltatime);
    }
  }
  
  //Define triangular motion ()
  function triangularMotion(entity, amplitude,freq,speed){
    entity.update = function(deltatime){
      this.velocity.x = ((2*amplitude)/Math.PI)*Math.asin(Math.sin(this.position.y / freq));
      this.velocity.y = speed;
      Entity.prototype.update.call(this,deltatime);
    }
  }
  
  //Generate random rgba color string
  function randomColor(min,max){
    var r = Math.floor((Math.random() * max) + min);
    var g = Math.floor((Math.random() * max) + min);
    var b = Math.floor((Math.random() * max) + min);
    var col = "rgb(" + r + "," + g + "," + b + ")";
    return col;
  }
  
  // Classes
  //----------
  
  //Vector2
  var Vector2 = function(x1,y1){
    this.x = x1;
    this.y = y1;
  }
  Vector2.prototype.set = function(a,b){
    this.x = a;
    this.y = b;
  }
  
  //Entity (Base class)
  var Entity = function(){
    this.name = "Entity";
    this.size = 25;
    this.position = new Vector2(0,0);
    this.velocity = new Vector2(0,0);
    this.color = "#FFFFFF";
  }
  Entity.prototype.sayName = function(){
    console.log(this.name);
  }
  Entity.prototype.update = function(deltaTime){
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    //Keep in bounds
    if (this.position.x - this.size < 0) {this.position.x = this.size;}
    if (this.position.x + this.size > canvas.width) {this.position.x = canvas.width - this.size;}
  }
  Entity.prototype.render = function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x,this.position.y,this.size,this.size);
  }
  
  //Enemy Entity
  var Enemy = function(){
    Entity.call(this);
    this.name = "Enemy";
    this.size = Math.floor((Math.random() * 50)+20);
    this.color = randomColor(90,150);
  }
  Enemy.prototype = Object.create(Entity.prototype);
  Enemy.prototype.constructor = Entity;
  //Player Entity
  var Player = function(){
    Entity.call(this);
    this.name = "Player";
    this.color = "#4747FF"
  }
  Player.prototype = Object.create(Entity.prototype);
  Player.prototype.constructor = Entity;
  
  //Particle Entity
  var Particle = function(){
    Entity.call(this);
    this.name = "Particle";
    this.size = 10;
    this.time = 0;
    this.maxTime = Math.floor((Math.random() * 10) + 3);
    this.velocity.x = Math.floor((Math.random() * 20) - 10);
    this.velocity.y = Math.floor((Math.random() * 20) - 10);
  }
  Particle.prototype = Object.create(Entity.prototype);
  Particle.prototype.constructor = Entity;
  Particle.prototype.update = function(deltatime){
    Entity.prototype.update.call(this,deltatime);
    this.time += deltatime;
    if (this.time >= this.maxTime) removeEntity(this);
  }
  
  //Bullet Entity
  var Bullet = function(){
    Entity.call(this);
    this.name = "Bullet";
    this.size = 10;
    this.time = 0;
    this.color = "rgba(200,200,200,1)";
    this.particlesDelay = .5;
  }
  Bullet.prototype = Object.create(Entity.prototype);
  Bullet.prototype.constructor = Entity;
  Bullet.prototype.update = function(deltatime){
    Entity.prototype.update.call(this,deltatime);
    
    //Check for collisions
    var me = this;
    entities.forEach(function(e){
      if (e !== me && e.name != "Particle"){
        if (overlaps(me,e)){
          death(e);
          removeEntity(me);
        }
      }
    })
    //Remove from game if outside bounds
    if (this.position.y < 0) removeEntity(this);
    
    //Create particles
    this.time += deltatime;
    if (this.time >= this.particlesDelay){
      this.time = 0;
      var p = new Particle();
      p.size = Math.floor((Math.random() * 5)+2);
      p.color = setAlpha("rgb(125,125,125)",Math.random());
      //p.color = setAlpha(randomColor(100,255),Math.random()); //Rainbow colored particles
      p.velocity.x /=2;
      p.position.x = this.position.x + this.size /2 - p.size/2;
      p.position.y = this.position.y - p.size/2;
      entities.push(p);
    }
  }
  
  

  //  These must remain at the bottom of this file & in this order //
  //  ============================================================ //

  //HTML load event
  document.addEventListener('DOMContentLoaded', reset());
  
  canvas.addEventListener("click",canvasClick);
  
  //Mouse move event
  canvas.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(canvas, evt);
      if (player && !gameOver) player.position.x = mousePos.x;
  }, false);
  
};

slideAnime.WebGL_Water = function(){
  // var dom= document.getElementById('WebGL_Wather'); 
  // var scriptList = ['OES_texture_float_linear-polyfill', 'lightgl', 'cubemap', 'renderer', 'water', 'main'];
  // scriptList.forEach(function(file){
  //   var script= document.createElement('script'); 
  //   script.type= 'text/javascript'; 
  //   script.src= '../demos/webgl-water/' + file + '.js'; 
  //   dom.appendChild(script);
  // });
  showWebGLWater();
};

slideAnime.WebGL_Earth = function(){
  // var earth = new WE.map('WebGL_Earth');
};