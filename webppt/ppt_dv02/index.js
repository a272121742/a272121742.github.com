(function(){
  // var events = [
  //   'gotoSlide',
  //   'gotoPreviousSlide',
  //   'gotoNextSlide',
  //   'gotoFirstSlide',
  //   'gotoLastSlide',
  //   'slidesChanged',
  //   'createClone',
  //   'resetTimer',
  //   'showSlide',
  //   'hideSlide',
  //   'beforeShowSlide',
  //   'afterShowSlide',
  //   'beforeHideSlide',
  //   'afterHideSlide',
  //   'toggledPresenter',
  //   'pause',
  //   'resume'
  // ];
  // events.forEach(function(e){
  //   (function(e){
  //     slideshow.on(e, function(slide){
  //       console.log(e, slide.properties.name);
  //     });
  //   })(e);
  // });
  var animates = {};
  
  slideshow.on('showSlide', function(slide){
    var name = slide.properties.name;
    if(name && animates.hasOwnProperty(name) && !slide.showed){
      animates[name](name);
      slide.showed = true;
    }
  });

  animates.ChartTypes = function(name){
    var nodes = [
      {name : '图表分类'}, 
      {name : '比较类'}, {name : '分布类'}, {name : '流程类'}, 
      {name : '占比类'}, {name : '区间类'}, {name : '关联类'}, 
      {name : '趋势类'}, {name : '时间类'}, {name : '地图类'},
    ];
    var links = [
      {source : 0, target : 1}, {source : 0, target : 2}, {source : 0, target : 3}, 
      {source : 0, target : 4}, {source : 0, target : 5}, {source : 0, target : 6}, 
      {source : 0, target : 7}, {source : 0, target : 8}, {source : 0, target : 9}
    ];                
    var width = 800;
    var height = 600;
    var svg = d3.select("div#" + name)
                .append("svg")
                .attr("width",width)
                .attr("height",height);
    
    // 通过布局来转换数据，然后进行绘制
    var simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).distance(200))
          .force("charge",d3.forceManyBody())
          .force("center",d3.forceCenter(width/2, height/2));


    var color = d3.scaleOrdinal(d3.schemeCategory20);  

    var svg_links = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke","#ccc")
        .style("stroke-width",3);

    var svg_nodes = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r",function(d, i){
          return i ? 36 : 48;
        })
        .style("fill",function(d,i){
          return color(i);
        })    
        .attr("cx",function(d){return d.x;})
        .attr("cy",function(d){return d.y;})
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    
    var svg_text = svg.selectAll("text")
                      .data(nodes)
                      .enter()
                      .append("text")
                      // .style("fill","#000")
                      .text(function(d){return d.name;});
    
    function draw(){
        svg_nodes
            .attr("cx",function(d){ return d.x;})
            .attr("cy",function(d){ return d.y;});

        svg_text
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
            .attr("dx",function(d, i, list){
              var width = list[i].getBBox().width;
              return - width / 2;
            })
            .attr("dy",function(d, i, list){
              var height = list[i].getBBox().height;
              return height / 2;
            });

        svg_links
            .attr("x1",function(d){ return d.source.x; })
            .attr("y1",function(d){ return d.source.y; })
            .attr("x2",function(d){ return d.target.x; })
            .attr("y2",function(d){ return d.target.y; });
    }
    simulation.on("tick",draw);
    simulation.force('link').links(links);
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = undefined;
      d.fy = undefined;
    }
  };


  animates.Scatter1 = function(name){
    $.getJSON('scatter.json', function(data){
      var Stat = G2.Stat;
      var frame = new G2.Frame(data);
      var hAvg = G2.Frame.mean(frame,'height'); // 计算体重的均值
      var wAvg = G2.Frame.mean(frame,'weight'); // 计算身高均值
      var lineCfg = { // 线的配置信息
        stroke: '#f96a52'
      };
      var chart = new G2.Chart({
        id: name,
        forceFit: true,
        height : 400
      });

      chart.source(data);
      chart.col('weight',{
        alias: '体重（kg）'
      });
      chart.col('height',{
        alias: '身高（cm）'
      });

      chart.point().position('height*weight').color('#00a3d7').opacity(0.5).shape('circle');
      chart.render();
    });
  };

  animates.Bubble1 = function(name){
    $.getJSON('bubble.json',function(data){
      var chart = new G2.Chart({
        id: name,
        forceFit: true,
        height: 450
      });
      chart.source(data, {
        'LifeExpectancy': {
          alias: '人均寿命（年）'
        },
        'Population': {
          type: 'pow',
          alias: '人口总数'
        },
        'GDP': {
          alias: '人均国内生产总值($)'
        },
        'Country': {
          alias: '国家/地区'
        }
      });
      chart.axis('GDP', {
        // 格式化坐标轴的显示
        formatter: function (value) {
          return (value / 1000).toFixed(0) + 'k';
        }
      });
      chart.tooltip({
        title: null // 不显示默认标题
      });
      // 该图表默认会生成多个图例，设置不展示 Population 和 Country 两个维度的图例
      chart.legend('Population', false);
      chart.point().position('GDP*LifeExpectancy')
        .size('Population', 35, 5)
        .color('continent')
        .opacity(0.65)
        .shape('circle')
        .tooltip('Country*Population*GDP*LifeExpectancy');
      chart.render();
    });
  };

  animates.Line1 = function(name){
    $.getJSON('line.json',function (data) {
      var Stat = G2.Stat;
      var chart = new G2.Chart({
        id: name,
        forceFit: true,
        height : 400
      });
      chart.source(data);
      chart.legend({position: 'top'});
        chart.col('timeStamp', {alias: '时间',type: 'time', mask: 'HH:MM', nice: false, tickCount:8});
      chart.col('requestCount', {
        alias: '执行次数',
        formatter: function(val) {
          return val/1000 + 'k';
        }
      });
      chart.col('avgRt', {
        alias: '响应时间',
        formatter: function(val) {
          return val/1000 + 's';
        }
      });
      chart.axis('avgRt', {
        titleOffset: 135
      });
      chart.line().position(Stat.summary.mean('timeStamp*requestCount')).size(3);
      chart.line().position(Stat.summary.mean('timeStamp*avgRt')).color('#E47668').size(3);
      chart.render();
    });
  };

  animates.Bar1 = function(name){
    $.getJSON('bar.json',function(data) {
      var Stat = G2.Stat;
      var chart = new G2.Chart({
        id : name,
        forceFit: true,
        height: 450,
        plotCfg: {
          margin: [20, 60, 80, 120]
        }
      });
      var Frame = G2.Frame;
      var frame = new Frame(data);
      frame = Frame.sort(frame, 'release');
      chart.setMode('select'); // 开启框选模式
      chart.select('rangeX'); // 设置 X 轴范围的框选
      chart.source(frame, { 
        '..count': {
          alias: 'top2000 唱片总量'
        },
        release: {
          tickInterval: 5,
          alias: '唱片发行年份'
        }
      });
      chart.interval().position(Stat.summary.count('release')).color('#2196F3');
      chart.render();
      // 监听双击事件，这里用于复原图表
      chart.on('plotdblclick', function(ev) {
        chart.get('options').filters = {}; // 清空 filters
        chart.repaint();
      });
    });
  };

  animates.Histogram1 = function(name){
    $.getJSON('histogram.json',function (data) {
      var Stat = G2.Stat;
      var data = data.slice(1300,1400);
      var chart = new G2.Chart({
        id: name,
        forceFit: true,
        height: 500
      });
      chart.source(data);
      chart.interval().position(Stat.summary.count(Stat.bin.rect('depth')));
      chart.render();
    });
  };

  animates.Area1 = function(name){
    $('<div id="Area1_Slider"></div>').insertAfter('#' + name);
    $.getJSON('area.json',function(data){
      var chart = new G2.Chart({
        id: name,
        forceFit: true,
        height: 400,
        plotCfg: {
          margin: [40, 85]
        }
      });
      chart.source(data, {
        time: {
          type: 'time',
          tickCount: 8,
          mask: 'm/dd hh:MM'
        },
        flow: {
          alias: '流量(m^3/s)'
        },
        rain: {
          alias: '降雨量(mm)'
        }
      });
      chart.axis('time', {
        title: null
      });
      chart.legend({
        position: 'top'
      });
      chart.area().position('time*flow').color('l(100) 0:#a50f15 1:#fee5d9').opacity(0.85);
      chart.area().position('time*rain').color('l(100) 0:#293c55 1:#f7f7f7').opacity(0.85);
      var slider = new G2.Plugin.slider({
        domId: 'Area1_Slider', //DOM id
        height: 26,
        xDim: 'time',
        yDim: 'flow',
        charts: chart
      });
      slider.render();
    });
  };

  animates.Pie1 = function(name){
    var data = [
      {gender:'男',count:40},{gender:'女',count:30}
    ];

    function formatter(text,item){
        var point = item.point; // 每个弧度对应的点
        var percent = point['..percent']; // ..proportion 字段由Stat.summary.proportion统计函数生成
        percent = (percent * 100).toFixed(2) + '%';
        return text + ':' + percent;
    }
    var Stat = G2.Stat;

    var chart = new G2.Chart({
      id: name,
      width: 1024,
      height : 450
    });

    chart.source(data);
    chart.coord('theta');
    chart.tooltip({
      title: null // 不显示title
    });
    chart.intervalStack().position(Stat.summary.percent('count')).color('gender').label('gender',{renderer: formatter});

    chart.render();
  };

  animates.Donut1 = function(name){
    var data = [
      {genre:'Sports',sold:27500},
      {genre:'Strategy',sold:11500},
      {genre:'Action',sold:6000},
      {genre:'Shooter',sold:3500},
      {genre:'Other',sold:1500},
    ];

    function formatter(text,item){
        var point = item.point; // 每个弧度对应的点
        var percent = point['..percent']; // ..proportion 字段由Stat.summary.proportion统计函数生成
        percent = (percent * 100).toFixed(2) + '%';
        return percent;
    }
    var Stat = G2.Stat;

    var chart = new G2.Chart({
      id: name,
      width: 1024,
      height : 450
    });

    chart.source(data);
    chart.legend('bottom');

    chart.coord('theta',{radius: 0.9,inner: 0.8});

    chart.intervalStack().position(Stat.summary.percent('sold')).color('genre').label('genre',{renderer: formatter});
    chart.render();
  };

  animates.Radar1 = function(name){
    var data = [
      {item: "易用性", value: 80, obj: "华为Mate"},
      {item: "功能", value: 90, obj: "华为Mate"},
      {item: "拍照", value: 80, obj: "华为Mate"},
      {item: "跑分", value: 70, obj: "华为Mate"},
      {item: "续航", value: 90, obj: "华为Mate"},
      {item: "易用性", value: 70, obj: "中兴Grand Memo"},
      {item: "功能", value: 82, obj: "中兴Grand Memo"},
      {item: "拍照", value: 81, obj: "中兴Grand Memo"},
      {item: "跑分", value: 82, obj: "中兴Grand Memo"},
      {item: "续航", value: 78, obj: "中兴Grand Memo"}
    ];
    var chart = new G2.Chart({
      id: name,
      width: 1120,
      height: 450,
      plotCfg: {
        margin: [20, 140, 60, 80]
      }
    });
    chart.source(data, {
      'value': {
        min: 0,
        max: 100,
        tickCount: 5
      }
    });
    chart.coord('polar');
    chart.legend('obj', { // 配置具体字段对应的图例属性
      title: null,
      position: 'bottom'
    });
    chart.axis('item',{ // 设置坐标系栅格样式
      line: null
    });
    chart.axis('value',{ // 设置坐标系栅格样式
      grid: {
        type: 'polygon' //圆形栅格，可以改成
      }
    });
    chart.line().position('item*value').color('obj');
    chart.point().position('item*value').color('obj').shape('circle');
    chart.area().position('item*value').color('obj');
    chart.render();
  };

  animates.Polar1 = function(name){
    var data = [
      {question: '问题 1', percent: 0.21},
      {question: '问题 2', percent: 0.47},
      {question: '问题 3', percent: 0.49},
      {question: '问题 4', percent: 0.52},
      {question: '问题 5', percent: 0.53},
      {question: '问题 6', percent: 0.54},
      {question: '问题 7', percent: 0.60},
      {question: '问题 8', percent: 0.67}
    ];
    (function(data){
      var Frame = G2.Frame;
      var frame = new Frame(data); // 加工数据
      frame.addCol('odd',function(obj,index){
        return index % 2;
      });
      var chart = new G2.Chart({
        id: name,
        // forceFit: true,
        width: 500,
        height: 450
      });
      var defs = {
        'percent': {min: 0,max: 1},
        'odd': {type: 'cat'}
      };
      chart.source(frame,defs);
      chart.tooltip({
        map: {
          value: 'percent',
          name: '占比',
          title: 'question'
        }
      });
      chart.legend(false);
      chart.coord('polar',{inner: 0.1}).transpose();
      chart.interval().position('question*percent')
        .color('odd',function(value){
        return ['rgb(224,74,116)', 'rgb(211,0,57)'][value];
      })
        .label('percent',{offset: -5});
      frame.each(function(obj){
        chart.guide().text([obj.question,0],obj.question + ' ',{
          textAlign: 'right'
        });
      });
      chart.render();
    })(data);
    (function(data){
      var Frame = G2.Frame;
      var frame = new Frame(data); // 加工数据
      frame.addCol('odd',function(obj,index){
        return index % 2;
      });
      var chart = new G2.Chart({
        id : name + 'a',
        // forceFit: true,
        width: 500,
        height: 450
      });
      chart.source(frame, { 
        question: {
          alias: '问题'
        },
        percent : {
          alias: '占比'
        },
        odd : {
          type: 'cat'
        }
      });
      chart.intervalStack().position('question*percent').color('odd', function(value){
        return ['rgb(224,74,116)', 'rgb(211,0,57)'][value];
      })
      chart.legend(false);
      chart.render();
    })(data);
  };

  animates.Polar2 = function(name){
    var data = [
      {genre:'Sports',sold:27500},
      {genre:'Strategy',sold:11500},
      {genre:'Action',sold:6000},
      {genre:'Shooter',sold:3500},
      {genre:'Other',sold:1500},
    ];
    (function(data){
      function formatter(text,item){
        var point = item.point; // 每个弧度对应的点
        var percent = point['..percent']; // ..proportion 字段由Stat.summary.proportion统计函数生成
        percent = (percent * 100).toFixed(2) + '%';
        return text + ': ' + percent;
      }
      var Stat = G2.Stat;
      var chart = new G2.Chart({
        id: name,
        width: 500,
        height : 450
      });
      chart.source(data);
      chart.legend('bottom');
      chart.coord('theta',{radius: 0.8});
      chart.intervalStack().position(Stat.summary.percent('sold')).color('genre').label('genre',{renderer: formatter});
      chart.render();
    })(data);
    (function(data){
      var Stat = G2.Stat;
      var chart = new G2.Chart({
        id: name + 'a',
        width: 500,
        height : 450
      });
      chart.source(data);
      chart.intervalStack().position('genre*sold').color('genre')
      chart.render();
    })(data);
  };
  // animates.Scatter2 = function(name){
  //   var data = [];
  //   data = getData1();
  //   var chart = new G2.Chart({
  //     id : name,
  //     // forceFit: true,
  //     width:800,
  //     height : 400
  //   });
  //   chart.source(data);
  //   chart.point().position('x*y').color('blue').shape('circle').size(1);
  //   chart.render();
  //   $('#ChangeScatter2').click(function(){
  //     var data = getData2();
  //     chart.changeData(data);
  //   });
  //   function getData1(){
  //     var data = [];
  //     for(var i = 1; i <= 100; i++){
  //       data.push({
  //         x : i,
  //         y : i + 1/2 - Math.random()
  //       });
  //     }
  //     return data;
  //   };
  //   function getData2(){
  //     var data = [];
  //     for(var i = 1; i <= 100; i++){
  //       data.push({
  //         x : i,
  //         y : 100 - i + 1/2 - Math.random()
  //       });
  //     }
  //     return data;
  //   };
  // };
})();