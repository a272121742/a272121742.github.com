(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{IUUV:function(e,t,n){"use strict";n.r(t);function a(){var t=this,e=t.$createElement,n=t._self._c||e;return n("a-layout",{attrs:{id:"components-layout-top-side"}},[n("a-layout-header",{staticClass:"header"},[n("div",{staticClass:"logo"})]),t._v(" "),n("a-layout",[n("a-layout-sider",{staticStyle:{background:"#fff"},attrs:{width:"180",collapsible:""},model:{value:t.collapsed,callback:function(e){t.collapsed=e},expression:"collapsed"}},[n("a-menu",{style:{height:"100%",borderRight:0},attrs:{mode:"inline",theme:"dark","default-selected-keys":["1"]},on:{select:t.onSelect}},[t._l(t.menus,function(e){return[1==e.children.length?n("a-menu-item",{key:e.children[0].name,attrs:{name:e.children[0].name}},[n("a-icon",{key:"menuicon"+e.children[0].name,attrs:{type:"desktop"}}),t._v(" "),n("span",{key:"title"+e.children[0].name,staticClass:"layout-text"},[t._v(t._s(t.$t(e.children[0].name)))])],1):t._e(),t._v(" "),1<e.children.length?n("a-sub-menu",{key:e.name,attrs:{name:e.name}},[n("template",{slot:"title"},[n("a-icon",{attrs:{type:"desktop"}}),t._v(" "),n("span",{staticClass:"layout-text"},[t._v(t._s(t.$t(e.name)))])],1),t._v(" "),t._l(e.children,function(e){return[n("a-menu-item",{key:e.name,attrs:{name:e.name}},[n("a-icon",{key:"icon"+e.name,attrs:{type:"desktop"}}),t._v(" "),n("span",{key:"title"+e.name,staticClass:"layout-text"},[t._v(t._s(t.$t(e.name)))])],1)]})],2):t._e()]})],2)],1),t._v(" "),n("a-layout",{staticStyle:{padding:"0 24px 24px"}},[n("Breadcrumb"),t._v(" "),n("a-layout-content",{style:{padding:"0px",margin:0,minHeight:"280px",height:"100%"}},[n("router-view")],1)],1)],1)],1)}a._withStripped=!0;var s={components:{Breadcrumb:function(){return n.e(6).then(n.bind(null,"Vjgc"))}},data:function(){return{collapsed:!1}},computed:{menus:function(){return console.log("菜单列表",this.$store.state.menus),this.$store.state.menus||[]}},methods:{onSelect:function(e){var t=e.key;this.$router.push({name:t})}}},l=(n("UWfN"),n("KHd+")),o=Object(l.a)(s,a,[],!1,null,null,null);o.options.__file="src/modules/layout/view/default.vue";t.default=o.exports},K9SV:function(e,t,n){},UWfN:function(e,t,n){"use strict";var a=n("K9SV");n.n(a).a}}]);
//# sourceMappingURL=8.2672719abb18d4862d78.js.map