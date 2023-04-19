(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{2793:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"default",(function(){return NewComment}));__webpack_require__(19),__webpack_require__(39),__webpack_require__(40),__webpack_require__(51),__webpack_require__(52),__webpack_require__(31),__webpack_require__(41),__webpack_require__(26),__webpack_require__(35),__webpack_require__(27),__webpack_require__(36),__webpack_require__(37),__webpack_require__(33);var _material_ui_core__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__(164),_material_ui_core__WEBPACK_IMPORTED_MODULE_13___default=__webpack_require__.n(_material_ui_core__WEBPACK_IMPORTED_MODULE_13__),_material_ui_icons_AddComment__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__(1310),_material_ui_icons_AddComment__WEBPACK_IMPORTED_MODULE_14___default=__webpack_require__.n(_material_ui_icons_AddComment__WEBPACK_IMPORTED_MODULE_14__),_material_ui_icons_Send__WEBPACK_IMPORTED_MODULE_15__=__webpack_require__(2809),_material_ui_icons_Send__WEBPACK_IMPORTED_MODULE_15___default=__webpack_require__.n(_material_ui_icons_Send__WEBPACK_IMPORTED_MODULE_15__),react__WEBPACK_IMPORTED_MODULE_16__=__webpack_require__(0),react_i18next__WEBPACK_IMPORTED_MODULE_17__=__webpack_require__(11),react_rte__WEBPACK_IMPORTED_MODULE_18__=__webpack_require__(2807),react_rte__WEBPACK_IMPORTED_MODULE_18___default=__webpack_require__.n(react_rte__WEBPACK_IMPORTED_MODULE_18__),_button__WEBPACK_IMPORTED_MODULE_19__=__webpack_require__(861),_BaseComment__WEBPACK_IMPORTED_MODULE_20__=__webpack_require__(571),_RichTextEditorConfig__WEBPACK_IMPORTED_MODULE_21__=__webpack_require__(2806);function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(arr)))return;var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function NewComment(props){var _React$useState2=_slicedToArray(react__WEBPACK_IMPORTED_MODULE_16__.useState((function(){return react_rte__WEBPACK_IMPORTED_MODULE_18___default.a.createEmptyValue()})),2),newBody=_React$useState2[0],setNewBody=_React$useState2[1];react__WEBPACK_IMPORTED_MODULE_16__.useEffect((function(){props.isEditing||setNewBody(react_rte__WEBPACK_IMPORTED_MODULE_18___default.a.createEmptyValue())}),[props.isEditing]);var commentRef=react__WEBPACK_IMPORTED_MODULE_16__.useRef(null);react__WEBPACK_IMPORTED_MODULE_16__.useLayoutEffect((function(){var _commentRef$current;props.isEditing&&(null===(_commentRef$current=commentRef.current)||void 0===_commentRef$current||_commentRef$current.scrollIntoView(!1))}),[commentRef,props.isEditing]);var t=Object(react_i18next__WEBPACK_IMPORTED_MODULE_17__.b)("finder-ui").t;return props.isEditing?react__WEBPACK_IMPORTED_MODULE_16__.createElement("div",{ref:commentRef},react__WEBPACK_IMPORTED_MODULE_16__.createElement(_BaseComment__WEBPACK_IMPORTED_MODULE_20__.a,{footerAction:react__WEBPACK_IMPORTED_MODULE_16__.createElement(NewCommentActions,{isSaving:props.isSaving,onSave:function onSave(){return props.onSave(newBody.toString("html"))},onCancel:function onCancel(){return props.onCancel()}})},react__WEBPACK_IMPORTED_MODULE_16__.createElement(react_rte__WEBPACK_IMPORTED_MODULE_18___default.a,{value:newBody,onChange:setNewBody,readOnly:props.isSaving,toolbarConfig:_RichTextEditorConfig__WEBPACK_IMPORTED_MODULE_21__.a,autoFocus:!0}))):react__WEBPACK_IMPORTED_MODULE_16__.createElement(_button__WEBPACK_IMPORTED_MODULE_19__.a,{icon:react__WEBPACK_IMPORTED_MODULE_16__.createElement(_material_ui_icons_AddComment__WEBPACK_IMPORTED_MODULE_14___default.a,null),color:"primary",variant:"contained",onClick:function onClick(){return props.onCreate()}},t("comments/NewComment/create"))}function NewCommentActions(props){var t=Object(react_i18next__WEBPACK_IMPORTED_MODULE_17__.b)("finder-ui").t;return react__WEBPACK_IMPORTED_MODULE_16__.createElement(react__WEBPACK_IMPORTED_MODULE_16__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_16__.createElement(_button__WEBPACK_IMPORTED_MODULE_19__.b,{icon:react__WEBPACK_IMPORTED_MODULE_16__.createElement(_material_ui_icons_Send__WEBPACK_IMPORTED_MODULE_15___default.a,null),isLoading:props.isSaving,variant:"contained",color:"primary",onClick:props.onSave,className:props.className},t("comments/NewComment/save")),react__WEBPACK_IMPORTED_MODULE_16__.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_13___default.a,{disabled:props.isSaving,variant:"contained",onClick:props.onCancel,className:props.className},t("comments/NewComment/cancel")))}NewComment.displayName="NewComment",NewComment.propTypes={isSaving:function isSaving(props){return props.isSaving&&!props.isEditing?new Error("isSaving can not be true when isEditing is false."):null}};try{NewComment.displayName="NewComment",NewComment.__docgenInfo={description:"",displayName:"NewComment",props:{isEditing:{defaultValue:null,description:"",name:"isEditing",required:!0,type:{name:"boolean"}},isSaving:{defaultValue:null,description:"",name:"isSaving",required:!0,type:{name:"boolean"}},onCreate:{defaultValue:null,description:"",name:"onCreate",required:!0,type:{name:"() => void"}},onCancel:{defaultValue:null,description:"",name:"onCancel",required:!0,type:{name:"() => void"}},onSave:{defaultValue:null,description:"",name:"onSave",required:!0,type:{name:"(body: string) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/comments/_NewComment.tsx#NewComment"]={docgenInfo:NewComment.__docgenInfo,name:"NewComment",path:"src/comments/_NewComment.tsx#NewComment"})}catch(__react_docgen_typescript_loader_error){}},2806:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return toolbarConfig}));var toolbarConfig={display:["INLINE_STYLE_BUTTONS","BLOCK_TYPE_BUTTONS","HISTORY_BUTTONS"],INLINE_STYLE_BUTTONS:[{label:"Bold",style:"BOLD"},{label:"Italic",style:"ITALIC"},{label:"Underline",style:"UNDERLINE"}],BLOCK_TYPE_BUTTONS:[{label:"UL",style:"unordered-list-item"},{label:"OL",style:"ordered-list-item"}],BLOCK_TYPE_DROPDOWN:[]}},2809:function(module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(15);Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _react=_interopRequireDefault(__webpack_require__(0)),_default=(0,_interopRequireDefault(__webpack_require__(16)).default)(_react.default.createElement(_react.default.Fragment,null,_react.default.createElement("path",{d:"M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"}),_react.default.createElement("path",{fill:"none",d:"M0 0h24v24H0z"})),"Send");exports.default=_default}}]);
//# sourceMappingURL=4.4438c6e77207b188bb79.bundle.js.map