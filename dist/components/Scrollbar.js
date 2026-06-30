import{jsx as L}from"react/jsx-runtime";import{useEffect as T}from"react";const i="ktn-themed-scrollbar-styles",o="ktn-themed-scrollbar";function H(){if(typeof document>"u"||document.getElementById(i)!=null)return;const e=document.createElement("style");e.id=i,e.textContent=`
.${o} {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ktn-text-secondary, #94a3b8) 58%, transparent) transparent;
}

.${o}::-webkit-scrollbar {
  width: 0.6rem;
  height: 0.6rem;
}

.${o}::-webkit-scrollbar-track {
  background: transparent;
}

.${o}::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ktn-text-secondary, #94a3b8) 58%, transparent);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.${o}::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 42%, var(--ktn-text-secondary, #94a3b8));
  border: 2px solid transparent;
  background-clip: padding-box;
}

.${o}::-webkit-scrollbar-corner {
  background: transparent;
}
`,document.head.appendChild(e)}function P({children:e,axis:l="y",onAction:a,className:s="",style:d,onScroll:b,onFocus:u,onBlur:p,role:f,tabIndex:h,["aria-label"]:m,["aria-labelledby"]:c,...S}){T(()=>{H()},[]);const v=l==="both"?{overflowX:"auto",overflowY:"auto"}:l==="x"?{overflowX:"auto",overflowY:"hidden"}:{overflowX:"hidden",overflowY:"auto"},x=`${o} ${s}`.trim(),g={...v,...d},y=m??(c==null?"Scrollable content":void 0);function n(r,A,t){a?.({source:r,axis:l,scrollTop:t.scrollTop,scrollLeft:t.scrollLeft,scrollHeight:t.scrollHeight,scrollWidth:t.scrollWidth,clientHeight:t.clientHeight,clientWidth:t.clientWidth,event:A})}function k(r){b?.(r),r.defaultPrevented||n("scroll",r,r.currentTarget)}function E(r){u?.(r),r.defaultPrevented||n("focus",r,r.currentTarget)}function w(r){p?.(r),r.defaultPrevented||n("blur",r,r.currentTarget)}return L("div",{className:x,style:g,role:f??"region",tabIndex:h??0,"aria-label":y,"aria-labelledby":c,onScroll:k,onFocus:E,onBlur:w,...S,children:e})}export{P as Scrollbar};
