(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{B7Mm:function(e,t,o){},aajs:function(e,t,o){"use strict";var i=o("B7Mm");o.n(i).a},oDFS:function(e,t,o){"use strict";o.r(t);function i(){var e=this.$createElement,t=this._self._c||e;return t("keep-alive",[t("div",{staticClass:"flow-view"},[t("div",{staticClass:"bottom-container"},[t("div",{staticClass:"center-pannel"},[t("div",{ref:"flow",staticClass:"flow"})])])])])}i._withStripped=!0;var n=o("RIqP"),a=o.n(n),l=o("J4zp"),d=o.n(l),s=o("Fojh"),c=o.n(s),r={name:"FlowView",props:{data:{type:Object,default:function(){return{}}},dataMapping:{type:Function,default:function(){}}},data:function(){return{editor:null,flow:null,graph:null}},watch:{data:function(e){this.flow.read(this.data)}},created:function(){},mounted:function(){this.initEditor()},activated:function(){this.data&&this.flow.read(this.data)},methods:{initEditor:function(){this.flow=new c.a.Flow({graph:{container:this.$refs.flow,modes:{move:["panCanvas","keydownCmdWheelZoom","wheelChangeViewport","clickNodeSelected","clickCanvasSelected"]},minZoom:.2,maxZoom:2.5},align:{grid:!0},shortcut:{zoomIn:!0,zoomOut:!0},noEndEdge:!1}),this.flow.changeMode("move"),this.upClarity(1.5),this.data&&this.flow.read(this.data),this.graph=this.flow.getGraph(),this.graph.setFitView("cc"),this.flow.hideGrid(),this.graph.edge({shape:"custom-flow-polyline-round",style:{stroke:"#79838e"},labelRectStyle:{fill:"#ffffff"}}),this.flow.changeAddEdgeModel({shape:"flow-polyline-round"})},listenEvent:function(){var i=this;this.flow.on("afteritemselected",function(e){switch(e.item.type){case"node":if(i.isMultiSelect)i.multiId.push(e.item.model.id),i.multiColor=e.item.model.color;else{i.nodeId=e.item.model.id,i.nodeName=e.item.model.label;var t=e.item.model.size.split("*"),o=d()(t,2);i.nodeWidth=o[0],i.nodeHeight=o[1],i.nodeColor=e.item.model.color}break;case"edge":i.edgeId=e.item.model.id,i.edgeName=e.item.model.label?e.item.model.label.text:null;break;case"group":i.groupId=e.item.model.id,i.groupName=e.item.model.label?e.item.model.label:null,i.groupColor=e.item.model.color?e.item.model.color:"#f2f4f5"}}),this.flow.on("beforeitemunselected",function(){i.isMultiSelect=!1}),this.flow.on("node:dblclick",function(e){i.$emit("node:dbClick",e)}),this.flow.on("dragedge:beforeshowanchor",function(e){e.source===e.target&&(e.cancel=!0),e.sourceAnchor.type===e.targetAnchor.type&&(e.cancel=!0),(i.flow.anchorHasBeenLinked(e.source,e.sourceAnchor)||i.flow.anchorHasBeenLinked(e.target,e.targetAnchor))&&(e.cancel=!0)}),this.graph.on("afterrender",function(e){i.$emit("render",i.getNodes())}),this.graph.on("afterchange",function(e){i.disableSave=!1}),this.graph.on("afterchangesize",function(){i.graph.update()}),this.graph.on("afterzoom",function(e){i.zoomRatio=100*e.updateMatrix[0]}),this.flow.on("edge:mouseenter",function(e){e.item.isSelected||function(e){e.attr("stroke","#1890ff"),e.attr("lineWidth",2)}(e.shape)}),this.flow.on("edge:mouseleave",function(e){e.item.isSelected||function(e){e.attr("stroke","#79838e"),e.attr("lineWidth",1)}(e.shape)})},getItems:function(){return[].concat(a()(this.getNodes()),a()(this.getEdges()))},getEdges:function(){return this.graph.getEdges()},getNodes:function(){return this.graph.getNodes()},changeZoomRatio:function(e){this.zoomRatio=e},download:function(){this.flow.hideGrid(),this.graph.setFitView("cc");var e=this.$refs.flow.childNodes[0].childNodes[0].toDataURL("image/png"),t=document.createElement("a");t.href=e,t.download="download.png",t.click(),t.remove()},formatTooltip:function(e){return"缩放比".concat(e,"%")},upClarity:function(e){var t=this.$refs.flow.childNodes[0].childNodes[0],o=Number(e)||1.5,i=window.devicePixelRatio&&window.devicePixelRatio>=o?window.devicePixelRatio:o,n=t.getBoundingClientRect();t.width=n.width*i,t.height=n.height*i,t.getContext("2d").scale(i,i)}}},h=(o("aajs"),o("KHd+")),f=Object(h.a)(r,i,[],!1,null,"4a1b6bc6",null);f.options.__file="src/components/G6Editor/FlowView.vue";t.default=f.exports}}]);
//# sourceMappingURL=36.6f1dfc2f9d5cc9e7bce4.js.map