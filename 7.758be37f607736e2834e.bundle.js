(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{2685:function(module,exports,__webpack_require__){module.exports=function(){"use strict";var hasOwnProperty=Object.hasOwnProperty,setPrototypeOf=Object.setPrototypeOf,isFrozen=Object.isFrozen,objectKeys=Object.keys,freeze=Object.freeze,seal=Object.seal,_ref="undefined"!=typeof Reflect&&Reflect,apply=_ref.apply,construct=_ref.construct;apply||(apply=function apply(fun,thisValue,args){return fun.apply(thisValue,args)}),freeze||(freeze=function freeze(x){return x}),seal||(seal=function seal(x){return x}),construct||(construct=function construct(Func,args){return new(Function.prototype.bind.apply(Func,[null].concat(function _toConsumableArray$1(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}(args))))});var arrayForEach=unapply(Array.prototype.forEach),arrayIndexOf=unapply(Array.prototype.indexOf),arrayJoin=unapply(Array.prototype.join),arrayPop=unapply(Array.prototype.pop),arrayPush=unapply(Array.prototype.push),arraySlice=unapply(Array.prototype.slice),stringToLowerCase=unapply(String.prototype.toLowerCase),stringMatch=unapply(String.prototype.match),stringReplace=unapply(String.prototype.replace),stringIndexOf=unapply(String.prototype.indexOf),stringTrim=unapply(String.prototype.trim),regExpTest=unapply(RegExp.prototype.test),regExpCreate=unconstruct(RegExp),typeErrorCreate=unconstruct(TypeError);function unapply(func){return function(thisArg){for(var _len=arguments.length,args=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++)args[_key-1]=arguments[_key];return apply(func,thisArg,args)}}function unconstruct(func){return function(){for(var _len2=arguments.length,args=Array(_len2),_key2=0;_key2<_len2;_key2++)args[_key2]=arguments[_key2];return construct(func,args)}}function addToSet(set,array){setPrototypeOf&&setPrototypeOf(set,null);for(var l=array.length;l--;){var element=array[l];if("string"==typeof element){var lcElement=stringToLowerCase(element);lcElement!==element&&(isFrozen(array)||(array[l]=lcElement),element=lcElement)}set[element]=!0}return set}function clone(object){var newObject={},property=void 0;for(property in object)apply(hasOwnProperty,object,[property])&&(newObject[property]=object[property]);return newObject}var html=freeze(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),svg=freeze(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","audio","canvas","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","video","view","vkern"]),svgFilters=freeze(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),mathMl=freeze(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),text=freeze(["#text"]),html$1=freeze(["accept","action","align","alt","autocomplete","background","bgcolor","border","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","coords","crossorigin","datetime","default","dir","disabled","download","enctype","face","for","headers","height","hidden","high","href","hreflang","id","integrity","ismap","label","lang","list","loop","low","max","maxlength","media","method","min","minlength","multiple","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","type","usemap","valign","value","width","xmlns"]),svg$1=freeze(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","tabindex","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),mathMl$1=freeze(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),xml=freeze(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),MUSTACHE_EXPR=seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm),ERB_EXPR=seal(/<%[\s\S]*|[\s\S]*%>/gm),DATA_ATTR=seal(/^data-[\-\w.\u00B7-\uFFFF]/),ARIA_ATTR=seal(/^aria-[\-\w]+$/),IS_ALLOWED_URI=seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),IS_SCRIPT_OR_DATA=seal(/^(?:\w+script|data):/i),ATTR_WHITESPACE=seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}var getGlobal=function getGlobal(){return"undefined"==typeof window?null:window},_createTrustedTypesPolicy=function _createTrustedTypesPolicy(trustedTypes,document){if("object"!==(void 0===trustedTypes?"undefined":_typeof(trustedTypes))||"function"!=typeof trustedTypes.createPolicy)return null;var suffix=null;document.currentScript&&document.currentScript.hasAttribute("data-tt-policy-suffix")&&(suffix=document.currentScript.getAttribute("data-tt-policy-suffix"));var policyName="dompurify"+(suffix?"#"+suffix:"");try{return trustedTypes.createPolicy(policyName,{createHTML:function createHTML(html$$1){return html$$1}})}catch(error){return console.warn("TrustedTypes policy "+policyName+" could not be created."),null}};return function createDOMPurify(){var window=arguments.length>0&&void 0!==arguments[0]?arguments[0]:getGlobal(),DOMPurify=function DOMPurify(root){return createDOMPurify(root)};if(DOMPurify.version="2.0.8",DOMPurify.removed=[],!window||!window.document||9!==window.document.nodeType)return DOMPurify.isSupported=!1,DOMPurify;var originalDocument=window.document,useDOMParser=!1,removeTitle=!1,document=window.document,DocumentFragment=window.DocumentFragment,HTMLTemplateElement=window.HTMLTemplateElement,Node=window.Node,NodeFilter=window.NodeFilter,_window$NamedNodeMap=window.NamedNodeMap,NamedNodeMap=void 0===_window$NamedNodeMap?window.NamedNodeMap||window.MozNamedAttrMap:_window$NamedNodeMap,Text=window.Text,Comment=window.Comment,DOMParser=window.DOMParser,trustedTypes=window.trustedTypes;if("function"==typeof HTMLTemplateElement){var template=document.createElement("template");template.content&&template.content.ownerDocument&&(document=template.content.ownerDocument)}var trustedTypesPolicy=_createTrustedTypesPolicy(trustedTypes,originalDocument),emptyHTML=trustedTypesPolicy?trustedTypesPolicy.createHTML(""):"",_document=document,implementation=_document.implementation,createNodeIterator=_document.createNodeIterator,getElementsByTagName=_document.getElementsByTagName,createDocumentFragment=_document.createDocumentFragment,importNode=originalDocument.importNode,hooks={};DOMPurify.isSupported=implementation&&void 0!==implementation.createHTMLDocument&&9!==document.documentMode;var MUSTACHE_EXPR$$1=MUSTACHE_EXPR,ERB_EXPR$$1=ERB_EXPR,DATA_ATTR$$1=DATA_ATTR,ARIA_ATTR$$1=ARIA_ATTR,IS_SCRIPT_OR_DATA$$1=IS_SCRIPT_OR_DATA,ATTR_WHITESPACE$$1=ATTR_WHITESPACE,IS_ALLOWED_URI$$1=IS_ALLOWED_URI,ALLOWED_TAGS=null,DEFAULT_ALLOWED_TAGS=addToSet({},[].concat(_toConsumableArray(html),_toConsumableArray(svg),_toConsumableArray(svgFilters),_toConsumableArray(mathMl),_toConsumableArray(text))),ALLOWED_ATTR=null,DEFAULT_ALLOWED_ATTR=addToSet({},[].concat(_toConsumableArray(html$1),_toConsumableArray(svg$1),_toConsumableArray(mathMl$1),_toConsumableArray(xml))),FORBID_TAGS=null,FORBID_ATTR=null,ALLOW_ARIA_ATTR=!0,ALLOW_DATA_ATTR=!0,ALLOW_UNKNOWN_PROTOCOLS=!1,SAFE_FOR_JQUERY=!1,SAFE_FOR_TEMPLATES=!1,WHOLE_DOCUMENT=!1,SET_CONFIG=!1,FORCE_BODY=!1,RETURN_DOM=!1,RETURN_DOM_FRAGMENT=!1,RETURN_DOM_IMPORT=!1,RETURN_TRUSTED_TYPE=!1,SANITIZE_DOM=!0,KEEP_CONTENT=!0,IN_PLACE=!1,USE_PROFILES={},FORBID_CONTENTS=addToSet({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","plaintext","script","style","svg","template","thead","title","video","xmp"]),DATA_URI_TAGS=addToSet({},["audio","video","img","source","image"]),URI_SAFE_ATTRIBUTES=null,DEFAULT_URI_SAFE_ATTRIBUTES=addToSet({},["alt","class","for","id","label","name","pattern","placeholder","summary","title","value","style","xmlns"]),CONFIG=null,formElement=document.createElement("form"),_parseConfig=function _parseConfig(cfg){CONFIG&&CONFIG===cfg||(cfg&&"object"===(void 0===cfg?"undefined":_typeof(cfg))||(cfg={}),ALLOWED_TAGS="ALLOWED_TAGS"in cfg?addToSet({},cfg.ALLOWED_TAGS):DEFAULT_ALLOWED_TAGS,ALLOWED_ATTR="ALLOWED_ATTR"in cfg?addToSet({},cfg.ALLOWED_ATTR):DEFAULT_ALLOWED_ATTR,URI_SAFE_ATTRIBUTES="ADD_URI_SAFE_ATTR"in cfg?addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES),cfg.ADD_URI_SAFE_ATTR):DEFAULT_URI_SAFE_ATTRIBUTES,FORBID_TAGS="FORBID_TAGS"in cfg?addToSet({},cfg.FORBID_TAGS):{},FORBID_ATTR="FORBID_ATTR"in cfg?addToSet({},cfg.FORBID_ATTR):{},USE_PROFILES="USE_PROFILES"in cfg&&cfg.USE_PROFILES,ALLOW_ARIA_ATTR=!1!==cfg.ALLOW_ARIA_ATTR,ALLOW_DATA_ATTR=!1!==cfg.ALLOW_DATA_ATTR,ALLOW_UNKNOWN_PROTOCOLS=cfg.ALLOW_UNKNOWN_PROTOCOLS||!1,SAFE_FOR_JQUERY=cfg.SAFE_FOR_JQUERY||!1,SAFE_FOR_TEMPLATES=cfg.SAFE_FOR_TEMPLATES||!1,WHOLE_DOCUMENT=cfg.WHOLE_DOCUMENT||!1,RETURN_DOM=cfg.RETURN_DOM||!1,RETURN_DOM_FRAGMENT=cfg.RETURN_DOM_FRAGMENT||!1,RETURN_DOM_IMPORT=cfg.RETURN_DOM_IMPORT||!1,RETURN_TRUSTED_TYPE=cfg.RETURN_TRUSTED_TYPE||!1,FORCE_BODY=cfg.FORCE_BODY||!1,SANITIZE_DOM=!1!==cfg.SANITIZE_DOM,KEEP_CONTENT=!1!==cfg.KEEP_CONTENT,IN_PLACE=cfg.IN_PLACE||!1,IS_ALLOWED_URI$$1=cfg.ALLOWED_URI_REGEXP||IS_ALLOWED_URI$$1,SAFE_FOR_TEMPLATES&&(ALLOW_DATA_ATTR=!1),RETURN_DOM_FRAGMENT&&(RETURN_DOM=!0),USE_PROFILES&&(ALLOWED_TAGS=addToSet({},[].concat(_toConsumableArray(text))),ALLOWED_ATTR=[],!0===USE_PROFILES.html&&(addToSet(ALLOWED_TAGS,html),addToSet(ALLOWED_ATTR,html$1)),!0===USE_PROFILES.svg&&(addToSet(ALLOWED_TAGS,svg),addToSet(ALLOWED_ATTR,svg$1),addToSet(ALLOWED_ATTR,xml)),!0===USE_PROFILES.svgFilters&&(addToSet(ALLOWED_TAGS,svgFilters),addToSet(ALLOWED_ATTR,svg$1),addToSet(ALLOWED_ATTR,xml)),!0===USE_PROFILES.mathMl&&(addToSet(ALLOWED_TAGS,mathMl),addToSet(ALLOWED_ATTR,mathMl$1),addToSet(ALLOWED_ATTR,xml))),cfg.ADD_TAGS&&(ALLOWED_TAGS===DEFAULT_ALLOWED_TAGS&&(ALLOWED_TAGS=clone(ALLOWED_TAGS)),addToSet(ALLOWED_TAGS,cfg.ADD_TAGS)),cfg.ADD_ATTR&&(ALLOWED_ATTR===DEFAULT_ALLOWED_ATTR&&(ALLOWED_ATTR=clone(ALLOWED_ATTR)),addToSet(ALLOWED_ATTR,cfg.ADD_ATTR)),cfg.ADD_URI_SAFE_ATTR&&addToSet(URI_SAFE_ATTRIBUTES,cfg.ADD_URI_SAFE_ATTR),KEEP_CONTENT&&(ALLOWED_TAGS["#text"]=!0),WHOLE_DOCUMENT&&addToSet(ALLOWED_TAGS,["html","head","body"]),ALLOWED_TAGS.table&&(addToSet(ALLOWED_TAGS,["tbody"]),delete FORBID_TAGS.tbody),freeze&&freeze(cfg),CONFIG=cfg)},_forceRemove=function _forceRemove(node){arrayPush(DOMPurify.removed,{element:node});try{node.parentNode.removeChild(node)}catch(error){node.outerHTML=emptyHTML}},_removeAttribute=function _removeAttribute(name,node){try{arrayPush(DOMPurify.removed,{attribute:node.getAttributeNode(name),from:node})}catch(error){arrayPush(DOMPurify.removed,{attribute:null,from:node})}node.removeAttribute(name)},_initDocument=function _initDocument(dirty){var doc=void 0,leadingWhitespace=void 0;if(FORCE_BODY)dirty="<remove></remove>"+dirty;else{var matches=stringMatch(dirty,/^[\s]+/);leadingWhitespace=matches&&matches[0]}var dirtyPayload=trustedTypesPolicy?trustedTypesPolicy.createHTML(dirty):dirty;if(useDOMParser)try{doc=(new DOMParser).parseFromString(dirtyPayload,"text/html")}catch(error){}if(removeTitle&&addToSet(FORBID_TAGS,["title"]),!doc||!doc.documentElement){var body=(doc=implementation.createHTMLDocument("")).body;body.parentNode.removeChild(body.parentNode.firstElementChild),body.outerHTML=dirtyPayload}return dirty&&leadingWhitespace&&doc.body.insertBefore(document.createTextNode(leadingWhitespace),doc.body.childNodes[0]||null),getElementsByTagName.call(doc,WHOLE_DOCUMENT?"html":"body")[0]};DOMPurify.isSupported&&(function(){try{_initDocument('<svg><p><textarea><img src="</textarea><img src=x abc=1//">').querySelector("svg img")&&(useDOMParser=!0)}catch(error){}}(),function(){try{var doc=_initDocument("<x/><title>&lt;/title&gt;&lt;img&gt;");regExpTest(/<\/title/,doc.querySelector("title").innerHTML)&&(removeTitle=!0)}catch(error){}}());var _createIterator=function _createIterator(root){return createNodeIterator.call(root.ownerDocument||root,root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_COMMENT|NodeFilter.SHOW_TEXT,(function(){return NodeFilter.FILTER_ACCEPT}),!1)},_isClobbered=function _isClobbered(elm){return!(elm instanceof Text||elm instanceof Comment||"string"==typeof elm.nodeName&&"string"==typeof elm.textContent&&"function"==typeof elm.removeChild&&elm.attributes instanceof NamedNodeMap&&"function"==typeof elm.removeAttribute&&"function"==typeof elm.setAttribute&&"string"==typeof elm.namespaceURI)},_isNode=function _isNode(obj){return"object"===(void 0===Node?"undefined":_typeof(Node))?obj instanceof Node:obj&&"object"===(void 0===obj?"undefined":_typeof(obj))&&"number"==typeof obj.nodeType&&"string"==typeof obj.nodeName},_executeHook=function _executeHook(entryPoint,currentNode,data){hooks[entryPoint]&&arrayForEach(hooks[entryPoint],(function(hook){hook.call(DOMPurify,currentNode,data,CONFIG)}))},_sanitizeElements=function _sanitizeElements(currentNode){var content=void 0;if(_executeHook("beforeSanitizeElements",currentNode,null),_isClobbered(currentNode))return _forceRemove(currentNode),!0;var tagName=stringToLowerCase(currentNode.nodeName);if(_executeHook("uponSanitizeElement",currentNode,{tagName:tagName,allowedTags:ALLOWED_TAGS}),("svg"===tagName||"math"===tagName)&&0!==currentNode.querySelectorAll("p, br").length)return _forceRemove(currentNode),!0;if(!ALLOWED_TAGS[tagName]||FORBID_TAGS[tagName]){if(KEEP_CONTENT&&!FORBID_CONTENTS[tagName]&&"function"==typeof currentNode.insertAdjacentHTML)try{var htmlToInsert=currentNode.innerHTML;currentNode.insertAdjacentHTML("AfterEnd",trustedTypesPolicy?trustedTypesPolicy.createHTML(htmlToInsert):htmlToInsert)}catch(error){}return _forceRemove(currentNode),!0}return"noscript"===tagName&&regExpTest(/<\/noscript/i,currentNode.innerHTML)||"noembed"===tagName&&regExpTest(/<\/noembed/i,currentNode.innerHTML)?(_forceRemove(currentNode),!0):(!SAFE_FOR_JQUERY||currentNode.firstElementChild||currentNode.content&&currentNode.content.firstElementChild||!regExpTest(/</g,currentNode.textContent)||(arrayPush(DOMPurify.removed,{element:currentNode.cloneNode()}),currentNode.innerHTML?currentNode.innerHTML=stringReplace(currentNode.innerHTML,/</g,"&lt;"):currentNode.innerHTML=stringReplace(currentNode.textContent,/</g,"&lt;")),SAFE_FOR_TEMPLATES&&3===currentNode.nodeType&&(content=currentNode.textContent,content=stringReplace(content,MUSTACHE_EXPR$$1," "),content=stringReplace(content,ERB_EXPR$$1," "),currentNode.textContent!==content&&(arrayPush(DOMPurify.removed,{element:currentNode.cloneNode()}),currentNode.textContent=content)),_executeHook("afterSanitizeElements",currentNode,null),!1)},_isValidAttribute=function _isValidAttribute(lcTag,lcName,value){if(SANITIZE_DOM&&("id"===lcName||"name"===lcName)&&(value in document||value in formElement))return!1;if(ALLOW_DATA_ATTR&&regExpTest(DATA_ATTR$$1,lcName));else if(ALLOW_ARIA_ATTR&&regExpTest(ARIA_ATTR$$1,lcName));else{if(!ALLOWED_ATTR[lcName]||FORBID_ATTR[lcName])return!1;if(URI_SAFE_ATTRIBUTES[lcName]);else if(regExpTest(IS_ALLOWED_URI$$1,stringReplace(value,ATTR_WHITESPACE$$1,"")));else if("src"!==lcName&&"xlink:href"!==lcName&&"href"!==lcName||"script"===lcTag||0!==stringIndexOf(value,"data:")||!DATA_URI_TAGS[lcTag])if(ALLOW_UNKNOWN_PROTOCOLS&&!regExpTest(IS_SCRIPT_OR_DATA$$1,stringReplace(value,ATTR_WHITESPACE$$1,"")));else if(value)return!1}return!0},_sanitizeAttributes=function _sanitizeAttributes(currentNode){var attr=void 0,value=void 0,lcName=void 0,idAttr=void 0,l=void 0;_executeHook("beforeSanitizeAttributes",currentNode,null);var attributes=currentNode.attributes;if(attributes){var hookEvent={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:ALLOWED_ATTR};for(l=attributes.length;l--;){var _attr=attr=attributes[l],name=_attr.name,namespaceURI=_attr.namespaceURI;if(value=stringTrim(attr.value),lcName=stringToLowerCase(name),hookEvent.attrName=lcName,hookEvent.attrValue=value,hookEvent.keepAttr=!0,hookEvent.forceKeepAttr=void 0,_executeHook("uponSanitizeAttribute",currentNode,hookEvent),value=hookEvent.attrValue,!hookEvent.forceKeepAttr){if("name"===lcName&&"IMG"===currentNode.nodeName&&attributes.id)idAttr=attributes.id,attributes=arraySlice(attributes,[]),_removeAttribute("id",currentNode),_removeAttribute(name,currentNode),arrayIndexOf(attributes,idAttr)>l&&currentNode.setAttribute("id",idAttr.value);else{if("INPUT"===currentNode.nodeName&&"type"===lcName&&"file"===value&&hookEvent.keepAttr&&(ALLOWED_ATTR[lcName]||!FORBID_ATTR[lcName]))continue;"id"===name&&currentNode.setAttribute(name,""),_removeAttribute(name,currentNode)}if(hookEvent.keepAttr)if(SAFE_FOR_JQUERY&&regExpTest(/\/>/i,value))_removeAttribute(name,currentNode);else if(regExpTest(/svg|math/i,currentNode.namespaceURI)&&regExpTest(regExpCreate("</("+arrayJoin(objectKeys(FORBID_CONTENTS),"|")+")","i"),value))_removeAttribute(name,currentNode);else{SAFE_FOR_TEMPLATES&&(value=stringReplace(value,MUSTACHE_EXPR$$1," "),value=stringReplace(value,ERB_EXPR$$1," "));var lcTag=currentNode.nodeName.toLowerCase();if(_isValidAttribute(lcTag,lcName,value))try{namespaceURI?currentNode.setAttributeNS(namespaceURI,name,value):currentNode.setAttribute(name,value),arrayPop(DOMPurify.removed)}catch(error){}}}}_executeHook("afterSanitizeAttributes",currentNode,null)}},_sanitizeShadowDOM=function _sanitizeShadowDOM(fragment){var shadowNode=void 0,shadowIterator=_createIterator(fragment);for(_executeHook("beforeSanitizeShadowDOM",fragment,null);shadowNode=shadowIterator.nextNode();)_executeHook("uponSanitizeShadowNode",shadowNode,null),_sanitizeElements(shadowNode)||(shadowNode.content instanceof DocumentFragment&&_sanitizeShadowDOM(shadowNode.content),_sanitizeAttributes(shadowNode));_executeHook("afterSanitizeShadowDOM",fragment,null)};return DOMPurify.sanitize=function(dirty,cfg){var body=void 0,importedNode=void 0,currentNode=void 0,oldNode=void 0,returnNode=void 0;if(dirty||(dirty="\x3c!--\x3e"),"string"!=typeof dirty&&!_isNode(dirty)){if("function"!=typeof dirty.toString)throw typeErrorCreate("toString is not a function");if("string"!=typeof(dirty=dirty.toString()))throw typeErrorCreate("dirty is not a string, aborting")}if(!DOMPurify.isSupported){if("object"===_typeof(window.toStaticHTML)||"function"==typeof window.toStaticHTML){if("string"==typeof dirty)return window.toStaticHTML(dirty);if(_isNode(dirty))return window.toStaticHTML(dirty.outerHTML)}return dirty}if(SET_CONFIG||_parseConfig(cfg),DOMPurify.removed=[],"string"==typeof dirty&&(IN_PLACE=!1),IN_PLACE);else if(dirty instanceof Node)1===(importedNode=(body=_initDocument("\x3c!--\x3e")).ownerDocument.importNode(dirty,!0)).nodeType&&"BODY"===importedNode.nodeName||"HTML"===importedNode.nodeName?body=importedNode:body.appendChild(importedNode);else{if(!RETURN_DOM&&!SAFE_FOR_TEMPLATES&&!WHOLE_DOCUMENT&&RETURN_TRUSTED_TYPE&&-1===dirty.indexOf("<"))return trustedTypesPolicy?trustedTypesPolicy.createHTML(dirty):dirty;if(!(body=_initDocument(dirty)))return RETURN_DOM?null:emptyHTML}body&&FORCE_BODY&&_forceRemove(body.firstChild);for(var nodeIterator=_createIterator(IN_PLACE?dirty:body);currentNode=nodeIterator.nextNode();)3===currentNode.nodeType&&currentNode===oldNode||_sanitizeElements(currentNode)||(currentNode.content instanceof DocumentFragment&&_sanitizeShadowDOM(currentNode.content),_sanitizeAttributes(currentNode),oldNode=currentNode);if(oldNode=null,IN_PLACE)return dirty;if(RETURN_DOM){if(RETURN_DOM_FRAGMENT)for(returnNode=createDocumentFragment.call(body.ownerDocument);body.firstChild;)returnNode.appendChild(body.firstChild);else returnNode=body;return RETURN_DOM_IMPORT&&(returnNode=importNode.call(originalDocument,returnNode,!0)),returnNode}var serializedHTML=WHOLE_DOCUMENT?body.outerHTML:body.innerHTML;return SAFE_FOR_TEMPLATES&&(serializedHTML=stringReplace(serializedHTML,MUSTACHE_EXPR$$1," "),serializedHTML=stringReplace(serializedHTML,ERB_EXPR$$1," ")),trustedTypesPolicy&&RETURN_TRUSTED_TYPE?trustedTypesPolicy.createHTML(serializedHTML):serializedHTML},DOMPurify.setConfig=function(cfg){_parseConfig(cfg),SET_CONFIG=!0},DOMPurify.clearConfig=function(){CONFIG=null,SET_CONFIG=!1},DOMPurify.isValidAttribute=function(tag,attr,value){CONFIG||_parseConfig({});var lcTag=stringToLowerCase(tag),lcName=stringToLowerCase(attr);return _isValidAttribute(lcTag,lcName,value)},DOMPurify.addHook=function(entryPoint,hookFunction){"function"==typeof hookFunction&&(hooks[entryPoint]=hooks[entryPoint]||[],arrayPush(hooks[entryPoint],hookFunction))},DOMPurify.removeHook=function(entryPoint){hooks[entryPoint]&&arrayPop(hooks[entryPoint])},DOMPurify.removeHooks=function(entryPoint){hooks[entryPoint]&&(hooks[entryPoint]=[])},DOMPurify.removeAllHooks=function(){hooks={}},DOMPurify}()}()}}]);
//# sourceMappingURL=7.758be37f607736e2834e.bundle.js.map