(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{XGvD:function(e,t,n){"use strict";n.r(t);function a(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("a-select",{staticStyle:{width:"100%","margin-bottom":"1rem"},attrs:{placeholder:"请选择需要查看的节点"},on:{change:t.load}},t._l(t.nodeList,function(e){return n("a-select-option",{key:e.id,attrs:{value:e.id}},[t._v("\n      "+t._s(e.name)+"\n    ")])}),1),t._v(" "),n("a-table",{attrs:{"row-key":function(e,t){return t},columns:t.columns,"data-source":t.data,pagination:!1,scroll:{y:280},"row-selection":{onSelect:t.handleRowSelect,onSelectAll:t.handleSelectAll,columnTitle:t.customTitle}}},[t._v('\n    \'}"\n    size="small"\n    bordered\n    >\n  ')])],1)}a._withStripped=!0;var o=n("MVZn"),l=n.n(o),c=n("L2JU"),i=n("ho9+"),s=n("Xbfg"),r=n("CKn+"),u=n("n1gy"),d=n("vaPl"),m=Object(d.a)(u.a),h=n("8e1d"),f=Object(c.a)("SimulationOperation").mapActions,p={name:"InoutVars",props:{nodeList:{type:Array,default:function(){return[]}}},data:function(){var e=this.$createElement;return{columns:[{title:"名称",dataIndex:"name",key:"name",width:80},{title:"描述",dataIndex:"desc",key:"desc",width:120}],data:[],customTitle:function(){return e("span")}}},mounted:function(){},methods:l()({},f(["getNode"]),{convertInoutVars:Object(i.a)(h.h,Object(h.f)("name")),load:function(e){var t=this;this.getNode(e).then(function(e){console.log("获取node",e),t.$set(t,"data",t.convertInoutVars(e.result.inoutVars))})},handleRowSelect:function(e,t,n,a){t?this.$emit("selectOk",e.name):this.$emit("selectCancel",e.name)},handleSelectAll:function(e,t,n){var a=Object(s.a)(this.$emit,this),o=e?"selectOk":"selectCancel";n.forEach(Object(i.a)(Object(r.a)("name"),m(a,[o])))}})},v=n("KHd+"),w=Object(v.a)(p,a,[],!1,null,null,null);w.options.__file="src/modules/SimulationOperation/view/InoutVars.vue";t.default=w.exports}}]);
//# sourceMappingURL=2.4e21b11f96ec5a23e963.js.map