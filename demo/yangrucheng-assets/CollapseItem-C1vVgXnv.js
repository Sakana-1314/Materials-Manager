import{d as P,l as s,m as H,n as u,q as x,s as l,p as z,ac as W,ab as O,t as D,r as V,v as T,O as k,x as q,y as N,z as K,A as Z,a6 as I,ai as G,K as J,bb as Q,C as F,N as X,b4 as $,bc as Y,ak as ee,af as re,b6 as te,aa as ae,H as oe}from"./index-DwihmnM-.js";import{u as le}from"./get-DOpsLziV.js";import{h as A}from"./create-C3AF4KAt.js";import{C as ne}from"./ChevronRight-0aSDIZSO.js";const se=P({name:"ChevronLeft",render(){return s("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},s("path",{d:"M10.3536 3.14645C10.5488 3.34171 10.5488 3.65829 10.3536 3.85355L6.20711 8L10.3536 12.1464C10.5488 12.3417 10.5488 12.6583 10.3536 12.8536C10.1583 13.0488 9.84171 13.0488 9.64645 12.8536L5.14645 8.35355C4.95118 8.15829 4.95118 7.84171 5.14645 7.64645L9.64645 3.14645C9.84171 2.95118 10.1583 2.95118 10.3536 3.14645Z",fill:"currentColor"}))}});function ie(e){const{fontWeight:i,textColor1:n,textColor2:a,textColorDisabled:d,dividerColor:r,fontSize:c}=e;return{titleFontSize:c,titleFontWeight:i,dividerColor:r,titleTextColor:n,titleTextColorDisabled:d,fontSize:c,textColor:a,arrowColor:a,arrowColorDisabled:d,itemMargin:"16px 0 0 0",titlePadding:"16px 0 0 0"}}const de={common:H,self:ie},ce=u("collapse","width: 100%;",[u("collapse-item",`
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 margin: var(--n-item-margin);
 `,[x("disabled",[l("header","cursor: not-allowed;",[l("header-main",`
 color: var(--n-title-text-color-disabled);
 `),u("collapse-item-arrow",`
 color: var(--n-arrow-color-disabled);
 `)])]),u("collapse-item","margin-left: 32px;"),z("&:first-child","margin-top: 0;"),z("&:first-child >",[l("header","padding-top: 0;")]),x("left-arrow-placement",[l("header",[u("collapse-item-arrow","margin-right: 4px;")])]),x("right-arrow-placement",[l("header",[u("collapse-item-arrow","margin-left: 4px;")])]),l("content-wrapper",[l("content-inner","padding-top: 16px;"),W({duration:"0.15s"})]),x("active",[l("header",[x("active",[u("collapse-item-arrow","transform: rotate(90deg);")])])]),z("&:not(:first-child)","border-top: 1px solid var(--n-divider-color);"),O("disabled",[x("trigger-area-main",[l("header",[l("header-main","cursor: pointer;"),u("collapse-item-arrow","cursor: default;")])]),x("trigger-area-arrow",[l("header",[u("collapse-item-arrow","cursor: pointer;")])]),x("trigger-area-extra",[l("header",[l("header-extra","cursor: pointer;")])])]),l("header",`
 font-size: var(--n-title-font-size);
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 transition: color .3s var(--n-bezier);
 position: relative;
 padding: var(--n-title-padding);
 color: var(--n-title-text-color);
 `,[l("header-main",`
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 color: var(--n-title-text-color);
 `),l("header-extra",`
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),u("collapse-item-arrow",`
 display: flex;
 transition:
 transform .15s var(--n-bezier),
 color .3s var(--n-bezier);
 font-size: 18px;
 color: var(--n-arrow-color);
 `)])])]),pe=Object.assign(Object.assign({},T.props),{defaultExpandedNames:{type:[Array,String],default:null},expandedNames:[Array,String],arrowPlacement:{type:String,default:"left"},accordion:{type:Boolean,default:!1},displayDirective:{type:String,default:"if"},triggerAreas:{type:Array,default:()=>["main","extra","arrow"]},onItemHeaderClick:[Function,Array],"onUpdate:expandedNames":[Function,Array],onUpdateExpandedNames:[Function,Array],onExpandedNamesChange:{type:[Function,Array],validator:()=>!0,default:void 0}}),B=K("n-collapse"),ve=P({name:"Collapse",props:pe,slots:Object,setup(e,{slots:i}){const{mergedClsPrefixRef:n,inlineThemeDisabled:a,mergedRtlRef:d}=D(e),r=V(e.defaultExpandedNames),c=N(()=>e.expandedNames),v=le(c,r),C=T("Collapse","-collapse",ce,de,e,n);function p(m){const{"onUpdate:expandedNames":o,onUpdateExpandedNames:f,onExpandedNamesChange:y}=e;f&&I(f,m),o&&I(o,m),y&&I(y,m),r.value=m}function g(m){const{onItemHeaderClick:o}=e;o&&I(o,m)}function t(m,o,f){const{accordion:y}=e,{value:E}=v;if(y)m?(p([o]),g({name:o,expanded:!0,event:f})):(p([]),g({name:o,expanded:!1,event:f}));else if(!Array.isArray(E))p([o]),g({name:o,expanded:!0,event:f});else{const w=E.slice(),_=w.findIndex(S=>o===S);~_?(w.splice(_,1),p(w),g({name:o,expanded:!1,event:f})):(w.push(o),p(w),g({name:o,expanded:!0,event:f}))}}Z(B,{props:e,mergedClsPrefixRef:n,expandedNamesRef:v,slots:i,toggleItem:t});const h=k("Collapse",d,n),R=N(()=>{const{common:{cubicBezierEaseInOut:m},self:{titleFontWeight:o,dividerColor:f,titlePadding:y,titleTextColor:E,titleTextColorDisabled:w,textColor:_,arrowColor:S,fontSize:L,titleFontSize:M,arrowColorDisabled:U,itemMargin:j}}=C.value;return{"--n-font-size":L,"--n-bezier":m,"--n-text-color":_,"--n-divider-color":f,"--n-title-padding":y,"--n-title-font-size":M,"--n-title-text-color":E,"--n-title-text-color-disabled":w,"--n-title-font-weight":o,"--n-arrow-color":S,"--n-arrow-color-disabled":U,"--n-item-margin":j}}),b=a?q("collapse",void 0,R,e):void 0;return{rtlEnabled:h,mergedTheme:C,mergedClsPrefix:n,cssVars:a?void 0:R,themeClass:b?.themeClass,onRender:b?.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),s("div",{class:[`${this.mergedClsPrefix}-collapse`,this.rtlEnabled&&`${this.mergedClsPrefix}-collapse--rtl`,this.themeClass],style:this.cssVars},this.$slots)}}),me=P({name:"CollapseItemContent",props:{displayDirective:{type:String,required:!0},show:Boolean,clsPrefix:{type:String,required:!0}},setup(e){return{onceTrue:Q(F(e,"show"))}},render(){return s(G,null,{default:()=>{const{show:e,displayDirective:i,onceTrue:n,clsPrefix:a}=this,d=i==="show"&&n,r=s("div",{class:`${a}-collapse-item__content-wrapper`},s("div",{class:`${a}-collapse-item__content-inner`},this.$slots));return d?J(r,[[X,e]]):e?r:null}})}}),fe={title:String,name:[String,Number],disabled:Boolean,displayDirective:String},Ce=P({name:"CollapseItem",props:fe,setup(e){const{mergedRtlRef:i}=D(e),n=ee(),a=re(()=>{var t;return(t=e.name)!==null&&t!==void 0?t:n}),d=oe(B);d||te("collapse-item","`n-collapse-item` must be placed inside `n-collapse`.");const{expandedNamesRef:r,props:c,mergedClsPrefixRef:v,slots:C}=d,p=N(()=>{const{value:t}=r;if(Array.isArray(t)){const{value:h}=a;return!~t.findIndex(R=>R===h)}else if(t){const{value:h}=a;return h!==t}return!0});return{rtlEnabled:k("Collapse",i,v),collapseSlots:C,randomName:n,mergedClsPrefix:v,collapsed:p,triggerAreas:F(c,"triggerAreas"),mergedDisplayDirective:N(()=>{const{displayDirective:t}=e;return t||c.displayDirective}),arrowPlacement:N(()=>c.arrowPlacement),handleClick(t){let h="main";A(t,"arrow")&&(h="arrow"),A(t,"extra")&&(h="extra"),c.triggerAreas.includes(h)&&d&&!e.disabled&&d.toggleItem(p.value,a.value,t)}}},render(){const{collapseSlots:e,$slots:i,arrowPlacement:n,collapsed:a,mergedDisplayDirective:d,mergedClsPrefix:r,disabled:c,triggerAreas:v}=this,C=$(i.header,{collapsed:a},()=>[this.title]),p=i["header-extra"]||e["header-extra"],g=i.arrow||e.arrow;return s("div",{class:[`${r}-collapse-item`,`${r}-collapse-item--${n}-arrow-placement`,c&&`${r}-collapse-item--disabled`,!a&&`${r}-collapse-item--active`,v.map(t=>`${r}-collapse-item--trigger-area-${t}`)]},s("div",{class:[`${r}-collapse-item__header`,!a&&`${r}-collapse-item__header--active`]},s("div",{class:`${r}-collapse-item__header-main`,onClick:this.handleClick},n==="right"&&C,s("div",{class:`${r}-collapse-item-arrow`,key:this.rtlEnabled?0:1,"data-arrow":!0},$(g,{collapsed:a},()=>[s(ae,{clsPrefix:r},{default:()=>this.rtlEnabled?s(se,null):s(ne,null)})])),n==="left"&&C),Y(p,{collapsed:a},t=>s("div",{class:`${r}-collapse-item__header-extra`,onClick:this.handleClick,"data-extra":!0},t))),s(me,{clsPrefix:r,displayDirective:d,show:!a},i))}});export{ve as _,Ce as a};
