(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{U29L:function(e,r,a){"use strict";a.r(r);function t(){var e=this,r=e.$createElement,a=e._self._c||r;return a("a-modal",{attrs:{width:600,title:e.editMode?"编辑变量":"新增变量",visible:e.visible},on:{ok:e.handleOk,cancel:e.handleCancel}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"变量名称"}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{validateFirst:!0,rules:[{required:!0,message:"请输入变量名称"},{validator:e.varsUniquedValidator,message:"变量名称重复"},{pattern:/^[A-Za-z]+$/,message:"变量名称请遵循规范命名"}]}],expression:"[\n          'name', \n          {\n            validateFirst: true,\n            rules: [\n              { required: true, message: '请输入变量名称'}, \n              { validator: varsUniquedValidator, message: '变量名称重复' },\n              { pattern: /^[A-Za-z]+$/, message: '变量名称请遵循规范命名' },\n            ]\n          }\n        ]"}],attrs:{placeholder:"请输入变量名称"}})],1),e._v(" "),a("a-form-item",{attrs:{label:"默认值"}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["defvalue",{rules:[{required:!0,message:"请输入默认值"}]}],expression:"[\n          'defvalue',\n          {rules: [{ required: true, message: '请输入默认值'}]}\n        ]"}],attrs:{placeholder:"请输入默认值"}})],1),e._v(" "),a("a-form-item",{attrs:{label:"变量描述"}},[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["desc"],expression:"[\n          'desc', \n        ]"}],attrs:{autosize:"",placeholder:"请输入变量描述"}})],1),e._v(" "),a("a-form-item",{attrs:{label:"是否保存"}},[a("a-checkbox",{directives:[{name:"decorator",rawName:"v-decorator",value:["saved",{valuePropName:"checked"}],expression:"[\n          'saved',\n          { valuePropName: 'checked' }\n        ]"}]})],1)],1)],1)}t._withStripped=!0;var i=a("MVZn"),n=a.n(i);a("8e1d");function s(e){return{name:e.$form.createFormField({value:e.record.name}),defvalue:e.$form.createFormField({value:e.record.defvalue}),desc:e.$form.createFormField({value:e.record.desc}),saved:e.$form.createFormField({value:e.record.saved})}}var o={name:"InoutVarsEdit",props:{existVars:{type:Array,default:function(){return[]}}},data:function(){return{record:{},visible:!1}},computed:{editMode:function(){return this.record.hasOwnProperty("name")}},watch:{record:function(){this.form.updateFields(s(this))}},created:function(){var e=this;this.form=this.$form.createForm(this,{mapPropsToFields:function(){return s(e)}})},methods:{handleOk:function(){var a=this;this.form.validateFields(function(e){if(!e){var r=a.form.getFieldsValue();a.visible=!1,a.$emit("update",n()({},a.record,r)),a.clear()}})},handleCancel:function(){this.visible=!1,this.clear()},varsUniquedValidator:function(e,r,a){~this.existVars.indexOf(r)&&r!==this.record.name&&a(new Error),a()},load:function(e){this.$set(this,"record",n()({},e)),this.visible=!0},clear:function(){var e=this;this.$nextTick(function(){e.$set(e,"record",{})})}}},d=a("KHd+"),l=Object(d.a)(o,t,[],!1,null,null,null);l.options.__file="src/modules/ModelManagement/view/InoutVarsEdit.vue";r.default=l.exports}}]);
//# sourceMappingURL=11.e918696cb9069b83ef66.js.map