function resize(){
  $('.container .line').each(function(){
    var div = $(this);
    var height = div.height();
    var gutterLine = div.parents('tr').find('.gutter div[class="'+div.attr('class')+'"]');
    gutterLine.height(height);
  });
};
var SD = new Showdown.converter();
var SH = SyntaxHighlighter;
SH.defaults['toolbar'] = false;
SH.defaults['auto-links'] = false;
SH.defaults['pad-line-numbers'] = 3;
var x = 0;
$(window).on('resize',function(y){
  if(++x%2 == 0){
    resize();
  }
});
$(function(){
  $.mobile.ajaxEnabled = false;
  $('div[src$=".md"]').each(function(){
    var me = $(this);
    var src = me.attr('src') + '?' + new Date().getTime();
    $.get(src,function(data){
      me.html(SD.makeHtml(data));
      $(document).trigger('mdloaded');
      SH.highlight();
      resize();
    });
  });
});
$(document).bind('mdloaded',function(){
  $('pre:has(code)').each(function(){
    var me = $(this);
    var str = me.find('code').attr('class') || '';
    var language = str.split(':')[0] || 'javascript';
    var title = str.split(':')[1] || language.toUpperCase();
    me.attr('class','brush:' + language);
    me.html($(this).find('code').html());
    me.wrap('<div data-role="collapsible" data-collapsed="false" data-theme="b" data-content-theme="a" data-collapsed-icon="arrow-d" data-expanded-icon="arrow-u">');
    me.before('<h3>'+title+'</h3>');
    me.parent().collapsible();
  });
});

