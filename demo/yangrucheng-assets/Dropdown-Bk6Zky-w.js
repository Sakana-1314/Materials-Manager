import{p as Ie,B as ke,V as ze,a as Ke,r as _e,N as $e,c as ce}from"./Popover-jXc9v1DM.js";import{r as F,Q as ue,I as Oe,m as pe,a8 as De,z as re,d as D,l,ad as q,H,n as R,q as C,p as O,ba as fe,M as ie,t as he,v as G,x as ve,y as m,T as Ae,af as V,Y as me,A as L,ag as Te,bO as Be,Z as Fe,X as He,b7 as Me,ab as le,s as $,ah as je,a6 as ne,C as K,aK as B}from"./index-DwihmnM-.js";import{f as Le,u as We}from"./get-DOpsLziV.js";import{C as Ee}from"./ChevronRight-0aSDIZSO.js";import{h as ae,c as Ue}from"./create-C3AF4KAt.js";import{u as Ve}from"./use-keyboard-_xr1YiAi.js";function qe(e,n,d){const r=F(e.value);let t=null;return ue(e,o=>{t!==null&&window.clearTimeout(t),o===!0?d&&!d.value?r.value=!0:t=window.setTimeout(()=>{r.value=!0},n):r.value=!1}),r}function Ge(e){return n=>{n?e.value=n.$el:e.value=null}}const Xe={padding:"4px 0",optionIconSizeSmall:"14px",optionIconSizeMedium:"16px",optionIconSizeLarge:"16px",optionIconSizeHuge:"18px",optionSuffixWidthSmall:"14px",optionSuffixWidthMedium:"14px",optionSuffixWidthLarge:"16px",optionSuffixWidthHuge:"16px",optionIconSuffixWidthSmall:"32px",optionIconSuffixWidthMedium:"32px",optionIconSuffixWidthLarge:"36px",optionIconSuffixWidthHuge:"36px",optionPrefixWidthSmall:"14px",optionPrefixWidthMedium:"14px",optionPrefixWidthLarge:"16px",optionPrefixWidthHuge:"16px",optionIconPrefixWidthSmall:"36px",optionIconPrefixWidthMedium:"36px",optionIconPrefixWidthLarge:"40px",optionIconPrefixWidthHuge:"40px"};function Qe(e){const{primaryColor:n,textColor2:d,dividerColor:r,hoverColor:t,popoverColor:o,invertedColor:a,borderRadius:c,fontSizeSmall:f,fontSizeMedium:g,fontSizeLarge:w,fontSizeHuge:x,heightSmall:N,heightMedium:S,heightLarge:P,heightHuge:k,textColor3:y,opacityDisabled:I}=e;return Object.assign(Object.assign({},Xe),{optionHeightSmall:N,optionHeightMedium:S,optionHeightLarge:P,optionHeightHuge:k,borderRadius:c,fontSizeSmall:f,fontSizeMedium:g,fontSizeLarge:w,fontSizeHuge:x,optionTextColor:d,optionTextColorHover:d,optionTextColorActive:n,optionTextColorChildActive:n,color:o,dividerColor:r,suffixColor:d,prefixColor:d,optionColorHover:t,optionColorActive:De(n,{alpha:.1}),groupHeaderTextColor:y,optionTextColorInverted:"#BBB",optionTextColorHoverInverted:"#FFF",optionTextColorActiveInverted:"#FFF",optionTextColorChildActiveInverted:"#FFF",colorInverted:a,dividerColorInverted:"#BBB",suffixColorInverted:"#BBB",prefixColorInverted:"#BBB",optionColorHoverInverted:n,optionColorActiveInverted:n,groupHeaderTextColorInverted:"#AAA",optionOpacityDisabled:I})}const Ye=Oe({name:"Dropdown",common:pe,peers:{Popover:Ie},self:Qe}),de=re("n-dropdown-menu"),X=re("n-dropdown"),se=re("n-dropdown-option"),be=D({name:"DropdownDivider",props:{clsPrefix:{type:String,required:!0}},render(){return l("div",{class:`${this.clsPrefix}-dropdown-divider`})}}),Ze=D({name:"DropdownGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{showIconRef:e,hasSubmenuRef:n}=H(de),{renderLabelRef:d,labelFieldRef:r,nodePropsRef:t,renderOptionRef:o}=H(X);return{labelField:r,showIcon:e,hasSubmenu:n,renderLabel:d,nodeProps:t,renderOption:o}},render(){var e;const{clsPrefix:n,hasSubmenu:d,showIcon:r,nodeProps:t,renderLabel:o,renderOption:a}=this,{rawNode:c}=this.tmNode,f=l("div",Object.assign({class:`${n}-dropdown-option`},t?.(c)),l("div",{class:`${n}-dropdown-option-body ${n}-dropdown-option-body--group`},l("div",{"data-dropdown-option":!0,class:[`${n}-dropdown-option-body__prefix`,r&&`${n}-dropdown-option-body__prefix--show-icon`]},q(c.icon)),l("div",{class:`${n}-dropdown-option-body__label`,"data-dropdown-option":!0},o?o(c):q((e=c.title)!==null&&e!==void 0?e:c[this.labelField])),l("div",{class:[`${n}-dropdown-option-body__suffix`,d&&`${n}-dropdown-option-body__suffix--has-submenu`],"data-dropdown-option":!0})));return a?a({node:f,option:c}):f}});function Je(e){const{textColorBase:n,opacity1:d,opacity2:r,opacity3:t,opacity4:o,opacity5:a}=e;return{color:n,opacity1Depth:d,opacity2Depth:r,opacity3Depth:t,opacity4Depth:o,opacity5Depth:a}}const eo={common:pe,self:Je},oo=R("icon",`
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
`,[C("color-transition",{transition:"color .3s var(--n-bezier)"}),C("depth",{color:"var(--n-color)"},[O("svg",{opacity:"var(--n-opacity)",transition:"opacity .3s var(--n-bezier)"})]),O("svg",{height:"1em",width:"1em"})]),no=Object.assign(Object.assign({},G.props),{depth:[String,Number],size:[Number,String],color:String,component:[Object,Function]}),to=D({_n_icon__:!0,name:"Icon",inheritAttrs:!1,props:no,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:d}=he(e),r=G("Icon","-icon",oo,eo,e,n),t=m(()=>{const{depth:a}=e,{common:{cubicBezierEaseInOut:c},self:f}=r.value;if(a!==void 0){const{color:g,[`opacity${a}Depth`]:w}=f;return{"--n-bezier":c,"--n-color":g,"--n-opacity":w}}return{"--n-bezier":c,"--n-color":"","--n-opacity":""}}),o=d?ve("icon",m(()=>`${e.depth||"d"}`),t,e):void 0;return{mergedClsPrefix:n,mergedStyle:m(()=>{const{size:a,color:c}=e;return{fontSize:Le(a),color:c}}),cssVars:d?void 0:t,themeClass:o?.themeClass,onRender:o?.onRender}},render(){var e;const{$parent:n,depth:d,mergedClsPrefix:r,component:t,onRender:o,themeClass:a}=this;return!((e=n?.$options)===null||e===void 0)&&e._n_icon__&&fe("icon","don't wrap `n-icon` inside `n-icon`"),o?.(),l("i",ie(this.$attrs,{role:"img",class:[`${r}-icon`,a,{[`${r}-icon--depth`]:d,[`${r}-icon--color-transition`]:d!==void 0}],style:[this.cssVars,this.mergedStyle]}),t?l(t):this.$slots)}});function te(e,n){return e.type==="submenu"||e.type===void 0&&e[n]!==void 0}function ro(e){return e.type==="group"}function ge(e){return e.type==="divider"}function io(e){return e.type==="render"}const we=D({name:"DropdownOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0},parentKey:{type:[String,Number],default:null},placement:{type:String,default:"right-start"},props:Object,scrollable:Boolean},setup(e){const n=H(X),{hoverKeyRef:d,keyboardKeyRef:r,lastToggledSubmenuKeyRef:t,pendingKeyPathRef:o,activeKeyPathRef:a,animatedRef:c,mergedShowRef:f,renderLabelRef:g,renderIconRef:w,labelFieldRef:x,childrenFieldRef:N,renderOptionRef:S,nodePropsRef:P,menuPropsRef:k}=n,y=H(se,null),I=H(de),_=H(me),E=m(()=>e.tmNode.rawNode),W=m(()=>{const{value:i}=N;return te(e.tmNode.rawNode,i)}),Q=m(()=>{const{disabled:i}=e.tmNode;return i}),Y=m(()=>{if(!W.value)return!1;const{key:i,disabled:p}=e.tmNode;if(p)return!1;const{value:b}=d,{value:A}=r,{value:oe}=t,{value:T}=o;return b!==null?T.includes(i):A!==null?T.includes(i)&&T[T.length-1]!==i:oe!==null?T.includes(i):!1}),Z=m(()=>r.value===null&&!c.value),J=qe(Y,300,Z),ee=m(()=>!!y?.enteringSubmenuRef.value),M=F(!1);L(se,{enteringSubmenuRef:M});function j(){M.value=!0}function U(){M.value=!1}function z(){const{parentKey:i,tmNode:p}=e;p.disabled||f.value&&(t.value=i,r.value=null,d.value=p.key)}function s(){const{tmNode:i}=e;i.disabled||f.value&&d.value!==i.key&&z()}function u(i){if(e.tmNode.disabled||!f.value)return;const{relatedTarget:p}=i;p&&!ae({target:p},"dropdownOption")&&!ae({target:p},"scrollbarRail")&&(d.value=null)}function h(){const{value:i}=W,{tmNode:p}=e;f.value&&!i&&!p.disabled&&(n.doSelect(p.key,p.rawNode),n.doUpdateShow(!1))}return{labelField:x,renderLabel:g,renderIcon:w,siblingHasIcon:I.showIconRef,siblingHasSubmenu:I.hasSubmenuRef,menuProps:k,popoverBody:_,animated:c,mergedShowSubmenu:m(()=>J.value&&!ee.value),rawNode:E,hasSubmenu:W,pending:V(()=>{const{value:i}=o,{key:p}=e.tmNode;return i.includes(p)}),childActive:V(()=>{const{value:i}=a,{key:p}=e.tmNode,b=i.findIndex(A=>p===A);return b===-1?!1:b<i.length-1}),active:V(()=>{const{value:i}=a,{key:p}=e.tmNode,b=i.findIndex(A=>p===A);return b===-1?!1:b===i.length-1}),mergedDisabled:Q,renderOption:S,nodeProps:P,handleClick:h,handleMouseMove:s,handleMouseEnter:z,handleMouseLeave:u,handleSubmenuBeforeEnter:j,handleSubmenuAfterEnter:U}},render(){var e,n;const{animated:d,rawNode:r,mergedShowSubmenu:t,clsPrefix:o,siblingHasIcon:a,siblingHasSubmenu:c,renderLabel:f,renderIcon:g,renderOption:w,nodeProps:x,props:N,scrollable:S}=this;let P=null;if(t){const _=(e=this.menuProps)===null||e===void 0?void 0:e.call(this,r,r.children);P=l(ye,Object.assign({},_,{clsPrefix:o,scrollable:this.scrollable,tmNodes:this.tmNode.children,parentKey:this.tmNode.key}))}const k={class:[`${o}-dropdown-option-body`,this.pending&&`${o}-dropdown-option-body--pending`,this.active&&`${o}-dropdown-option-body--active`,this.childActive&&`${o}-dropdown-option-body--child-active`,this.mergedDisabled&&`${o}-dropdown-option-body--disabled`],onMousemove:this.handleMouseMove,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onClick:this.handleClick},y=x?.(r),I=l("div",Object.assign({class:[`${o}-dropdown-option`,y?.class],"data-dropdown-option":!0},y),l("div",ie(k,N),[l("div",{class:[`${o}-dropdown-option-body__prefix`,a&&`${o}-dropdown-option-body__prefix--show-icon`]},[g?g(r):q(r.icon)]),l("div",{"data-dropdown-option":!0,class:`${o}-dropdown-option-body__label`},f?f(r):q((n=r[this.labelField])!==null&&n!==void 0?n:r.title)),l("div",{"data-dropdown-option":!0,class:[`${o}-dropdown-option-body__suffix`,c&&`${o}-dropdown-option-body__suffix--has-submenu`]},this.hasSubmenu?l(to,null,{default:()=>l(Ee,null)}):null)]),this.hasSubmenu?l(ke,null,{default:()=>[l(ze,null,{default:()=>l("div",{class:`${o}-dropdown-offset-container`},l(Ke,{show:this.mergedShowSubmenu,placement:this.placement,to:S&&this.popoverBody||void 0,teleportDisabled:!S},{default:()=>l("div",{class:`${o}-dropdown-menu-wrapper`},d?l(Ae,{onBeforeEnter:this.handleSubmenuBeforeEnter,onAfterEnter:this.handleSubmenuAfterEnter,name:"fade-in-scale-up-transition",appear:!0},{default:()=>P}):P)}))})]}):null);return w?w({node:I,option:r}):I}}),lo=D({name:"NDropdownGroup",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0},parentKey:{type:[String,Number],default:null}},render(){const{tmNode:e,parentKey:n,clsPrefix:d}=this,{children:r}=e;return l(Te,null,l(Ze,{clsPrefix:d,tmNode:e,key:e.key}),r?.map(t=>{const{rawNode:o}=t;return o.show===!1?null:ge(o)?l(be,{clsPrefix:d,key:t.key}):t.isGroup?(fe("dropdown","`group` node is not allowed to be put in `group` node."),null):l(we,{clsPrefix:d,tmNode:t,parentKey:n,key:t.key})}))}}),ao=D({name:"DropdownRenderOption",props:{tmNode:{type:Object,required:!0}},render(){const{rawNode:{render:e,props:n}}=this.tmNode;return l("div",n,[e?.()])}}),ye=D({name:"DropdownMenu",props:{scrollable:Boolean,showArrow:Boolean,arrowStyle:[String,Object],clsPrefix:{type:String,required:!0},tmNodes:{type:Array,default:()=>[]},parentKey:{type:[String,Number],default:null}},setup(e){const{renderIconRef:n,childrenFieldRef:d}=H(X);L(de,{showIconRef:m(()=>{const t=n.value;return e.tmNodes.some(o=>{var a;if(o.isGroup)return(a=o.children)===null||a===void 0?void 0:a.some(({rawNode:f})=>t?t(f):f.icon);const{rawNode:c}=o;return t?t(c):c.icon})}),hasSubmenuRef:m(()=>{const{value:t}=d;return e.tmNodes.some(o=>{var a;if(o.isGroup)return(a=o.children)===null||a===void 0?void 0:a.some(({rawNode:f})=>te(f,t));const{rawNode:c}=o;return te(c,t)})})});const r=F(null);return L(Fe,null),L(He,null),L(me,r),{bodyRef:r}},render(){const{parentKey:e,clsPrefix:n,scrollable:d}=this,r=this.tmNodes.map(t=>{const{rawNode:o}=t;return o.show===!1?null:io(o)?l(ao,{tmNode:t,key:t.key}):ge(o)?l(be,{clsPrefix:n,key:t.key}):ro(o)?l(lo,{clsPrefix:n,tmNode:t,parentKey:e,key:t.key}):l(we,{clsPrefix:n,tmNode:t,parentKey:e,key:t.key,props:o.props,scrollable:d})});return l("div",{class:[`${n}-dropdown-menu`,d&&`${n}-dropdown-menu--scrollable`],ref:"bodyRef"},d?l(Be,{contentClass:`${n}-dropdown-menu__content`},{default:()=>r}):r,this.showArrow?_e({clsPrefix:n,arrowStyle:this.arrowStyle,arrowClass:void 0,arrowWrapperClass:void 0,arrowWrapperStyle:void 0}):null)}}),so=R("dropdown-menu",`
 transform-origin: var(--v-transform-origin);
 background-color: var(--n-color);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 position: relative;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`,[Me(),R("dropdown-option",`
 position: relative;
 `,[O("a",`
 text-decoration: none;
 color: inherit;
 outline: none;
 `,[O("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),R("dropdown-option-body",`
 display: flex;
 cursor: pointer;
 position: relative;
 height: var(--n-option-height);
 line-height: var(--n-option-height);
 font-size: var(--n-font-size);
 color: var(--n-option-text-color);
 transition: color .3s var(--n-bezier);
 `,[O("&::before",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 left: 4px;
 right: 4px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `),le("disabled",[C("pending",`
 color: var(--n-option-text-color-hover);
 `,[$("prefix, suffix",`
 color: var(--n-option-text-color-hover);
 `),O("&::before","background-color: var(--n-option-color-hover);")]),C("active",`
 color: var(--n-option-text-color-active);
 `,[$("prefix, suffix",`
 color: var(--n-option-text-color-active);
 `),O("&::before","background-color: var(--n-option-color-active);")]),C("child-active",`
 color: var(--n-option-text-color-child-active);
 `,[$("prefix, suffix",`
 color: var(--n-option-text-color-child-active);
 `)])]),C("disabled",`
 cursor: not-allowed;
 opacity: var(--n-option-opacity-disabled);
 `),C("group",`
 font-size: calc(var(--n-font-size) - 1px);
 color: var(--n-group-header-text-color);
 `,[$("prefix",`
 width: calc(var(--n-option-prefix-width) / 2);
 `,[C("show-icon",`
 width: calc(var(--n-option-icon-prefix-width) / 2);
 `)])]),$("prefix",`
 width: var(--n-option-prefix-width);
 display: flex;
 justify-content: center;
 align-items: center;
 color: var(--n-prefix-color);
 transition: color .3s var(--n-bezier);
 z-index: 1;
 `,[C("show-icon",`
 width: var(--n-option-icon-prefix-width);
 `),R("icon",`
 font-size: var(--n-option-icon-size);
 `)]),$("label",`
 white-space: nowrap;
 flex: 1;
 z-index: 1;
 `),$("suffix",`
 box-sizing: border-box;
 flex-grow: 0;
 flex-shrink: 0;
 display: flex;
 justify-content: flex-end;
 align-items: center;
 min-width: var(--n-option-suffix-width);
 padding: 0 8px;
 transition: color .3s var(--n-bezier);
 color: var(--n-suffix-color);
 z-index: 1;
 `,[C("has-submenu",`
 width: var(--n-option-icon-suffix-width);
 `),R("icon",`
 font-size: var(--n-option-icon-size);
 `)]),R("dropdown-menu","pointer-events: all;")]),R("dropdown-offset-container",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: -4px;
 bottom: -4px;
 `)]),R("dropdown-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 4px 0;
 `),R("dropdown-menu-wrapper",`
 transform-origin: var(--v-transform-origin);
 width: fit-content;
 `),O(">",[R("scrollbar",`
 height: inherit;
 max-height: inherit;
 `)]),le("scrollable",`
 padding: var(--n-padding);
 `),C("scrollable",[$("content",`
 padding: var(--n-padding);
 `)])]),co={animated:{type:Boolean,default:!0},keyboard:{type:Boolean,default:!0},size:String,inverted:Boolean,placement:{type:String,default:"bottom"},onSelect:[Function,Array],options:{type:Array,default:()=>[]},menuProps:Function,showArrow:Boolean,renderLabel:Function,renderIcon:Function,renderOption:Function,nodeProps:Function,labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},value:[String,Number]},uo=Object.keys(ce),po=Object.assign(Object.assign(Object.assign({},ce),co),G.props),wo=D({name:"Dropdown",inheritAttrs:!1,props:po,setup(e){const n=F(!1),d=We(K(e,"show"),n),r=m(()=>{const{keyField:s,childrenField:u}=e;return Ue(e.options,{getKey(h){return h[s]},getDisabled(h){return h.disabled===!0},getIgnored(h){return h.type==="divider"||h.type==="render"},getChildren(h){return h[u]}})}),t=m(()=>r.value.treeNodes),o=F(null),a=F(null),c=F(null),f=m(()=>{var s,u,h;return(h=(u=(s=o.value)!==null&&s!==void 0?s:a.value)!==null&&u!==void 0?u:c.value)!==null&&h!==void 0?h:null}),g=m(()=>r.value.getPath(f.value).keyPath),w=m(()=>r.value.getPath(e.value).keyPath),x=V(()=>e.keyboard&&d.value);Ve({keydown:{ArrowUp:{prevent:!0,handler:Z},ArrowRight:{prevent:!0,handler:Y},ArrowDown:{prevent:!0,handler:J},ArrowLeft:{prevent:!0,handler:Q},Enter:{prevent:!0,handler:ee},Escape:W}},x);const{mergedClsPrefixRef:N,inlineThemeDisabled:S,mergedComponentPropsRef:P}=he(e),k=m(()=>{var s,u;return e.size||((u=(s=P?.value)===null||s===void 0?void 0:s.Dropdown)===null||u===void 0?void 0:u.size)||"medium"}),y=G("Dropdown","-dropdown",so,Ye,e,N);L(X,{labelFieldRef:K(e,"labelField"),childrenFieldRef:K(e,"childrenField"),renderLabelRef:K(e,"renderLabel"),renderIconRef:K(e,"renderIcon"),hoverKeyRef:o,keyboardKeyRef:a,lastToggledSubmenuKeyRef:c,pendingKeyPathRef:g,activeKeyPathRef:w,animatedRef:K(e,"animated"),mergedShowRef:d,nodePropsRef:K(e,"nodeProps"),renderOptionRef:K(e,"renderOption"),menuPropsRef:K(e,"menuProps"),doSelect:I,doUpdateShow:_}),ue(d,s=>{!e.animated&&!s&&E()});function I(s,u){const{onSelect:h}=e;h&&ne(h,s,u)}function _(s){const{"onUpdate:show":u,onUpdateShow:h}=e;u&&ne(u,s),h&&ne(h,s),n.value=s}function E(){o.value=null,a.value=null,c.value=null}function W(){_(!1)}function Q(){j("left")}function Y(){j("right")}function Z(){j("up")}function J(){j("down")}function ee(){const s=M();s?.isLeaf&&d.value&&(I(s.key,s.rawNode),_(!1))}function M(){var s;const{value:u}=r,{value:h}=f;return!u||h===null?null:(s=u.getNode(h))!==null&&s!==void 0?s:null}function j(s){const{value:u}=f,{value:{getFirstAvailableNode:h}}=r;let i=null;if(u===null){const p=h();p!==null&&(i=p.key)}else{const p=M();if(p){let b;switch(s){case"down":b=p.getNext();break;case"up":b=p.getPrev();break;case"right":b=p.getChild();break;case"left":b=p.getParent();break}b&&(i=b.key)}}i!==null&&(o.value=null,a.value=i)}const U=m(()=>{const{inverted:s}=e,u=k.value,{common:{cubicBezierEaseInOut:h},self:i}=y.value,{padding:p,dividerColor:b,borderRadius:A,optionOpacityDisabled:oe,[B("optionIconSuffixWidth",u)]:T,[B("optionSuffixWidth",u)]:xe,[B("optionIconPrefixWidth",u)]:Se,[B("optionPrefixWidth",u)]:Pe,[B("fontSize",u)]:Re,[B("optionHeight",u)]:Ce,[B("optionIconSize",u)]:Ne}=i,v={"--n-bezier":h,"--n-font-size":Re,"--n-padding":p,"--n-border-radius":A,"--n-option-height":Ce,"--n-option-prefix-width":Pe,"--n-option-icon-prefix-width":Se,"--n-option-suffix-width":xe,"--n-option-icon-suffix-width":T,"--n-option-icon-size":Ne,"--n-divider-color":b,"--n-option-opacity-disabled":oe};return s?(v["--n-color"]=i.colorInverted,v["--n-option-color-hover"]=i.optionColorHoverInverted,v["--n-option-color-active"]=i.optionColorActiveInverted,v["--n-option-text-color"]=i.optionTextColorInverted,v["--n-option-text-color-hover"]=i.optionTextColorHoverInverted,v["--n-option-text-color-active"]=i.optionTextColorActiveInverted,v["--n-option-text-color-child-active"]=i.optionTextColorChildActiveInverted,v["--n-prefix-color"]=i.prefixColorInverted,v["--n-suffix-color"]=i.suffixColorInverted,v["--n-group-header-text-color"]=i.groupHeaderTextColorInverted):(v["--n-color"]=i.color,v["--n-option-color-hover"]=i.optionColorHover,v["--n-option-color-active"]=i.optionColorActive,v["--n-option-text-color"]=i.optionTextColor,v["--n-option-text-color-hover"]=i.optionTextColorHover,v["--n-option-text-color-active"]=i.optionTextColorActive,v["--n-option-text-color-child-active"]=i.optionTextColorChildActive,v["--n-prefix-color"]=i.prefixColor,v["--n-suffix-color"]=i.suffixColor,v["--n-group-header-text-color"]=i.groupHeaderTextColor),v}),z=S?ve("dropdown",m(()=>`${k.value[0]}${e.inverted?"i":""}`),U,e):void 0;return{mergedClsPrefix:N,mergedTheme:y,mergedSize:k,tmNodes:t,mergedShow:d,handleAfterLeave:()=>{e.animated&&E()},doUpdateShow:_,cssVars:S?void 0:U,themeClass:z?.themeClass,onRender:z?.onRender}},render(){const e=(r,t,o,a,c)=>{var f;const{mergedClsPrefix:g,menuProps:w}=this;(f=this.onRender)===null||f===void 0||f.call(this);const x=w?.(void 0,this.tmNodes.map(S=>S.rawNode))||{},N={ref:Ge(t),class:[r,`${g}-dropdown`,`${g}-dropdown--${this.mergedSize}-size`,this.themeClass],clsPrefix:g,tmNodes:this.tmNodes,style:[...o,this.cssVars],showArrow:this.showArrow,arrowStyle:this.arrowStyle,scrollable:this.scrollable,onMouseenter:a,onMouseleave:c};return l(ye,ie(this.$attrs,N,x))},{mergedTheme:n}=this,d={show:this.mergedShow,theme:n.peers.Popover,themeOverrides:n.peerOverrides.Popover,internalOnAfterLeave:this.handleAfterLeave,internalRenderBody:e,onUpdateShow:this.doUpdateShow,"onUpdate:show":void 0};return l($e,Object.assign({},je(this.$props,uo),d),{trigger:()=>{var r,t;return(t=(r=this.$slots).default)===null||t===void 0?void 0:t.call(r)}})}});export{wo as N,to as a,Ge as c,Ye as d};
