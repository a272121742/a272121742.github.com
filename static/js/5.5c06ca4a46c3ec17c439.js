(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"3XlA":function(t,e,n){"use strict";n.r(e);function a(){var i=this,t=i.$createElement,o=i._self._c||t;return o("div",[o("a-table",{attrs:{"row-key":function(t,e){return e},columns:i.columns,"data-source":i.data,pagination:{pageSize:Number.MAX_SAFE_INTEGER},scroll:{y:240},size:"small",bordered:""},scopedSlots:i._u([{key:"serial",fn:function(t,e,n){return o("span",{},[i._v("\n      "+i._s(n+1)+"\n    ")])}},i._l(["port","type","name","vars"],function(a){return{key:a,fn:function(t,e,n){return[o("div",{key:a},[e.editable?o("a-input",{staticStyle:{margin:"-5px 0"},attrs:{value:t},on:{change:function(t){return i.handleChange(n,a,t.target.value)}}}):[i._v("\n          "+i._s(t)+"\n        ")]],2)]}}}),{key:"operation",fn:function(t,e,n){return[o("div",{staticClass:"editable-row-operations"},[e.editable?o("span",[o("a",{on:{click:function(){return i.handleSave(n,e)}}},[o("a-icon",{attrs:{type:"check-circle"}})],1),i._v(" "),o("a",{on:{click:function(){return i.handleCancel(n)}}},[o("a-icon",{attrs:{type:"stop"}})],1)]):o("span",[o("a",{on:{click:function(){return i.handleEdit(n)}}},[o("a-icon",{attrs:{type:"edit"}})],1),i._v(" "),o("a",{on:{click:function(){return i.handleRemove(n)}}},[o("a-icon",{attrs:{type:"delete"}})],1)])])]}}],null,!0)})],1)}a._withStripped=!0;var i=n("MVZn"),o=n.n(i),s=n("n90j"),c={name:"PortDefined",props:{data:{type:Array,default:function(){return[]}}},data:function(){var t=this.$createElement;return{columns:[{title:"#",scopedSlots:{customRender:"serial"},width:32},{title:"端口",dataIndex:"port",scopedSlots:{customRender:"port"},width:80},{title:"类型",dataIndex:"type",scopedSlots:{customRender:"type"},width:64},{title:"名称",dataIndex:"name",scopedSlots:{customRender:"name"},width:80},{title:"变量",dataIndex:"vars",scopedSlots:{customRender:"vars"},width:272},{title:t("div",["操作    ",t("a",{on:o()({},{click:this.handleAdd})},[t("a-icon",{attrs:{type:"plus"}})])]),dataIndex:"operation",scopedSlots:{customRender:"operation"}}],count:0}},created:function(){this.cacheData=this.data.map(function(t){return o()({},t)}),this.count=this.data.length,console.log("created",this.cacheData,this.data)},methods:{handleAdd:function(){var t=this.count;this.data;this.$set(this.data,t,{port:"",type:"",name:"",vars:"",editable:!0}),this.count++},handleEdit:function(t){console.log("编辑",t),this.$set(this.data[t],"editable",!0)},handleCancel:function(t){console.log("取消编辑",t),t<this.cacheData.length?this.$set(this.data,t,Object(s.a)(this.cacheData[t])):(this.data.pop(),this.count--)},handleChange:function(t,e,n){console.log("正在编辑",t,e,n),this.$set(this.data[t],e,n)},handleSave:function(t,e){delete this.data[t].editable,this.$emit("update",this.data)},handleRemove:function(t){}}},d=(n("U1bF"),n("KHd+")),r=Object(d.a)(c,a,[],!1,null,"5a2b2a1b",null);r.options.__file="src/modules/demo/view/PortDefine.vue";e.default=r.exports},"6W2a":function(t,e,n){},U1bF:function(t,e,n){"use strict";var a=n("6W2a");n.n(a).a}}]);
//# sourceMappingURL=5.5c06ca4a46c3ec17c439.js.map