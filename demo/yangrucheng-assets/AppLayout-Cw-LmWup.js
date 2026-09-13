import{d as H,l as h,m as ge,n as p,p as v,q as R,s as g,t as re,v as X,x as ae,y as k,z as se,A as Q,C as te,r as F,D as no,E as Ho,F as Ro,G as Ao,H as Z,I as Ne,J as io,K as Pe,L as Mo,T as lo,M as ao,S as Le,N as Ge,O as Bo,P as fe,Q as so,R as $o,U as Oo,V as co,W as Po,X as To,Y as jo,Z as Eo,$ as be,a0 as No,a1 as Lo,a2 as Fo,a3 as Do,a4 as Vo,a5 as Uo,a6 as U,a7 as Xe,a8 as Re,a9 as uo,aa as ho,ab as ce,ac as Ko,ad as ie,ae as Fe,af as Te,ag as vo,ah as Ae,ai as Wo,aj as Yo,ak as Go,o as O,c as j,a as f,al as xe,am as mo,an as po,ao as Xo,ap as qo,aq as le,b as V,ar as pe,u as Qo,as as Zo,f as Y,w as G,at as de,au as ee,av as Jo,e as qe,aw as Me,ax as et,ay as Qe,az as ot,h as tt,aA as rt,g as nt,aB as it}from"./index-DwihmnM-.js";import{L as Ze}from"./branding-BKt-0tip.js";import{u as he,f as ue}from"./get-DOpsLziV.js";import{t as lt,N as at}from"./Tooltip-D5-bsdcQ.js";import{d as st,N as fo,a as Je}from"./Dropdown-Bk6Zky-w.js";import{V as ct,c as Be}from"./create-C3AF4KAt.js";import{u as dt}from"./use-compitable-B7BOEIuK.js";import{C as ut}from"./ChevronRight-0aSDIZSO.js";import{_ as ht}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./Popover-jXc9v1DM.js";import"./use-keyboard-_xr1YiAi.js";const vt=H({name:"ChevronDownFilled",render(){return h("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},h("path",{d:"M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z",fill:"currentColor"}))}}),mt={fontWeightActive:"400"};function pt(e){const{fontSize:t,textColor3:o,textColor2:r,borderRadius:a,buttonColor2Hover:n,buttonColor2Pressed:c}=e;return Object.assign(Object.assign({},mt),{fontSize:t,itemLineHeight:"1.25",itemTextColor:o,itemTextColorHover:r,itemTextColorPressed:r,itemTextColorActive:r,itemBorderRadius:a,itemColorHover:n,itemColorPressed:c,separatorColor:o})}const ft={common:ge,self:pt},gt=p("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[v("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),v("a",`
 color: inherit;
 text-decoration: inherit;
 `),p("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[p("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),v("&:not(:last-child)",[R("clickable",[g("link",`
 cursor: pointer;
 `,[v("&:hover",`
 background-color: var(--n-item-color-hover);
 `),v("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),g("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[v("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[p("icon",`
 color: var(--n-item-text-color-hover);
 `)]),v("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[p("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),g("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),v("&:last-child",[g("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[p("icon",`
 color: var(--n-item-text-color-active);
 `)]),g("separator",`
 display: none;
 `)])])]),go=se("n-breadcrumb"),bt=Object.assign(Object.assign({},X.props),{separator:{type:String,default:"/"}}),xt=H({name:"Breadcrumb",props:bt,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:o}=re(e),r=X("Breadcrumb","-breadcrumb",gt,ft,e,t);Q(go,{separatorRef:te(e,"separator"),mergedClsPrefixRef:t});const a=k(()=>{const{common:{cubicBezierEaseInOut:c},self:{separatorColor:s,itemTextColor:l,itemTextColorHover:u,itemTextColorPressed:b,itemTextColorActive:A,fontSize:x,fontWeightActive:y,itemBorderRadius:w,itemColorHover:_,itemColorPressed:$,itemLineHeight:P}}=r.value;return{"--n-font-size":x,"--n-bezier":c,"--n-item-text-color":l,"--n-item-text-color-hover":u,"--n-item-text-color-pressed":b,"--n-item-text-color-active":A,"--n-separator-color":s,"--n-item-color-hover":_,"--n-item-color-pressed":$,"--n-item-border-radius":w,"--n-font-weight-active":y,"--n-item-line-height":P}}),n=o?ae("breadcrumb",void 0,a,e):void 0;return{mergedClsPrefix:t,cssVars:o?void 0:a,themeClass:n?.themeClass,onRender:n?.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),h("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},h("ul",null,this.$slots))}});function wt(e=Ro?window:null){const t=()=>{const{hash:a,host:n,hostname:c,href:s,origin:l,pathname:u,port:b,protocol:A,search:x}=e?.location||{};return{hash:a,host:n,hostname:c,href:s,origin:l,pathname:u,port:b,protocol:A,search:x}},o=F(t()),r=()=>{o.value=t()};return no(()=>{e&&(e.addEventListener("popstate",r),e.addEventListener("hashchange",r))}),Ho(()=>{e&&(e.removeEventListener("popstate",r),e.removeEventListener("hashchange",r))}),o}const Ct={separator:String,href:String,clickable:{type:Boolean,default:!0},showSeparator:{type:Boolean,default:!0},onClick:Function},kt=H({name:"BreadcrumbItem",props:Ct,slots:Object,setup(e,{slots:t}){const o=Z(go,null);if(!o)return()=>null;const{separatorRef:r,mergedClsPrefixRef:a}=o,n=wt(),c=k(()=>e.href?"a":"span"),s=k(()=>n.value.href===e.href?"location":null);return()=>{const{value:l}=a;return h("li",{class:[`${l}-breadcrumb-item`,e.clickable&&`${l}-breadcrumb-item--clickable`]},h(c.value,{class:`${l}-breadcrumb-item__link`,"aria-current":s.value,href:e.href,onClick:e.onClick},t),e.showSeparator&&h("span",{class:`${l}-breadcrumb-item__separator`,"aria-hidden":"true"},Ao(t.separator,()=>{var u;return[(u=e.separator)!==null&&u!==void 0?u:r.value]})))}}});function yt(e){const{modalColor:t,textColor1:o,textColor2:r,boxShadow3:a,lineHeight:n,fontWeightStrong:c,dividerColor:s,closeColorHover:l,closeColorPressed:u,closeIconColor:b,closeIconColorHover:A,closeIconColorPressed:x,borderRadius:y,primaryColorHover:w}=e;return{bodyPadding:"16px 24px",borderRadius:y,headerPadding:"16px 24px",footerPadding:"16px 24px",color:t,textColor:r,titleTextColor:o,titleFontSize:"18px",titleFontWeight:c,boxShadow:a,lineHeight:n,headerBorderBottom:`1px solid ${s}`,footerBorderTop:`1px solid ${s}`,closeIconColor:b,closeIconColorHover:A,closeIconColorPressed:x,closeSize:"22px",closeIconSize:"18px",closeColorHover:l,closeColorPressed:u,closeBorderRadius:y,resizableTriggerColorHover:w}}const zt=Ne({name:"Drawer",common:ge,peers:{Scrollbar:io},self:yt}),It=H({name:"NDrawerContent",inheritAttrs:!1,props:{blockScroll:Boolean,show:{type:Boolean,default:void 0},displayDirective:{type:String,required:!0},placement:{type:String,required:!0},contentClass:String,contentStyle:[Object,String],nativeScrollbar:{type:Boolean,required:!0},scrollbarProps:Object,trapFocus:{type:Boolean,default:!0},autoFocus:{type:Boolean,default:!0},showMask:{type:[Boolean,String],required:!0},maxWidth:Number,maxHeight:Number,minWidth:Number,minHeight:Number,resizable:Boolean,onClickoutside:Function,onAfterLeave:Function,onAfterEnter:Function,onEsc:Function},setup(e){const t=F(!!e.show),o=F(null),r=Z(co);let a=0,n="",c=null;const s=F(!1),l=F(!1),u=k(()=>e.placement==="top"||e.placement==="bottom"),{mergedClsPrefixRef:b,mergedRtlRef:A}=re(e),x=Bo("Drawer",A,b),y=m,w=I=>{l.value=!0,a=u.value?I.clientY:I.clientX,n=document.body.style.cursor,document.body.style.cursor=u.value?"ns-resize":"ew-resize",document.body.addEventListener("mousemove",B),document.body.addEventListener("mouseleave",y),document.body.addEventListener("mouseup",m)},_=()=>{c!==null&&(window.clearTimeout(c),c=null),l.value?s.value=!0:c=window.setTimeout(()=>{s.value=!0},300)},$=()=>{c!==null&&(window.clearTimeout(c),c=null),s.value=!1},{doUpdateHeight:P,doUpdateWidth:q}=r,K=I=>{const{maxWidth:L}=e;if(L&&I>L)return L;const{minWidth:T}=e;return T&&I<T?T:I},D=I=>{const{maxHeight:L}=e;if(L&&I>L)return L;const{minHeight:T}=e;return T&&I<T?T:I};function B(I){var L,T;if(l.value)if(u.value){let W=((L=o.value)===null||L===void 0?void 0:L.offsetHeight)||0;const J=a-I.clientY;W+=e.placement==="bottom"?J:-J,W=D(W),P(W),a=I.clientY}else{let W=((T=o.value)===null||T===void 0?void 0:T.offsetWidth)||0;const J=a-I.clientX;W+=e.placement==="right"?J:-J,W=K(W),q(W),a=I.clientX}}function m(){l.value&&(a=0,l.value=!1,document.body.style.cursor=n,document.body.removeEventListener("mousemove",B),document.body.removeEventListener("mouseup",m),document.body.removeEventListener("mouseleave",y))}fe(()=>{e.show&&(t.value=!0)}),so(()=>e.show,I=>{I||m()}),$o(()=>{m()});const C=k(()=>{const{show:I}=e,L=[[Ge,I]];return e.showMask||L.push([Po,e.onClickoutside,void 0,{capture:!0}]),L});function E(){var I;t.value=!1,(I=e.onAfterLeave)===null||I===void 0||I.call(e)}return Oo(k(()=>e.blockScroll&&t.value)),Q(To,o),Q(jo,null),Q(Eo,null),{bodyRef:o,rtlEnabled:x,mergedClsPrefix:r.mergedClsPrefixRef,isMounted:r.isMountedRef,mergedTheme:r.mergedThemeRef,displayed:t,transitionName:k(()=>({right:"slide-in-from-right-transition",left:"slide-in-from-left-transition",top:"slide-in-from-top-transition",bottom:"slide-in-from-bottom-transition"})[e.placement]),handleAfterLeave:E,bodyDirectives:C,handleMousedownResizeTrigger:w,handleMouseenterResizeTrigger:_,handleMouseleaveResizeTrigger:$,isDragging:l,isHoverOnResizeTrigger:s}},render(){const{$slots:e,mergedClsPrefix:t}=this;return this.displayDirective==="show"||this.displayed||this.show?Pe(h("div",{role:"none"},h(Mo,{disabled:!this.showMask||!this.trapFocus,active:this.show,autoFocus:this.autoFocus,onEsc:this.onEsc},{default:()=>h(lo,{name:this.transitionName,appear:this.isMounted,onAfterEnter:this.onAfterEnter,onAfterLeave:this.handleAfterLeave},{default:()=>Pe(h("div",ao(this.$attrs,{role:"dialog",ref:"bodyRef","aria-modal":"true",class:[`${t}-drawer`,this.rtlEnabled&&`${t}-drawer--rtl`,`${t}-drawer--${this.placement}-placement`,this.isDragging&&`${t}-drawer--unselectable`,this.nativeScrollbar&&`${t}-drawer--native-scrollbar`]}),[this.resizable?h("div",{class:[`${t}-drawer__resize-trigger`,(this.isDragging||this.isHoverOnResizeTrigger)&&`${t}-drawer__resize-trigger--hover`],onMouseenter:this.handleMouseenterResizeTrigger,onMouseleave:this.handleMouseleaveResizeTrigger,onMousedown:this.handleMousedownResizeTrigger}):null,this.nativeScrollbar?h("div",{class:[`${t}-drawer-content-wrapper`,this.contentClass],style:this.contentStyle,role:"none"},e):h(Le,Object.assign({},this.scrollbarProps,{contentStyle:this.contentStyle,contentClass:[`${t}-drawer-content-wrapper`,this.contentClass],theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar}),e)]),this.bodyDirectives)})})),[[Ge,this.displayDirective==="if"||this.displayed||this.show]]):null}}),{cubicBezierEaseIn:St,cubicBezierEaseOut:_t}=be;function Ht({duration:e="0.3s",leaveDuration:t="0.2s",name:o="slide-in-from-bottom"}={}){return[v(`&.${o}-transition-leave-active`,{transition:`transform ${t} ${St}`}),v(`&.${o}-transition-enter-active`,{transition:`transform ${e} ${_t}`}),v(`&.${o}-transition-enter-to`,{transform:"translateY(0)"}),v(`&.${o}-transition-enter-from`,{transform:"translateY(100%)"}),v(`&.${o}-transition-leave-from`,{transform:"translateY(0)"}),v(`&.${o}-transition-leave-to`,{transform:"translateY(100%)"})]}const{cubicBezierEaseIn:Rt,cubicBezierEaseOut:At}=be;function Mt({duration:e="0.3s",leaveDuration:t="0.2s",name:o="slide-in-from-left"}={}){return[v(`&.${o}-transition-leave-active`,{transition:`transform ${t} ${Rt}`}),v(`&.${o}-transition-enter-active`,{transition:`transform ${e} ${At}`}),v(`&.${o}-transition-enter-to`,{transform:"translateX(0)"}),v(`&.${o}-transition-enter-from`,{transform:"translateX(-100%)"}),v(`&.${o}-transition-leave-from`,{transform:"translateX(0)"}),v(`&.${o}-transition-leave-to`,{transform:"translateX(-100%)"})]}const{cubicBezierEaseIn:Bt,cubicBezierEaseOut:$t}=be;function Ot({duration:e="0.3s",leaveDuration:t="0.2s",name:o="slide-in-from-right"}={}){return[v(`&.${o}-transition-leave-active`,{transition:`transform ${t} ${Bt}`}),v(`&.${o}-transition-enter-active`,{transition:`transform ${e} ${$t}`}),v(`&.${o}-transition-enter-to`,{transform:"translateX(0)"}),v(`&.${o}-transition-enter-from`,{transform:"translateX(100%)"}),v(`&.${o}-transition-leave-from`,{transform:"translateX(0)"}),v(`&.${o}-transition-leave-to`,{transform:"translateX(100%)"})]}const{cubicBezierEaseIn:Pt,cubicBezierEaseOut:Tt}=be;function jt({duration:e="0.3s",leaveDuration:t="0.2s",name:o="slide-in-from-top"}={}){return[v(`&.${o}-transition-leave-active`,{transition:`transform ${t} ${Pt}`}),v(`&.${o}-transition-enter-active`,{transition:`transform ${e} ${Tt}`}),v(`&.${o}-transition-enter-to`,{transform:"translateY(0)"}),v(`&.${o}-transition-enter-from`,{transform:"translateY(-100%)"}),v(`&.${o}-transition-leave-from`,{transform:"translateY(0)"}),v(`&.${o}-transition-leave-to`,{transform:"translateY(-100%)"})]}const Et=v([p("drawer",`
 word-break: break-word;
 line-height: var(--n-line-height);
 position: absolute;
 pointer-events: all;
 box-shadow: var(--n-box-shadow);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background-color: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 `,[Ot(),Mt(),jt(),Ht(),R("unselectable",`
 user-select: none; 
 -webkit-user-select: none;
 `),R("native-scrollbar",[p("drawer-content-wrapper",`
 overflow: auto;
 height: 100%;
 `)]),g("resize-trigger",`
 position: absolute;
 background-color: #0000;
 transition: background-color .3s var(--n-bezier);
 `,[R("hover",`
 background-color: var(--n-resize-trigger-color-hover);
 `)]),p("drawer-content-wrapper",`
 box-sizing: border-box;
 `),p("drawer-content",`
 height: 100%;
 display: flex;
 flex-direction: column;
 `,[R("native-scrollbar",[p("drawer-body-content-wrapper",`
 height: 100%;
 overflow: auto;
 `)]),p("drawer-body",`
 flex: 1 0 0;
 overflow: hidden;
 `),p("drawer-body-content-wrapper",`
 box-sizing: border-box;
 padding: var(--n-body-padding);
 `),p("drawer-header",`
 font-weight: var(--n-title-font-weight);
 line-height: 1;
 font-size: var(--n-title-font-size);
 color: var(--n-title-text-color);
 padding: var(--n-header-padding);
 transition: border .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-divider-color);
 border-bottom: var(--n-header-border-bottom);
 display: flex;
 justify-content: space-between;
 align-items: center;
 `,[g("main",`
 flex: 1;
 `),g("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),p("drawer-footer",`
 display: flex;
 justify-content: flex-end;
 border-top: var(--n-footer-border-top);
 transition: border .3s var(--n-bezier);
 padding: var(--n-footer-padding);
 `)]),R("right-placement",`
 top: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-bottom-left-radius: var(--n-border-radius);
 `,[g("resize-trigger",`
 width: 3px;
 height: 100%;
 top: 0;
 left: 0;
 transform: translateX(-1.5px);
 cursor: ew-resize;
 `)]),R("left-placement",`
 top: 0;
 bottom: 0;
 left: 0;
 border-top-right-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `,[g("resize-trigger",`
 width: 3px;
 height: 100%;
 top: 0;
 right: 0;
 transform: translateX(1.5px);
 cursor: ew-resize;
 `)]),R("top-placement",`
 top: 0;
 left: 0;
 right: 0;
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `,[g("resize-trigger",`
 width: 100%;
 height: 3px;
 bottom: 0;
 left: 0;
 transform: translateY(1.5px);
 cursor: ns-resize;
 `)]),R("bottom-placement",`
 left: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-top-right-radius: var(--n-border-radius);
 `,[g("resize-trigger",`
 width: 100%;
 height: 3px;
 top: 0;
 left: 0;
 transform: translateY(-1.5px);
 cursor: ns-resize;
 `)])]),v("body",[v(">",[p("drawer-container",`
 position: fixed;
 `)])]),p("drawer-container",`
 position: relative;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 `,[v("> *",`
 pointer-events: all;
 `)]),p("drawer-mask",`
 background-color: rgba(0, 0, 0, .3);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[R("invisible",`
 background-color: rgba(0, 0, 0, 0)
 `),No({enterDuration:"0.2s",leaveDuration:"0.2s",enterCubicBezier:"var(--n-bezier-in)",leaveCubicBezier:"var(--n-bezier-out)"})])]),Nt=Object.assign(Object.assign({},X.props),{show:Boolean,width:[Number,String],height:[Number,String],placement:{type:String,default:"right"},maskClosable:{type:Boolean,default:!0},showMask:{type:[Boolean,String],default:!0},to:[String,Object],displayDirective:{type:String,default:"if"},nativeScrollbar:{type:Boolean,default:!0},zIndex:Number,onMaskClick:Function,scrollbarProps:Object,contentClass:String,contentStyle:[Object,String],trapFocus:{type:Boolean,default:!0},onEsc:Function,autoFocus:{type:Boolean,default:!0},closeOnEsc:{type:Boolean,default:!0},blockScroll:{type:Boolean,default:!0},maxWidth:Number,maxHeight:Number,minWidth:Number,minHeight:Number,resizable:Boolean,defaultWidth:{type:[Number,String],default:251},defaultHeight:{type:[Number,String],default:251},onUpdateWidth:[Function,Array],onUpdateHeight:[Function,Array],"onUpdate:width":[Function,Array],"onUpdate:height":[Function,Array],"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,drawerStyle:[String,Object],drawerClass:String,target:null,onShow:Function,onHide:Function}),Lt=H({name:"Drawer",inheritAttrs:!1,props:Nt,setup(e){const{mergedClsPrefixRef:t,namespaceRef:o,inlineThemeDisabled:r}=re(e),a=Fo(),n=X("Drawer","-drawer",Et,zt,e,t),c=F(e.defaultWidth),s=F(e.defaultHeight),l=he(te(e,"width"),c),u=he(te(e,"height"),s),b=k(()=>{const{placement:m}=e;return m==="top"||m==="bottom"?"":ue(l.value)}),A=k(()=>{const{placement:m}=e;return m==="left"||m==="right"?"":ue(u.value)}),x=m=>{const{onUpdateWidth:C,"onUpdate:width":E}=e;C&&U(C,m),E&&U(E,m),c.value=m},y=m=>{const{onUpdateHeight:C,"onUpdate:width":E}=e;C&&U(C,m),E&&U(E,m),s.value=m},w=k(()=>[{width:b.value,height:A.value},e.drawerStyle||""]);function _(m){const{onMaskClick:C,maskClosable:E}=e;E&&K(!1),C&&C(m)}function $(m){_(m)}const P=Do();function q(m){var C;(C=e.onEsc)===null||C===void 0||C.call(e),e.show&&e.closeOnEsc&&Uo(m)&&(P.value||K(!1))}function K(m){const{onHide:C,onUpdateShow:E,"onUpdate:show":I}=e;E&&U(E,m),I&&U(I,m),C&&!m&&U(C,m)}Q(co,{isMountedRef:a,mergedThemeRef:n,mergedClsPrefixRef:t,doUpdateShow:K,doUpdateHeight:y,doUpdateWidth:x});const D=k(()=>{const{common:{cubicBezierEaseInOut:m,cubicBezierEaseIn:C,cubicBezierEaseOut:E},self:{color:I,textColor:L,boxShadow:T,lineHeight:W,headerPadding:J,footerPadding:ne,borderRadius:we,bodyPadding:Ce,titleFontSize:ke,titleTextColor:ye,titleFontWeight:ze,headerBorderBottom:Ie,footerBorderTop:z,closeIconColor:M,closeIconColorHover:i,closeIconColorPressed:S,closeColorHover:N,closeColorPressed:Se,closeIconSize:_e,closeSize:He,closeBorderRadius:d,resizableTriggerColorHover:_o}}=n.value;return{"--n-line-height":W,"--n-color":I,"--n-border-radius":we,"--n-text-color":L,"--n-box-shadow":T,"--n-bezier":m,"--n-bezier-out":E,"--n-bezier-in":C,"--n-header-padding":J,"--n-body-padding":Ce,"--n-footer-padding":ne,"--n-title-text-color":ye,"--n-title-font-size":ke,"--n-title-font-weight":ze,"--n-header-border-bottom":Ie,"--n-footer-border-top":z,"--n-close-icon-color":M,"--n-close-icon-color-hover":i,"--n-close-icon-color-pressed":S,"--n-close-size":He,"--n-close-color-hover":N,"--n-close-color-pressed":Se,"--n-close-icon-size":_e,"--n-close-border-radius":d,"--n-resize-trigger-color-hover":_o}}),B=r?ae("drawer",void 0,D,e):void 0;return{mergedClsPrefix:t,namespace:o,mergedBodyStyle:w,handleOutsideClick:$,handleMaskClick:_,handleEsc:q,mergedTheme:n,cssVars:r?void 0:D,themeClass:B?.themeClass,onRender:B?.onRender,isMounted:a}},render(){const{mergedClsPrefix:e}=this;return h(Lo,{to:this.to,show:this.show},{default:()=>{var t;return(t=this.onRender)===null||t===void 0||t.call(this),Pe(h("div",{class:[`${e}-drawer-container`,this.namespace,this.themeClass],style:this.cssVars,role:"none"},this.showMask?h(lo,{name:"fade-in-transition",appear:this.isMounted},{default:()=>this.show?h("div",{"aria-hidden":!0,class:[`${e}-drawer-mask`,this.showMask==="transparent"&&`${e}-drawer-mask--invisible`],onClick:this.handleMaskClick}):null}):null,h(It,Object.assign({},this.$attrs,{class:[this.drawerClass,this.$attrs.class],style:[this.mergedBodyStyle,this.$attrs.style],blockScroll:this.blockScroll,contentStyle:this.contentStyle,contentClass:this.contentClass,placement:this.placement,scrollbarProps:this.scrollbarProps,show:this.show,displayDirective:this.displayDirective,nativeScrollbar:this.nativeScrollbar,onAfterEnter:this.onAfterEnter,onAfterLeave:this.onAfterLeave,trapFocus:this.trapFocus,autoFocus:this.autoFocus,resizable:this.resizable,maxHeight:this.maxHeight,minHeight:this.minHeight,maxWidth:this.maxWidth,minWidth:this.minWidth,showMask:this.showMask,onEsc:this.handleEsc,onClickoutside:this.handleOutsideClick}),this.$slots)),[[Vo,{zIndex:this.zIndex,enabled:this.show}]])}})}});function Ft(e){const{baseColor:t,textColor2:o,bodyColor:r,cardColor:a,dividerColor:n,actionColor:c,scrollbarColor:s,scrollbarColorHover:l,invertedColor:u}=e;return{textColor:o,textColorInverted:"#FFF",color:r,colorEmbedded:c,headerColor:a,headerColorInverted:u,footerColor:c,footerColorInverted:u,headerBorderColor:n,headerBorderColorInverted:u,footerBorderColor:n,footerBorderColorInverted:u,siderBorderColor:n,siderBorderColorInverted:u,siderColor:a,siderColorInverted:u,siderToggleButtonBorder:`1px solid ${n}`,siderToggleButtonColor:t,siderToggleButtonIconColor:o,siderToggleButtonIconColorInverted:o,siderToggleBarColor:Xe(r,s),siderToggleBarColorHover:Xe(r,l),__invertScrollbar:"true"}}const De=Ne({name:"Layout",common:ge,peers:{Scrollbar:io},self:Ft});function Dt(e,t,o,r){return{itemColorHoverInverted:"#0000",itemColorActiveInverted:t,itemColorActiveHoverInverted:t,itemColorActiveCollapsedInverted:t,itemTextColorInverted:e,itemTextColorHoverInverted:o,itemTextColorChildActiveInverted:o,itemTextColorChildActiveHoverInverted:o,itemTextColorActiveInverted:o,itemTextColorActiveHoverInverted:o,itemTextColorHorizontalInverted:e,itemTextColorHoverHorizontalInverted:o,itemTextColorChildActiveHorizontalInverted:o,itemTextColorChildActiveHoverHorizontalInverted:o,itemTextColorActiveHorizontalInverted:o,itemTextColorActiveHoverHorizontalInverted:o,itemIconColorInverted:e,itemIconColorHoverInverted:o,itemIconColorActiveInverted:o,itemIconColorActiveHoverInverted:o,itemIconColorChildActiveInverted:o,itemIconColorChildActiveHoverInverted:o,itemIconColorCollapsedInverted:e,itemIconColorHorizontalInverted:e,itemIconColorHoverHorizontalInverted:o,itemIconColorActiveHorizontalInverted:o,itemIconColorActiveHoverHorizontalInverted:o,itemIconColorChildActiveHorizontalInverted:o,itemIconColorChildActiveHoverHorizontalInverted:o,arrowColorInverted:e,arrowColorHoverInverted:o,arrowColorActiveInverted:o,arrowColorActiveHoverInverted:o,arrowColorChildActiveInverted:o,arrowColorChildActiveHoverInverted:o,groupTextColorInverted:r}}function Vt(e){const{borderRadius:t,textColor3:o,primaryColor:r,textColor2:a,textColor1:n,fontSize:c,dividerColor:s,hoverColor:l,primaryColorHover:u}=e;return Object.assign({borderRadius:t,color:"#0000",groupTextColor:o,itemColorHover:l,itemColorActive:Re(r,{alpha:.1}),itemColorActiveHover:Re(r,{alpha:.1}),itemColorActiveCollapsed:Re(r,{alpha:.1}),itemTextColor:a,itemTextColorHover:a,itemTextColorActive:r,itemTextColorActiveHover:r,itemTextColorChildActive:r,itemTextColorChildActiveHover:r,itemTextColorHorizontal:a,itemTextColorHoverHorizontal:u,itemTextColorActiveHorizontal:r,itemTextColorActiveHoverHorizontal:r,itemTextColorChildActiveHorizontal:r,itemTextColorChildActiveHoverHorizontal:r,itemIconColor:n,itemIconColorHover:n,itemIconColorActive:r,itemIconColorActiveHover:r,itemIconColorChildActive:r,itemIconColorChildActiveHover:r,itemIconColorCollapsed:n,itemIconColorHorizontal:n,itemIconColorHoverHorizontal:u,itemIconColorActiveHorizontal:r,itemIconColorActiveHoverHorizontal:r,itemIconColorChildActiveHorizontal:r,itemIconColorChildActiveHoverHorizontal:r,itemHeight:"42px",arrowColor:a,arrowColorHover:a,arrowColorActive:r,arrowColorActiveHover:r,arrowColorChildActive:r,arrowColorChildActiveHover:r,colorInverted:"#0000",borderColorHorizontal:"#0000",fontSize:c,dividerColor:s},Dt("#BBB",r,"#FFF","#AAA"))}const Ut=Ne({name:"Menu",common:ge,peers:{Tooltip:lt,Dropdown:st},self:Vt}),bo=se("n-layout-sider"),Ve={type:String,default:"static"},Kt=p("layout",`
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[p("layout-scroll-container",`
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `),R("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),Wt={embedded:Boolean,position:Ve,nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,onScroll:Function,contentClass:String,contentStyle:{type:[String,Object],default:""},hasSider:Boolean,siderPlacement:{type:String,default:"left"}},xo=se("n-layout");function wo(e){return H({name:e?"LayoutContent":"Layout",props:Object.assign(Object.assign({},X.props),Wt),setup(t){const o=F(null),r=F(null),{mergedClsPrefixRef:a,inlineThemeDisabled:n}=re(t),c=X("Layout","-layout",Kt,De,t,a);function s(_,$){if(t.nativeScrollbar){const{value:P}=o;P&&($===void 0?P.scrollTo(_):P.scrollTo(_,$))}else{const{value:P}=r;P&&P.scrollTo(_,$)}}Q(xo,t);let l=0,u=0;const b=_=>{var $;const P=_.target;l=P.scrollLeft,u=P.scrollTop,($=t.onScroll)===null||$===void 0||$.call(t,_)};uo(()=>{if(t.nativeScrollbar){const _=o.value;_&&(_.scrollTop=u,_.scrollLeft=l)}});const A={display:"flex",flexWrap:"nowrap",width:"100%",flexDirection:"row"},x={scrollTo:s},y=k(()=>{const{common:{cubicBezierEaseInOut:_},self:$}=c.value;return{"--n-bezier":_,"--n-color":t.embedded?$.colorEmbedded:$.color,"--n-text-color":$.textColor}}),w=n?ae("layout",k(()=>t.embedded?"e":""),y,t):void 0;return Object.assign({mergedClsPrefix:a,scrollableElRef:o,scrollbarInstRef:r,hasSiderStyle:A,mergedTheme:c,handleNativeElScroll:b,cssVars:n?void 0:y,themeClass:w?.themeClass,onRender:w?.onRender},x)},render(){var t;const{mergedClsPrefix:o,hasSider:r}=this;(t=this.onRender)===null||t===void 0||t.call(this);const a=r?this.hasSiderStyle:void 0,n=[this.themeClass,e&&`${o}-layout-content`,`${o}-layout`,`${o}-layout--${this.position}-positioned`];return h("div",{class:n,style:this.cssVars},this.nativeScrollbar?h("div",{ref:"scrollableElRef",class:[`${o}-layout-scroll-container`,this.contentClass],style:[this.contentStyle,a],onScroll:this.handleNativeElScroll},this.$slots):h(Le,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentClass:this.contentClass,contentStyle:[this.contentStyle,a]}),this.$slots))}})}const Yt=wo(!1),Gt=wo(!0),Xt=p("layout-header",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 box-sizing: border-box;
 width: 100%;
 background-color: var(--n-color);
 color: var(--n-text-color);
`,[R("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 `),R("bordered",`
 border-bottom: solid 1px var(--n-border-color);
 `)]),qt={position:Ve,inverted:Boolean,bordered:{type:Boolean,default:!1}},Qt=H({name:"LayoutHeader",props:Object.assign(Object.assign({},X.props),qt),setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:o}=re(e),r=X("Layout","-layout-header",Xt,De,e,t),a=k(()=>{const{common:{cubicBezierEaseInOut:c},self:s}=r.value,l={"--n-bezier":c};return e.inverted?(l["--n-color"]=s.headerColorInverted,l["--n-text-color"]=s.textColorInverted,l["--n-border-color"]=s.headerBorderColorInverted):(l["--n-color"]=s.headerColor,l["--n-text-color"]=s.textColor,l["--n-border-color"]=s.headerBorderColor),l}),n=o?ae("layout-header",k(()=>e.inverted?"a":"b"),a,e):void 0;return{mergedClsPrefix:t,cssVars:o?void 0:a,themeClass:n?.themeClass,onRender:n?.onRender}},render(){var e;const{mergedClsPrefix:t}=this;return(e=this.onRender)===null||e===void 0||e.call(this),h("div",{class:[`${t}-layout-header`,this.themeClass,this.position&&`${t}-layout-header--${this.position}-positioned`,this.bordered&&`${t}-layout-header--bordered`],style:this.cssVars},this.$slots)}}),Zt=p("layout-sider",`
 flex-shrink: 0;
 box-sizing: border-box;
 position: relative;
 z-index: 1;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 min-width .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: flex;
 justify-content: flex-end;
`,[R("bordered",[g("border",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]),g("left-placement",[R("bordered",[g("border",`
 right: 0;
 `)])]),R("right-placement",`
 justify-content: flex-start;
 `,[R("bordered",[g("border",`
 left: 0;
 `)]),R("collapsed",[p("layout-toggle-button",[p("base-icon",`
 transform: rotate(180deg);
 `)]),p("layout-toggle-bar",[v("&:hover",[g("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])])]),p("layout-toggle-button",`
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `,[p("base-icon",`
 transform: rotate(0);
 `)]),p("layout-toggle-bar",`
 left: -28px;
 transform: rotate(180deg);
 `,[v("&:hover",[g("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})])])]),R("collapsed",[p("layout-toggle-bar",[v("&:hover",[g("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])]),p("layout-toggle-button",[p("base-icon",`
 transform: rotate(0);
 `)])]),p("layout-toggle-button",`
 transition:
 color .3s var(--n-bezier),
 right .3s var(--n-bezier),
 left .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 cursor: pointer;
 width: 24px;
 height: 24px;
 position: absolute;
 top: 50%;
 right: 0;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 18px;
 color: var(--n-toggle-button-icon-color);
 border: var(--n-toggle-button-border);
 background-color: var(--n-toggle-button-color);
 box-shadow: 0 2px 4px 0px rgba(0, 0, 0, .06);
 transform: translateX(50%) translateY(-50%);
 z-index: 1;
 `,[p("base-icon",`
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]),p("layout-toggle-bar",`
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `,[g("top, bottom",`
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),g("bottom",`
 position: absolute;
 top: 34px;
 `),v("&:hover",[g("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})]),g("top, bottom",{backgroundColor:"var(--n-toggle-bar-color)"}),v("&:hover",[g("top, bottom",{backgroundColor:"var(--n-toggle-bar-color-hover)"})])]),g("border",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `),p("layout-sider-scroll-container",`
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `),R("show-content",[p("layout-sider-scroll-container",{opacity:1})]),R("absolute-positioned",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]),Jt=H({props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return h("div",{onClick:this.onClick,class:`${e}-layout-toggle-bar`},h("div",{class:`${e}-layout-toggle-bar__top`}),h("div",{class:`${e}-layout-toggle-bar__bottom`}))}}),er=H({name:"LayoutToggleButton",props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return h("div",{class:`${e}-layout-toggle-button`,onClick:this.onClick},h(ho,{clsPrefix:e},{default:()=>h(ut,null)}))}}),or={position:Ve,bordered:Boolean,collapsedWidth:{type:Number,default:48},width:{type:[Number,String],default:272},contentClass:String,contentStyle:{type:[String,Object],default:""},collapseMode:{type:String,default:"transform"},collapsed:{type:Boolean,default:void 0},defaultCollapsed:Boolean,showCollapsedContent:{type:Boolean,default:!0},showTrigger:{type:[Boolean,String],default:!1},nativeScrollbar:{type:Boolean,default:!0},inverted:Boolean,scrollbarProps:Object,triggerClass:String,triggerStyle:[String,Object],collapsedTriggerClass:String,collapsedTriggerStyle:[String,Object],"onUpdate:collapsed":[Function,Array],onUpdateCollapsed:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,onExpand:[Function,Array],onCollapse:[Function,Array],onScroll:Function},tr=H({name:"LayoutSider",props:Object.assign(Object.assign({},X.props),or),setup(e){const t=Z(xo),o=F(null),r=F(null),a=F(e.defaultCollapsed),n=he(te(e,"collapsed"),a),c=k(()=>ue(n.value?e.collapsedWidth:e.width)),s=k(()=>e.collapseMode!=="transform"?{}:{minWidth:ue(e.width)}),l=k(()=>t?t.siderPlacement:"left");function u(B,m){if(e.nativeScrollbar){const{value:C}=o;C&&(m===void 0?C.scrollTo(B):C.scrollTo(B,m))}else{const{value:C}=r;C&&C.scrollTo(B,m)}}function b(){const{"onUpdate:collapsed":B,onUpdateCollapsed:m,onExpand:C,onCollapse:E}=e,{value:I}=n;m&&U(m,!I),B&&U(B,!I),a.value=!I,I?C&&U(C):E&&U(E)}let A=0,x=0;const y=B=>{var m;const C=B.target;A=C.scrollLeft,x=C.scrollTop,(m=e.onScroll)===null||m===void 0||m.call(e,B)};uo(()=>{if(e.nativeScrollbar){const B=o.value;B&&(B.scrollTop=x,B.scrollLeft=A)}}),Q(bo,{collapsedRef:n,collapseModeRef:te(e,"collapseMode")});const{mergedClsPrefixRef:w,inlineThemeDisabled:_}=re(e),$=X("Layout","-layout-sider",Zt,De,e,w);function P(B){var m,C;B.propertyName==="max-width"&&(n.value?(m=e.onAfterLeave)===null||m===void 0||m.call(e):(C=e.onAfterEnter)===null||C===void 0||C.call(e))}const q={scrollTo:u},K=k(()=>{const{common:{cubicBezierEaseInOut:B},self:m}=$.value,{siderToggleButtonColor:C,siderToggleButtonBorder:E,siderToggleBarColor:I,siderToggleBarColorHover:L}=m,T={"--n-bezier":B,"--n-toggle-button-color":C,"--n-toggle-button-border":E,"--n-toggle-bar-color":I,"--n-toggle-bar-color-hover":L};return e.inverted?(T["--n-color"]=m.siderColorInverted,T["--n-text-color"]=m.textColorInverted,T["--n-border-color"]=m.siderBorderColorInverted,T["--n-toggle-button-icon-color"]=m.siderToggleButtonIconColorInverted,T.__invertScrollbar=m.__invertScrollbar):(T["--n-color"]=m.siderColor,T["--n-text-color"]=m.textColor,T["--n-border-color"]=m.siderBorderColor,T["--n-toggle-button-icon-color"]=m.siderToggleButtonIconColor),T}),D=_?ae("layout-sider",k(()=>e.inverted?"a":"b"),K,e):void 0;return Object.assign({scrollableElRef:o,scrollbarInstRef:r,mergedClsPrefix:w,mergedTheme:$,styleMaxWidth:c,mergedCollapsed:n,scrollContainerStyle:s,siderPlacement:l,handleNativeElScroll:y,handleTransitionend:P,handleTriggerClick:b,inlineThemeDisabled:_,cssVars:K,themeClass:D?.themeClass,onRender:D?.onRender},q)},render(){var e;const{mergedClsPrefix:t,mergedCollapsed:o,showTrigger:r}=this;return(e=this.onRender)===null||e===void 0||e.call(this),h("aside",{class:[`${t}-layout-sider`,this.themeClass,`${t}-layout-sider--${this.position}-positioned`,`${t}-layout-sider--${this.siderPlacement}-placement`,this.bordered&&`${t}-layout-sider--bordered`,o&&`${t}-layout-sider--collapsed`,(!o||this.showCollapsedContent)&&`${t}-layout-sider--show-content`],onTransitionend:this.handleTransitionend,style:[this.inlineThemeDisabled?void 0:this.cssVars,{maxWidth:this.styleMaxWidth,width:ue(this.width)}]},this.nativeScrollbar?h("div",{class:[`${t}-layout-sider-scroll-container`,this.contentClass],onScroll:this.handleNativeElScroll,style:[this.scrollContainerStyle,{overflow:"auto"},this.contentStyle],ref:"scrollableElRef"},this.$slots):h(Le,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",style:this.scrollContainerStyle,contentStyle:this.contentStyle,contentClass:this.contentClass,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,builtinThemeOverrides:this.inverted&&this.cssVars.__invertScrollbar==="true"?{colorHover:"rgba(255, 255, 255, .4)",color:"rgba(255, 255, 255, .3)"}:void 0}),this.$slots),r?r==="bar"?h(Jt,{clsPrefix:t,class:o?this.collapsedTriggerClass:this.triggerClass,style:o?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):h(er,{clsPrefix:t,class:o?this.collapsedTriggerClass:this.triggerClass,style:o?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):null,this.bordered?h("div",{class:`${t}-layout-sider__border`}):null)}}),ve=se("n-menu"),Co=se("n-submenu"),Ue=se("n-menu-item-group"),eo=[v("&::before","background-color: var(--n-item-color-hover);"),g("arrow",`
 color: var(--n-arrow-color-hover);
 `),g("icon",`
 color: var(--n-item-icon-color-hover);
 `),p("menu-item-content-header",`
 color: var(--n-item-text-color-hover);
 `,[v("a",`
 color: var(--n-item-text-color-hover);
 `),g("extra",`
 color: var(--n-item-text-color-hover);
 `)])],oo=[g("icon",`
 color: var(--n-item-icon-color-hover-horizontal);
 `),p("menu-item-content-header",`
 color: var(--n-item-text-color-hover-horizontal);
 `,[v("a",`
 color: var(--n-item-text-color-hover-horizontal);
 `),g("extra",`
 color: var(--n-item-text-color-hover-horizontal);
 `)])],rr=v([p("menu",`
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `,[R("horizontal",`
 max-width: 100%;
 width: 100%;
 display: flex;
 overflow: hidden;
 padding-bottom: 0;
 `,[p("submenu","margin: 0;"),p("menu-item","margin: 0;"),p("menu-item-content",`
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `,[v("&::before","display: none;"),R("selected","border-bottom: 2px solid var(--n-border-color-horizontal)")]),p("menu-item-content",[R("selected",[g("icon","color: var(--n-item-icon-color-active-horizontal);"),p("menu-item-content-header",`
 color: var(--n-item-text-color-active-horizontal);
 `,[v("a","color: var(--n-item-text-color-active-horizontal);"),g("extra","color: var(--n-item-text-color-active-horizontal);")])]),R("child-active",`
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `,[p("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-horizontal);
 `,[v("a",`
 color: var(--n-item-text-color-child-active-horizontal);
 `),g("extra",`
 color: var(--n-item-text-color-child-active-horizontal);
 `)]),g("icon",`
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]),ce("disabled",[ce("selected, child-active",[v("&:focus-within",oo)]),R("selected",[oe(null,[g("icon","color: var(--n-item-icon-color-active-hover-horizontal);"),p("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover-horizontal);
 `,[v("a","color: var(--n-item-text-color-active-hover-horizontal);"),g("extra","color: var(--n-item-text-color-active-hover-horizontal);")])])]),R("child-active",[oe(null,[g("icon","color: var(--n-item-icon-color-child-active-hover-horizontal);"),p("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `,[v("a","color: var(--n-item-text-color-child-active-hover-horizontal);"),g("extra","color: var(--n-item-text-color-child-active-hover-horizontal);")])])]),oe("border-bottom: 2px solid var(--n-border-color-horizontal);",oo)]),p("menu-item-content-header",[v("a","color: var(--n-item-text-color-horizontal);")])])]),ce("responsive",[p("menu-item-content-header",`
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),R("collapsed",[p("menu-item-content",[R("selected",[v("&::before",`
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]),p("menu-item-content-header","opacity: 0;"),g("arrow","opacity: 0;"),g("icon","color: var(--n-item-icon-color-collapsed);")])]),p("menu-item",`
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `),p("menu-item-content",`
 box-sizing: border-box;
 line-height: 1.75;
 height: 100%;
 display: grid;
 grid-template-areas: "icon content arrow";
 grid-template-columns: auto 1fr auto;
 align-items: center;
 cursor: pointer;
 position: relative;
 padding-right: 18px;
 transition:
 background-color .3s var(--n-bezier),
 padding-left .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[v("> *","z-index: 1;"),v("&::before",`
 z-index: auto;
 content: "";
 background-color: #0000;
 position: absolute;
 left: 8px;
 right: 8px;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),R("disabled",`
 opacity: .45;
 cursor: not-allowed;
 `),R("collapsed",[g("arrow","transform: rotate(0);")]),R("selected",[v("&::before","background-color: var(--n-item-color-active);"),g("arrow","color: var(--n-arrow-color-active);"),g("icon","color: var(--n-item-icon-color-active);"),p("menu-item-content-header",`
 color: var(--n-item-text-color-active);
 `,[v("a","color: var(--n-item-text-color-active);"),g("extra","color: var(--n-item-text-color-active);")])]),R("child-active",[p("menu-item-content-header",`
 color: var(--n-item-text-color-child-active);
 `,[v("a",`
 color: var(--n-item-text-color-child-active);
 `),g("extra",`
 color: var(--n-item-text-color-child-active);
 `)]),g("arrow",`
 color: var(--n-arrow-color-child-active);
 `),g("icon",`
 color: var(--n-item-icon-color-child-active);
 `)]),ce("disabled",[ce("selected, child-active",[v("&:focus-within",eo)]),R("selected",[oe(null,[g("arrow","color: var(--n-arrow-color-active-hover);"),g("icon","color: var(--n-item-icon-color-active-hover);"),p("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover);
 `,[v("a","color: var(--n-item-text-color-active-hover);"),g("extra","color: var(--n-item-text-color-active-hover);")])])]),R("child-active",[oe(null,[g("arrow","color: var(--n-arrow-color-child-active-hover);"),g("icon","color: var(--n-item-icon-color-child-active-hover);"),p("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover);
 `,[v("a","color: var(--n-item-text-color-child-active-hover);"),g("extra","color: var(--n-item-text-color-child-active-hover);")])])]),R("selected",[oe(null,[v("&::before","background-color: var(--n-item-color-active-hover);")])]),oe(null,eo)]),g("icon",`
 grid-area: icon;
 color: var(--n-item-icon-color);
 transition:
 color .3s var(--n-bezier),
 font-size .3s var(--n-bezier),
 margin-right .3s var(--n-bezier);
 box-sizing: content-box;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 `),g("arrow",`
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `),p("menu-item-content-header",`
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 color: var(--n-item-text-color);
 `,[v("a",`
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `,[v("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),g("extra",`
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]),p("submenu",`
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `,[p("menu-item-content",`
 height: var(--n-item-height);
 `),p("submenu-children",`
 overflow: hidden;
 padding: 0;
 `,[Ko({duration:".2s"})])]),p("menu-item-group",[p("menu-item-group-title",`
 margin-top: 6px;
 color: var(--n-group-text-color);
 cursor: default;
 font-size: .93em;
 height: 36px;
 display: flex;
 align-items: center;
 transition:
 padding-left .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)])]),p("menu-tooltip",[v("a",`
 color: inherit;
 text-decoration: none;
 `)]),p("menu-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);function oe(e,t){return[R("hover",e,t),v("&:hover",e,t)]}const ko=H({name:"MenuOptionContent",props:{collapsed:Boolean,disabled:Boolean,title:[String,Function],icon:Function,extra:[String,Function],showArrow:Boolean,childActive:Boolean,hover:Boolean,paddingLeft:Number,selected:Boolean,maxIconSize:{type:Number,required:!0},activeIconSize:{type:Number,required:!0},iconMarginRight:{type:Number,required:!0},clsPrefix:{type:String,required:!0},onClick:Function,tmNode:{type:Object,required:!0},isEllipsisPlaceholder:Boolean},setup(e){const{props:t}=Z(ve);return{menuProps:t,style:k(()=>{const{paddingLeft:o}=e;return{paddingLeft:o&&`${o}px`}}),iconStyle:k(()=>{const{maxIconSize:o,activeIconSize:r,iconMarginRight:a}=e;return{width:`${o}px`,height:`${o}px`,fontSize:`${r}px`,marginRight:`${a}px`}})}},render(){const{clsPrefix:e,tmNode:t,menuProps:{renderIcon:o,renderLabel:r,renderExtra:a,expandIcon:n}}=this,c=o?o(t.rawNode):ie(this.icon);return h("div",{onClick:s=>{var l;(l=this.onClick)===null||l===void 0||l.call(this,s)},role:"none",class:[`${e}-menu-item-content`,{[`${e}-menu-item-content--selected`]:this.selected,[`${e}-menu-item-content--collapsed`]:this.collapsed,[`${e}-menu-item-content--child-active`]:this.childActive,[`${e}-menu-item-content--disabled`]:this.disabled,[`${e}-menu-item-content--hover`]:this.hover}],style:this.style},c&&h("div",{class:`${e}-menu-item-content__icon`,style:this.iconStyle,role:"none"},[c]),h("div",{class:`${e}-menu-item-content-header`,role:"none"},this.isEllipsisPlaceholder?this.title:r?r(t.rawNode):ie(this.title),this.extra||a?h("span",{class:`${e}-menu-item-content-header__extra`}," ",a?a(t.rawNode):ie(this.extra)):null),this.showArrow?h(ho,{ariaHidden:!0,class:`${e}-menu-item-content__arrow`,clsPrefix:e},{default:()=>n?n(t.rawNode):h(vt,null)}):null)}}),me=8;function Ke(e){const t=Z(ve),{props:o,mergedCollapsedRef:r}=t,a=Z(Co,null),n=Z(Ue,null),c=k(()=>o.mode==="horizontal"),s=k(()=>c.value?o.dropdownPlacement:"tmNodes"in e?"right-start":"right"),l=k(()=>{var x;return Math.max((x=o.collapsedIconSize)!==null&&x!==void 0?x:o.iconSize,o.iconSize)}),u=k(()=>{var x;return!c.value&&e.root&&r.value&&(x=o.collapsedIconSize)!==null&&x!==void 0?x:o.iconSize}),b=k(()=>{if(c.value)return;const{collapsedWidth:x,indent:y,rootIndent:w}=o,{root:_,isGroup:$}=e,P=w===void 0?y:w;return _?r.value?x/2-l.value/2:P:n&&typeof n.paddingLeftRef.value=="number"?y/2+n.paddingLeftRef.value:a&&typeof a.paddingLeftRef.value=="number"?($?y/2:y)+a.paddingLeftRef.value:0}),A=k(()=>{const{collapsedWidth:x,indent:y,rootIndent:w}=o,{value:_}=l,{root:$}=e;return c.value||!$||!r.value?me:(w===void 0?y:w)+_+me-(x+_)/2});return{dropdownPlacement:s,activeIconSize:u,maxIconSize:l,paddingLeft:b,iconMarginRight:A,NMenu:t,NSubmenu:a,NMenuOptionGroup:n}}const We={internalKey:{type:[String,Number],required:!0},root:Boolean,isGroup:Boolean,level:{type:Number,required:!0},title:[String,Function],extra:[String,Function]},nr=H({name:"MenuDivider",setup(){const e=Z(ve),{mergedClsPrefixRef:t,isHorizontalRef:o}=e;return()=>o.value?null:h("div",{class:`${t.value}-menu-divider`})}}),yo=Object.assign(Object.assign({},We),{tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function}),ir=Fe(yo),lr=H({name:"MenuOption",props:yo,setup(e){const t=Ke(e),{NSubmenu:o,NMenu:r,NMenuOptionGroup:a}=t,{props:n,mergedClsPrefixRef:c,mergedCollapsedRef:s}=r,l=o?o.mergedDisabledRef:a?a.mergedDisabledRef:{value:!1},u=k(()=>l.value||e.disabled);function b(x){const{onClick:y}=e;y&&y(x)}function A(x){u.value||(r.doSelect(e.internalKey,e.tmNode.rawNode),b(x))}return{mergedClsPrefix:c,dropdownPlacement:t.dropdownPlacement,paddingLeft:t.paddingLeft,iconMarginRight:t.iconMarginRight,maxIconSize:t.maxIconSize,activeIconSize:t.activeIconSize,mergedTheme:r.mergedThemeRef,menuProps:n,dropdownEnabled:Te(()=>e.root&&s.value&&n.mode!=="horizontal"&&!u.value),selected:Te(()=>r.mergedValueRef.value===e.internalKey),mergedDisabled:u,handleClick:A}},render(){const{mergedClsPrefix:e,mergedTheme:t,tmNode:o,menuProps:{renderLabel:r,nodeProps:a}}=this,n=a?.(o.rawNode);return h("div",Object.assign({},n,{role:"menuitem",class:[`${e}-menu-item`,n?.class]}),h(at,{theme:t.peers.Tooltip,themeOverrides:t.peerOverrides.Tooltip,trigger:"hover",placement:this.dropdownPlacement,disabled:!this.dropdownEnabled||this.title===void 0,internalExtraClass:["menu-tooltip"]},{default:()=>r?r(o.rawNode):ie(this.title),trigger:()=>h(ko,{tmNode:o,clsPrefix:e,paddingLeft:this.paddingLeft,iconMarginRight:this.iconMarginRight,maxIconSize:this.maxIconSize,activeIconSize:this.activeIconSize,selected:this.selected,title:this.title,extra:this.extra,disabled:this.mergedDisabled,icon:this.icon,onClick:this.handleClick})}))}}),zo=Object.assign(Object.assign({},We),{tmNode:{type:Object,required:!0},tmNodes:{type:Array,required:!0}}),ar=Fe(zo),sr=H({name:"MenuOptionGroup",props:zo,setup(e){const t=Ke(e),{NSubmenu:o}=t,r=k(()=>o?.mergedDisabledRef.value?!0:e.tmNode.disabled);Q(Ue,{paddingLeftRef:t.paddingLeft,mergedDisabledRef:r});const{mergedClsPrefixRef:a,props:n}=Z(ve);return function(){const{value:c}=a,s=t.paddingLeft.value,{nodeProps:l}=n,u=l?.(e.tmNode.rawNode);return h("div",{class:`${c}-menu-item-group`,role:"group"},h("div",Object.assign({},u,{class:[`${c}-menu-item-group-title`,u?.class],style:[u?.style||"",s!==void 0?`padding-left: ${s}px;`:""]}),ie(e.title),e.extra?h(vo,null," ",ie(e.extra)):null),h("div",null,e.tmNodes.map(b=>Ye(b,n))))}}});function je(e){return e.type==="divider"||e.type==="render"}function cr(e){return e.type==="divider"}function Ye(e,t){const{rawNode:o}=e,{show:r}=o;if(r===!1)return null;if(je(o))return cr(o)?h(nr,Object.assign({key:e.key},o.props)):null;const{labelField:a}=t,{key:n,level:c,isGroup:s}=e,l=Object.assign(Object.assign({},o),{title:o.title||o[a],extra:o.titleExtra||o.extra,key:n,internalKey:n,level:c,root:c===0,isGroup:s});return e.children?e.isGroup?h(sr,Ae(l,ar,{tmNode:e,tmNodes:e.children,key:n})):h(Ee,Ae(l,dr,{key:n,rawNodes:o[t.childrenField],tmNodes:e.children,tmNode:e})):h(lr,Ae(l,ir,{key:n,tmNode:e}))}const Io=Object.assign(Object.assign({},We),{rawNodes:{type:Array,default:()=>[]},tmNodes:{type:Array,default:()=>[]},tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function,domId:String,virtualChildActive:{type:Boolean,default:void 0},isEllipsisPlaceholder:Boolean}),dr=Fe(Io),Ee=H({name:"Submenu",props:Io,setup(e){const t=Ke(e),{NMenu:o,NSubmenu:r}=t,{props:a,mergedCollapsedRef:n,mergedThemeRef:c}=o,s=k(()=>{const{disabled:x}=e;return r?.mergedDisabledRef.value||a.disabled?!0:x}),l=F(!1);Q(Co,{paddingLeftRef:t.paddingLeft,mergedDisabledRef:s}),Q(Ue,null);function u(){const{onClick:x}=e;x&&x()}function b(){s.value||(n.value||o.toggleExpand(e.internalKey),u())}function A(x){l.value=x}return{menuProps:a,mergedTheme:c,doSelect:o.doSelect,inverted:o.invertedRef,isHorizontal:o.isHorizontalRef,mergedClsPrefix:o.mergedClsPrefixRef,maxIconSize:t.maxIconSize,activeIconSize:t.activeIconSize,iconMarginRight:t.iconMarginRight,dropdownPlacement:t.dropdownPlacement,dropdownShow:l,paddingLeft:t.paddingLeft,mergedDisabled:s,mergedValue:o.mergedValueRef,childActive:Te(()=>{var x;return(x=e.virtualChildActive)!==null&&x!==void 0?x:o.activePathRef.value.includes(e.internalKey)}),collapsed:k(()=>a.mode==="horizontal"?!1:n.value?!0:!o.mergedExpandedKeysRef.value.includes(e.internalKey)),dropdownEnabled:k(()=>!s.value&&(a.mode==="horizontal"||n.value)),handlePopoverShowChange:A,handleClick:b}},render(){var e;const{mergedClsPrefix:t,menuProps:{renderIcon:o,renderLabel:r}}=this,a=()=>{const{isHorizontal:c,paddingLeft:s,collapsed:l,mergedDisabled:u,maxIconSize:b,activeIconSize:A,title:x,childActive:y,icon:w,handleClick:_,menuProps:{nodeProps:$},dropdownShow:P,iconMarginRight:q,tmNode:K,mergedClsPrefix:D,isEllipsisPlaceholder:B,extra:m}=this,C=$?.(K.rawNode);return h("div",Object.assign({},C,{class:[`${D}-menu-item`,C?.class],role:"menuitem"}),h(ko,{tmNode:K,paddingLeft:s,collapsed:l,disabled:u,iconMarginRight:q,maxIconSize:b,activeIconSize:A,title:x,extra:m,showArrow:!c,childActive:y,clsPrefix:D,icon:w,hover:P,onClick:_,isEllipsisPlaceholder:B}))},n=()=>h(Wo,null,{default:()=>{const{tmNodes:c,collapsed:s}=this;return s?null:h("div",{class:`${t}-submenu-children`,role:"menu"},c.map(l=>Ye(l,this.menuProps)))}});return this.root?h(fo,Object.assign({size:"large",trigger:"hover"},(e=this.menuProps)===null||e===void 0?void 0:e.dropdownProps,{themeOverrides:this.mergedTheme.peerOverrides.Dropdown,theme:this.mergedTheme.peers.Dropdown,builtinThemeOverrides:{fontSizeLarge:"14px",optionIconSizeLarge:"18px"},value:this.mergedValue,disabled:!this.dropdownEnabled,placement:this.dropdownPlacement,keyField:this.menuProps.keyField,labelField:this.menuProps.labelField,childrenField:this.menuProps.childrenField,onUpdateShow:this.handlePopoverShowChange,options:this.rawNodes,onSelect:this.doSelect,inverted:this.inverted,renderIcon:o,renderLabel:r}),{default:()=>h("div",{class:`${t}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},a(),this.isHorizontal?null:n())}):h("div",{class:`${t}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},a(),n())}}),ur=Object.assign(Object.assign({},X.props),{options:{type:Array,default:()=>[]},collapsed:{type:Boolean,default:void 0},collapsedWidth:{type:Number,default:48},iconSize:{type:Number,default:20},collapsedIconSize:{type:Number,default:24},rootIndent:Number,indent:{type:Number,default:32},labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandAll:Boolean,defaultExpandedKeys:Array,expandedKeys:Array,value:[String,Number],defaultValue:{type:[String,Number],default:null},mode:{type:String,default:"vertical"},watchProps:{type:Array,default:void 0},disabled:Boolean,show:{type:Boolean,default:!0},inverted:Boolean,"onUpdate:expandedKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],onUpdateValue:[Function,Array],"onUpdate:value":[Function,Array],expandIcon:Function,renderIcon:Function,renderLabel:Function,renderExtra:Function,dropdownProps:Object,accordion:Boolean,nodeProps:Function,dropdownPlacement:{type:String,default:"bottom"},responsive:Boolean,items:Array,onOpenNamesChange:[Function,Array],onSelect:[Function,Array],onExpandedNamesChange:[Function,Array],expandedNames:Array,defaultExpandedNames:Array}),hr=H({name:"Menu",inheritAttrs:!1,props:ur,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:o}=re(e),r=X("Menu","-menu",rr,Ut,e,t),a=Z(bo,null),n=k(()=>{var z;const{collapsed:M}=e;if(M!==void 0)return M;if(a){const{collapseModeRef:i,collapsedRef:S}=a;if(i.value==="width")return(z=S.value)!==null&&z!==void 0?z:!1}return!1}),c=k(()=>{const{keyField:z,childrenField:M,disabledField:i}=e;return Be(e.items||e.options,{getIgnored(S){return je(S)},getChildren(S){return S[M]},getDisabled(S){return S[i]},getKey(S){var N;return(N=S[z])!==null&&N!==void 0?N:S.name}})}),s=k(()=>new Set(c.value.treeNodes.map(z=>z.key))),{watchProps:l}=e,u=F(null);l?.includes("defaultValue")?fe(()=>{u.value=e.defaultValue}):u.value=e.defaultValue;const b=te(e,"value"),A=he(b,u),x=F([]),y=()=>{x.value=e.defaultExpandAll?c.value.getNonLeafKeys():e.defaultExpandedNames||e.defaultExpandedKeys||c.value.getPath(A.value,{includeSelf:!1}).keyPath};l?.includes("defaultExpandedKeys")?fe(y):y();const w=dt(e,["expandedNames","expandedKeys"]),_=he(w,x),$=k(()=>c.value.treeNodes),P=k(()=>c.value.getPath(A.value).keyPath);Q(ve,{props:e,mergedCollapsedRef:n,mergedThemeRef:r,mergedValueRef:A,mergedExpandedKeysRef:_,activePathRef:P,mergedClsPrefixRef:t,isHorizontalRef:k(()=>e.mode==="horizontal"),invertedRef:te(e,"inverted"),doSelect:q,toggleExpand:D});function q(z,M){const{"onUpdate:value":i,onUpdateValue:S,onSelect:N}=e;S&&U(S,z,M),i&&U(i,z,M),N&&U(N,z,M),u.value=z}function K(z){const{"onUpdate:expandedKeys":M,onUpdateExpandedKeys:i,onExpandedNamesChange:S,onOpenNamesChange:N}=e;M&&U(M,z),i&&U(i,z),S&&U(S,z),N&&U(N,z),x.value=z}function D(z){const M=Array.from(_.value),i=M.findIndex(S=>S===z);if(~i)M.splice(i,1);else{if(e.accordion&&s.value.has(z)){const S=M.findIndex(N=>s.value.has(N));S>-1&&M.splice(S,1)}M.push(z)}K(M)}const B=z=>{const M=c.value.getPath(z??A.value,{includeSelf:!1}).keyPath;if(!M.length)return;const i=Array.from(_.value),S=new Set([...i,...M]);e.accordion&&s.value.forEach(N=>{S.has(N)&&!M.includes(N)&&S.delete(N)}),K(Array.from(S))},m=k(()=>{const{inverted:z}=e,{common:{cubicBezierEaseInOut:M},self:i}=r.value,{borderRadius:S,borderColorHorizontal:N,fontSize:Se,itemHeight:_e,dividerColor:He}=i,d={"--n-divider-color":He,"--n-bezier":M,"--n-font-size":Se,"--n-border-color-horizontal":N,"--n-border-radius":S,"--n-item-height":_e};return z?(d["--n-group-text-color"]=i.groupTextColorInverted,d["--n-color"]=i.colorInverted,d["--n-item-text-color"]=i.itemTextColorInverted,d["--n-item-text-color-hover"]=i.itemTextColorHoverInverted,d["--n-item-text-color-active"]=i.itemTextColorActiveInverted,d["--n-item-text-color-child-active"]=i.itemTextColorChildActiveInverted,d["--n-item-text-color-child-active-hover"]=i.itemTextColorChildActiveInverted,d["--n-item-text-color-active-hover"]=i.itemTextColorActiveHoverInverted,d["--n-item-icon-color"]=i.itemIconColorInverted,d["--n-item-icon-color-hover"]=i.itemIconColorHoverInverted,d["--n-item-icon-color-active"]=i.itemIconColorActiveInverted,d["--n-item-icon-color-active-hover"]=i.itemIconColorActiveHoverInverted,d["--n-item-icon-color-child-active"]=i.itemIconColorChildActiveInverted,d["--n-item-icon-color-child-active-hover"]=i.itemIconColorChildActiveHoverInverted,d["--n-item-icon-color-collapsed"]=i.itemIconColorCollapsedInverted,d["--n-item-text-color-horizontal"]=i.itemTextColorHorizontalInverted,d["--n-item-text-color-hover-horizontal"]=i.itemTextColorHoverHorizontalInverted,d["--n-item-text-color-active-horizontal"]=i.itemTextColorActiveHorizontalInverted,d["--n-item-text-color-child-active-horizontal"]=i.itemTextColorChildActiveHorizontalInverted,d["--n-item-text-color-child-active-hover-horizontal"]=i.itemTextColorChildActiveHoverHorizontalInverted,d["--n-item-text-color-active-hover-horizontal"]=i.itemTextColorActiveHoverHorizontalInverted,d["--n-item-icon-color-horizontal"]=i.itemIconColorHorizontalInverted,d["--n-item-icon-color-hover-horizontal"]=i.itemIconColorHoverHorizontalInverted,d["--n-item-icon-color-active-horizontal"]=i.itemIconColorActiveHorizontalInverted,d["--n-item-icon-color-active-hover-horizontal"]=i.itemIconColorActiveHoverHorizontalInverted,d["--n-item-icon-color-child-active-horizontal"]=i.itemIconColorChildActiveHorizontalInverted,d["--n-item-icon-color-child-active-hover-horizontal"]=i.itemIconColorChildActiveHoverHorizontalInverted,d["--n-arrow-color"]=i.arrowColorInverted,d["--n-arrow-color-hover"]=i.arrowColorHoverInverted,d["--n-arrow-color-active"]=i.arrowColorActiveInverted,d["--n-arrow-color-active-hover"]=i.arrowColorActiveHoverInverted,d["--n-arrow-color-child-active"]=i.arrowColorChildActiveInverted,d["--n-arrow-color-child-active-hover"]=i.arrowColorChildActiveHoverInverted,d["--n-item-color-hover"]=i.itemColorHoverInverted,d["--n-item-color-active"]=i.itemColorActiveInverted,d["--n-item-color-active-hover"]=i.itemColorActiveHoverInverted,d["--n-item-color-active-collapsed"]=i.itemColorActiveCollapsedInverted):(d["--n-group-text-color"]=i.groupTextColor,d["--n-color"]=i.color,d["--n-item-text-color"]=i.itemTextColor,d["--n-item-text-color-hover"]=i.itemTextColorHover,d["--n-item-text-color-active"]=i.itemTextColorActive,d["--n-item-text-color-child-active"]=i.itemTextColorChildActive,d["--n-item-text-color-child-active-hover"]=i.itemTextColorChildActiveHover,d["--n-item-text-color-active-hover"]=i.itemTextColorActiveHover,d["--n-item-icon-color"]=i.itemIconColor,d["--n-item-icon-color-hover"]=i.itemIconColorHover,d["--n-item-icon-color-active"]=i.itemIconColorActive,d["--n-item-icon-color-active-hover"]=i.itemIconColorActiveHover,d["--n-item-icon-color-child-active"]=i.itemIconColorChildActive,d["--n-item-icon-color-child-active-hover"]=i.itemIconColorChildActiveHover,d["--n-item-icon-color-collapsed"]=i.itemIconColorCollapsed,d["--n-item-text-color-horizontal"]=i.itemTextColorHorizontal,d["--n-item-text-color-hover-horizontal"]=i.itemTextColorHoverHorizontal,d["--n-item-text-color-active-horizontal"]=i.itemTextColorActiveHorizontal,d["--n-item-text-color-child-active-horizontal"]=i.itemTextColorChildActiveHorizontal,d["--n-item-text-color-child-active-hover-horizontal"]=i.itemTextColorChildActiveHoverHorizontal,d["--n-item-text-color-active-hover-horizontal"]=i.itemTextColorActiveHoverHorizontal,d["--n-item-icon-color-horizontal"]=i.itemIconColorHorizontal,d["--n-item-icon-color-hover-horizontal"]=i.itemIconColorHoverHorizontal,d["--n-item-icon-color-active-horizontal"]=i.itemIconColorActiveHorizontal,d["--n-item-icon-color-active-hover-horizontal"]=i.itemIconColorActiveHoverHorizontal,d["--n-item-icon-color-child-active-horizontal"]=i.itemIconColorChildActiveHorizontal,d["--n-item-icon-color-child-active-hover-horizontal"]=i.itemIconColorChildActiveHoverHorizontal,d["--n-arrow-color"]=i.arrowColor,d["--n-arrow-color-hover"]=i.arrowColorHover,d["--n-arrow-color-active"]=i.arrowColorActive,d["--n-arrow-color-active-hover"]=i.arrowColorActiveHover,d["--n-arrow-color-child-active"]=i.arrowColorChildActive,d["--n-arrow-color-child-active-hover"]=i.arrowColorChildActiveHover,d["--n-item-color-hover"]=i.itemColorHover,d["--n-item-color-active"]=i.itemColorActive,d["--n-item-color-active-hover"]=i.itemColorActiveHover,d["--n-item-color-active-collapsed"]=i.itemColorActiveCollapsed),d}),C=o?ae("menu",k(()=>e.inverted?"a":"b"),m,e):void 0,E=Go(),I=F(null),L=F(null);let T=!0;const W=()=>{var z;T?T=!1:(z=I.value)===null||z===void 0||z.sync({showAllItemsBeforeCalculate:!0})};function J(){return document.getElementById(E)}const ne=F(-1);function we(z){ne.value=e.options.length-z}function Ce(z){z||(ne.value=-1)}const ke=k(()=>{const z=ne.value;return{children:z===-1?[]:e.options.slice(z)}}),ye=k(()=>{const{childrenField:z,disabledField:M,keyField:i}=e;return Be([ke.value],{getIgnored(S){return je(S)},getChildren(S){return S[z]},getDisabled(S){return S[M]},getKey(S){var N;return(N=S[i])!==null&&N!==void 0?N:S.name}})}),ze=k(()=>Be([{}]).treeNodes[0]);function Ie(){var z;if(ne.value===-1)return h(Ee,{root:!0,level:0,key:"__ellpisisGroupPlaceholder__",internalKey:"__ellpisisGroupPlaceholder__",title:"···",tmNode:ze.value,domId:E,isEllipsisPlaceholder:!0});const M=ye.value.treeNodes[0],i=P.value,S=!!(!((z=M.children)===null||z===void 0)&&z.some(N=>i.includes(N.key)));return h(Ee,{level:0,root:!0,key:"__ellpisisGroup__",internalKey:"__ellpisisGroup__",title:"···",virtualChildActive:S,tmNode:M,domId:E,rawNodes:M.rawNode.children||[],tmNodes:M.children||[],isEllipsisPlaceholder:!0})}return{mergedClsPrefix:t,controlledExpandedKeys:w,uncontrolledExpanededKeys:x,mergedExpandedKeys:_,uncontrolledValue:u,mergedValue:A,activePath:P,tmNodes:$,mergedTheme:r,mergedCollapsed:n,cssVars:o?void 0:m,themeClass:C?.themeClass,overflowRef:I,counterRef:L,updateCounter:()=>{},onResize:W,onUpdateOverflow:Ce,onUpdateCount:we,renderCounter:Ie,getCounter:J,onRender:C?.onRender,showOption:B,deriveResponsiveState:W}},render(){const{mergedClsPrefix:e,mode:t,themeClass:o,onRender:r}=this;r?.();const a=()=>this.tmNodes.map(l=>Ye(l,this.$props)),c=t==="horizontal"&&this.responsive,s=()=>h("div",ao(this.$attrs,{role:t==="horizontal"?"menubar":"menu",class:[`${e}-menu`,o,`${e}-menu--${t}`,c&&`${e}-menu--responsive`,this.mergedCollapsed&&`${e}-menu--collapsed`],style:this.cssVars}),c?h(ct,{ref:"overflowRef",onUpdateOverflow:this.onUpdateOverflow,getCounter:this.getCounter,onUpdateCount:this.onUpdateCount,updateCounter:this.updateCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:a,counter:this.renderCounter}):a());return c?h(Yo,{onResize:this.onResize},{default:s}):s()}}),vr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},mr=H({name:"AlertCircleOutline",render:function(t,o){return O(),j("svg",vr,o[0]||(o[0]=[f("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1),f("path",{d:"M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 6z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{d:"M256 367.91a20 20 0 1 1 20-20a20 20 0 0 1-20 20z",fill:"currentColor"},null,-1)]))}}),pr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},fr=H({name:"ArrowDownCircleOutline",render:function(t,o){return O(),j("svg",pr,o[0]||(o[0]=[f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M176 262.62L256 342l80-79.38"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M256 330.97V170"},null,-1),f("path",{d:"M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1)]))}}),gr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},br=H({name:"ArrowUpCircleOutline",render:function(t,o){return O(),j("svg",gr,o[0]||(o[0]=[f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M176 249.38L256 170l80 79.38"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M256 181.03V342"},null,-1),f("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1)]))}}),xr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},wr=H({name:"BarcodeOutline",render:function(t,o){return O(),j("svg",xr,o[0]||(o[0]=[xe('<path d="M384 400.33l35.13-.33A29 29 0 0 0 448 371.13V140.87A29 29 0 0 0 419.13 112l-35.13.33" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path d="M128 112l-36.8.33c-15.88 0-27.2 13-27.2 28.87v230.27c0 15.87 11.32 28.86 27.2 28.86L128 400" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M384 192v128"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 160v192"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 160v192"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 192v128"></path>',7)]))}}),Cr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},kr=H({name:"BusinessOutline",render:function(t,o){return O(),j("svg",Cr,o[0]||(o[0]=[xe('<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 416v64"></path><path d="M80 32h192a32 32 0 0 1 32 32v412a4 4 0 0 1-4 4H48h0V64a32 32 0 0 1 32-32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path d="M320 192h112a32 32 0 0 1 32 32v256h0h-160h0V208a16 16 0 0 1 16-16z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path d="M98.08 431.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M98.08 351.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M98.08 271.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M98.08 191.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M98.08 111.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M178.08 351.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M178.08 271.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M178.08 191.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M178.08 111.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M258.08 431.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M258.08 351.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M258.08 271.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><ellipse cx="256" cy="176" rx="15.95" ry="16.03" transform="rotate(-45 255.99 175.996)" fill="currentColor"></ellipse><path d="M258.08 111.87a16 16 0 1 1 13.79-13.79a16 16 0 0 1-13.79 13.79z" fill="currentColor"></path><path d="M400 400a16 16 0 1 0 16 16a16 16 0 0 0-16-16z" fill="currentColor"></path><path d="M400 320a16 16 0 1 0 16 16a16 16 0 0 0-16-16z" fill="currentColor"></path><path d="M400 240a16 16 0 1 0 16 16a16 16 0 0 0-16-16z" fill="currentColor"></path><path d="M336 400a16 16 0 1 0 16 16a16 16 0 0 0-16-16z" fill="currentColor"></path><path d="M336 320a16 16 0 1 0 16 16a16 16 0 0 0-16-16z" fill="currentColor"></path><path d="M336 240a16 16 0 1 0 16 16a16 16 0 0 0-16-16z" fill="currentColor"></path>',23)]))}}),yr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},zr=H({name:"CalendarOutline",render:function(t,o){return O(),j("svg",yr,o[0]||(o[0]=[xe('<rect fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" x="48" y="80" width="416" height="384" rx="48"></rect><circle cx="296" cy="232" r="24" fill="currentColor"></circle><circle cx="376" cy="232" r="24" fill="currentColor"></circle><circle cx="296" cy="312" r="24" fill="currentColor"></circle><circle cx="376" cy="312" r="24" fill="currentColor"></circle><circle cx="136" cy="312" r="24" fill="currentColor"></circle><circle cx="216" cy="312" r="24" fill="currentColor"></circle><circle cx="136" cy="392" r="24" fill="currentColor"></circle><circle cx="216" cy="392" r="24" fill="currentColor"></circle><circle cx="296" cy="392" r="24" fill="currentColor"></circle><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" stroke-linecap="round" d="M128 48v32"></path><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" stroke-linecap="round" d="M384 48v32"></path><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path>',13)]))}}),Ir={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Sr=H({name:"CartOutline",render:function(t,o){return O(),j("svg",Ir,o[0]||(o[0]=[f("circle",{cx:"176",cy:"416",r:"16",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("circle",{cx:"400",cy:"416",r:"16",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M48 80h64l48 272h256"},null,-1),f("path",{d:"M160 288h249.44a8 8 0 0 0 7.85-6.43l28.8-144a8 8 0 0 0-7.85-9.57H128",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1)]))}}),_r={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Hr=H({name:"ClipboardOutline",render:function(t,o){return O(),j("svg",_r,o[0]||(o[0]=[f("path",{d:"M336 64h32a48 48 0 0 1 48 48v320a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V112a48 48 0 0 1 48-48h32",fill:"none",stroke:"currentColor","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("rect",{x:"176",y:"32",width:"160",height:"64",rx:"26.13",ry:"26.13",fill:"none",stroke:"currentColor","stroke-linejoin":"round","stroke-width":"32"},null,-1)]))}}),Rr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},to=H({name:"CubeOutline",render:function(t,o){return O(),j("svg",Rr,o[0]||(o[0]=[f("path",{d:"M448 341.37V170.61A32 32 0 0 0 432.11 143l-152-88.46a47.94 47.94 0 0 0-48.24 0L79.89 143A32 32 0 0 0 64 170.61v170.76A32 32 0 0 0 79.89 369l152 88.46a48 48 0 0 0 48.24 0l152-88.46A32 32 0 0 0 448 341.37z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M69 153.99l187 110l187-110"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M256 463.99v-200"},null,-1)]))}}),Ar={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Mr=H({name:"DocumentTextOutline",render:function(t,o){return O(),j("svg",Ar,o[0]||(o[0]=[f("path",{d:"M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62z",fill:"none",stroke:"currentColor","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{d:"M256 56v120a32 32 0 0 0 32 32h120",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M176 288h160"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M176 368h160"},null,-1)]))}}),Br={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},$r=H({name:"FolderOpenOutline",render:function(t,o){return O(),j("svg",Br,o[0]||(o[0]=[f("path",{d:"M64 192v-72a40 40 0 0 1 40-40h75.89a40 40 0 0 1 22.19 6.72l27.84 18.56a40 40 0 0 0 22.19 6.72H408a40 40 0 0 1 40 40v40",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{d:"M479.9 226.55L463.68 392a40 40 0 0 1-39.93 40H88.25a40 40 0 0 1-39.93-40L32.1 226.55A32 32 0 0 1 64 192h384.1a32 32 0 0 1 31.8 34.55z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1)]))}}),Or={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Pr=H({name:"GridOutline",render:function(t,o){return O(),j("svg",Or,o[0]||(o[0]=[f("rect",{x:"48",y:"48",width:"176",height:"176",rx:"20",ry:"20",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("rect",{x:"288",y:"48",width:"176",height:"176",rx:"20",ry:"20",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("rect",{x:"48",y:"288",width:"176",height:"176",rx:"20",ry:"20",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("rect",{x:"288",y:"288",width:"176",height:"176",rx:"20",ry:"20",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1)]))}}),Tr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},jr=H({name:"InformationCircleOutline",render:function(t,o){return O(),j("svg",Tr,o[0]||(o[0]=[f("path",{d:"M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184s184-82.39 184-184S349.61 64 248 64z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M220 220h32v116"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M208 340h88"},null,-1),f("path",{d:"M248 130a26 26 0 1 0 26 26a26 26 0 0 0-26-26z",fill:"currentColor"},null,-1)]))}}),Er={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Nr=H({name:"LinkOutline",render:function(t,o){return O(),j("svg",Er,o[0]||(o[0]=[f("path",{d:"M208 352h-64a96 96 0 0 1 0-192h64",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"36"},null,-1),f("path",{d:"M304 160h64a96 96 0 0 1 0 192h-64",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"36"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"36",d:"M163.29 256h187.42"},null,-1)]))}}),Lr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Fr=H({name:"MenuOutline",render:function(t,o){return O(),j("svg",Lr,o[0]||(o[0]=[f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M80 160h352"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M80 256h352"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M80 352h352"},null,-1)]))}}),Dr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Vr=H({name:"OptionsOutline",render:function(t,o){return O(),j("svg",Dr,o[0]||(o[0]=[xe('<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 128h80"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M64 128h240"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 384h80"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M64 384h240"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M208 256h240"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M64 256h80"></path><circle cx="336" cy="128" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle><circle cx="176" cy="256" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle><circle cx="336" cy="384" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle>',9)]))}}),Ur={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Kr=H({name:"PeopleOutline",render:function(t,o){return O(),j("svg",Ur,o[0]||(o[0]=[f("path",{d:"M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{d:"M336 304c-65.17 0-127.84 32.37-143.54 95.41c-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1),f("path",{d:"M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{d:"M206 306c-18.05-8.27-37.93-11.45-59-11.45c-52 0-102.1 25.85-114.65 76.2c-1.65 6.66 2.53 13.25 9.37 13.25H154",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32"},null,-1)]))}}),Wr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Yr=H({name:"PhonePortraitOutline",render:function(t,o){return O(),j("svg",Wr,o[0]||(o[0]=[f("rect",{x:"128",y:"16",width:"256",height:"480",rx:"48",ry:"48",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{d:"M176 16h24a8 8 0 0 1 8 8h0a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16h0a8 8 0 0 1 8-8h24",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1)]))}}),Gr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Xr=H({name:"ReceiptOutline",render:function(t,o){return O(),j("svg",Gr,o[0]||(o[0]=[f("path",{fill:"none",stroke:"currentColor","stroke-linejoin":"round","stroke-width":"32",d:"M160 336V48l32 16l32-16l31.94 16l32.37-16L320 64l31.79-16l31.93 16L416 48l32.01 16L480 48v224"},null,-1),f("path",{d:"M480 272v112a80 80 0 0 1-80 80h0a80 80 0 0 1-80-80v-48H48a15.86 15.86 0 0 0-16 16c0 64 6.74 112 80 112h288",fill:"none",stroke:"currentColor","stroke-linejoin":"round","stroke-width":"32"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M224 144h192"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M288 224h128"},null,-1)]))}}),qr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Qr=H({name:"SearchOutline",render:function(t,o){return O(),j("svg",qr,o[0]||(o[0]=[f("path",{d:"M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M338.29 338.29L448 448"},null,-1)]))}}),Zr={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Jr=H({name:"SettingsOutline",render:function(t,o){return O(),j("svg",Zr,o[0]||(o[0]=[f("path",{d:"M262.29 192.31a64 64 0 1 0 57.4 57.4a64.13 64.13 0 0 0-57.4-57.4zM416.39 256a154.34 154.34 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.48 164.48 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22a155.3 155.3 0 0 1-21.46-12.57a16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.48 164.48 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22a155.3 155.3 0 0 1 21.46 12.57a16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1)]))}}),en={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},on=H({name:"SwapHorizontalOutline",render:function(t,o){return O(),j("svg",en,o[0]||(o[0]=[f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M304 48l112 112l-112 112"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M398.87 160H96"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M208 464L96 352l112-112"},null,-1),f("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M114 352h302"},null,-1)]))}});function tn(e){return Xo()?(qo(e),!0):!1}const $e=new WeakMap,rn=(...e)=>{var t;const o=e[0],r=(t=mo())==null?void 0:t.proxy;if(r==null&&!po())throw new Error("injectLocal must be called in setup");return r&&$e.has(r)&&o in $e.get(r)?$e.get(r)[o]:Z(...e)},nn=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const ln=Object.prototype.toString,an=e=>ln.call(e)==="[object Object]";function ro(e){return e.endsWith("rem")?Number.parseFloat(e)*16:Number.parseFloat(e)}function Oe(e){return Array.isArray(e)?e:[e]}function sn(e,t,o){return so(e,t,{...o,immediate:!0})}const So=nn?window:void 0;function cn(e){var t;const o=le(e);return(t=o?.$el)!=null?t:o}function dn(...e){const t=[],o=()=>{t.forEach(s=>s()),t.length=0},r=(s,l,u,b)=>(s.addEventListener(l,u,b),()=>s.removeEventListener(l,u,b)),a=k(()=>{const s=Oe(le(e[0])).filter(l=>l!=null);return s.every(l=>typeof l!="string")?s:void 0}),n=sn(()=>{var s,l;return[(l=(s=a.value)==null?void 0:s.map(u=>cn(u)))!=null?l:[So].filter(u=>u!=null),Oe(le(a.value?e[1]:e[0])),Oe(V(a.value?e[2]:e[1])),le(a.value?e[3]:e[2])]},([s,l,u,b])=>{if(o(),!s?.length||!l?.length||!u?.length)return;const A=an(b)?{...b}:b;t.push(...s.flatMap(x=>l.flatMap(y=>u.map(w=>r(x,y,w,A)))))},{flush:"post"}),c=()=>{n(),o()};return tn(o),c}function un(){const e=pe(!1),t=mo();return t&&no(()=>{e.value=!0},t),e}function hn(e){const t=un();return k(()=>(t.value,!!e()))}const vn=Symbol("vueuse-ssr-width");function mn(){const e=po()?rn(vn,null):null;return typeof e=="number"?e:void 0}function pn(e,t={}){const{window:o=So,ssrWidth:r=mn()}=t,a=hn(()=>o&&"matchMedia"in o&&typeof o.matchMedia=="function"),n=pe(typeof r=="number"),c=pe(),s=pe(!1),l=u=>{s.value=u.matches};return fe(()=>{if(n.value){n.value=!a.value;const u=le(e).split(",");s.value=u.some(b=>{const A=b.includes("not all"),x=b.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/),y=b.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);let w=!!(x||y);return x&&w&&(w=r>=ro(x[1])),y&&w&&(w=r<=ro(y[1])),A?!w:w});return}a.value&&(c.value=o.matchMedia(le(e)),s.value=c.value.matches)}),dn(c,"change",l,{passive:!0}),k(()=>s.value)}const fn=["src"],gn={key:0},bn={class:"topbar-left"},xn={type:"button",class:"user-menu-trigger","aria-label":"打开用户菜单"},wn={class:"user-summary"},Cn={class:"user-name"},kn={key:0,class:"user-role"},yn={class:"drawer-brand"},zn=["src"],In=H({__name:"AppLayout",setup(e){const t=tt(),o=nt(),r=Qo(),a=Zo(),n=F(!1),c=pn("(max-width: 768px)"),s=F(!1),l=()=>{s.value=!1},u=y=>()=>h(Je,null,{default:()=>h(y)}),b=(y,w,_)=>({label:()=>h(it,{to:{name:w},onClick:l},{default:()=>y}),key:w,icon:u(_)}),A=k(()=>{const y=[b("工作台","dashboard",Pr),b("备忘录","memos",Mr)];return a.isLiteMode?y.push(b("二级库","warehouse-lite",to)):y.push({label:"二级库",key:"warehouse-group",icon:u(to),children:[b("库存查询","stock",Qr),b("物资档案","stock-materials",$r),b("操作记录","operations",on),...r.can("warehouse:write")?[b("入库","inbound",fr),b("出库","outbound",br)]:[]]}),y.push(b("华星总库存","hua-xing-stock",kr)),y.push({label:"申购管理",key:"procurement-group",icon:u(Sr),children:[b("申购计划","purchase-materials",Hr),b("周期性计划","purchase-plan-templates",zr),b("未编码物资","uncoded-materials",mr),b("物料编码库","material-code-library",wr),b("申购记录","purchase-records",Xr)]}),r.can("settings:write")&&y.push({label:"系统管理",key:"settings-group",icon:u(Jr),children:[b("管理端用户","users",Kr),b("小程序用户","mini-program-users",Yr),b("高级设置","advanced-settings",Vr),b("分享链接","share-links",Nr),b("关于","about",jr)]}),y});function x(){r.logout(),o.push({name:"login"})}return(y,w)=>{const _=hr,$=tr,P=kt,q=xt,K=fo,D=Qt,B=rt("router-view"),m=Gt,C=Yt,E=Lt;return O(),j(vo,null,[Y(C,{"has-sider":!V(c),class:"app-shell"},{default:G(()=>[V(c)?ee("",!0):(O(),de($,{key:0,bordered:"","collapse-mode":"width","collapsed-width":64,width:220,collapsed:n.value,"show-trigger":"",onCollapse:w[0]||(w[0]=I=>n.value=!0),onExpand:w[1]||(w[1]=I=>n.value=!1)},{default:G(()=>[f("div",{class:Jo(["brand",{compact:n.value}])},[f("img",{class:"brand-mark",src:V(Ze),alt:"系统 Logo"},null,8,fn),n.value?ee("",!0):(O(),j("span",gn,"电气车间备件"))],2),Y(_,{collapsed:n.value,"collapsed-width":64,"collapsed-icon-size":22,options:A.value,value:String(V(t).name||"")},null,8,["collapsed","options","value"])]),_:1},8,["collapsed"])),Y(C,null,{default:G(()=>[Y(D,{bordered:"",class:"topbar"},{default:G(()=>[f("div",bn,[V(c)?(O(),j("button",{key:0,type:"button",class:"menu-toggle","aria-label":"打开导航菜单",onClick:w[2]||(w[2]=I=>s.value=!0)},[Y(V(Je),{size:20},{default:G(()=>[Y(V(Fr))]),_:1})])):ee("",!0),Y(q,null,{default:G(()=>[V(c)?ee("",!0):(O(),de(P,{key:0},{default:G(()=>[...w[4]||(w[4]=[qe("备件管理",-1)])]),_:1})),Y(P,null,{default:G(()=>[qe(Me(V(t).meta.title),1)]),_:1})]),_:1})]),Y(K,{options:[{label:"退出登录",key:"logout"}],onSelect:x},{default:G(()=>[f("button",xn,[f("span",wn,[f("span",Cn,Me(V(r).user?.display_name||V(r).user?.username),1),V(c)?ee("",!0):(O(),j("span",kn,Me(V(r).user?V(et)[V(r).user.role]:""),1))]),w[5]||(w[5]=f("span",{class:"user-menu-caret","aria-hidden":"true"},null,-1))])]),_:1})]),_:1}),Y(m,{class:"app-content","native-scrollbar":!1},{default:G(()=>[Y(B,null,{default:G(({Component:I,route:L})=>[(O(),de(ot,null,[L.meta.keepAlive?(O(),de(Qe(I),{key:String(L.name)})):ee("",!0)],1024)),L.meta.keepAlive?ee("",!0):(O(),de(Qe(I),{key:0}))]),_:1})]),_:1})]),_:1})]),_:1},8,["has-sider"]),Y(E,{show:s.value,"onUpdate:show":w[3]||(w[3]=I=>s.value=I),placement:"left",width:250,"aria-label":"导航菜单"},{default:G(()=>[f("div",yn,[f("img",{class:"brand-mark",src:V(Ze),alt:"系统 Logo"},null,8,zn),w[6]||(w[6]=f("span",null,"电气车间备件",-1))]),Y(_,{class:"drawer-menu",options:A.value,value:String(V(t).name||""),"onUpdate:value":l},null,8,["options","value"])]),_:1},8,["show"])],64)}}}),jn=ht(In,[["__scopeId","data-v-bd7e331b"]]);export{jn as default};
