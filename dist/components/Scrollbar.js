import{jsx as $}from"react/jsx-runtime";import{useEffect as C}from"react";const s="ktn-themed-scrollbar-styles",e="ktn-themed-scrollbar";function P(){if(typeof document>"u"||document.getElementById(s)!=null)return;const t=document.createElement("style");t.id=s,t.textContent=`
.${e} {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ktn-text-secondary, #94a3b8) 58%, transparent) transparent;
}

.${e}::-webkit-scrollbar {
  width: 0.6rem;
  height: 0.6rem;
}

.${e}::-webkit-scrollbar-track {
  background: transparent;
}

.${e}::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ktn-text-secondary, #94a3b8) 58%, transparent);
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.${e}::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 42%, var(--ktn-text-secondary, #94a3b8));
  border: 2px solid transparent;
  background-clip: padding-box;
}

.${e}::-webkit-scrollbar-corner {
  background: transparent;
}
`,document.head.appendChild(t)}function D({children:t,axis:l="y",onAction:d,className:b="",style:u,onScroll:p,onFocus:f,onBlur:h,role:m,tabIndex:S,["aria-label"]:v,["aria-labelledby"]:i,...x}){C(()=>{P()},[]);const g=l==="both"?{overflowX:"auto",overflowY:"auto"}:l==="x"?{overflowX:"auto",overflowY:"hidden"}:{overflowX:"hidden",overflowY:"auto"},y=`${e} ${b}`.trim(),k={...g,...u},n=m??"region",a=n==="presentation"||n==="none",E=S??(a?void 0:0),w=a?void 0:v??(i==null?"Scrollable content":void 0);function c(r,L,o){d?.({source:r,axis:l,scrollTop:o.scrollTop,scrollLeft:o.scrollLeft,scrollHeight:o.scrollHeight,scrollWidth:o.scrollWidth,clientHeight:o.clientHeight,clientWidth:o.clientWidth,event:L})}function A(r){p?.(r),r.defaultPrevented||c("scroll",r,r.currentTarget)}function T(r){f?.(r),r.defaultPrevented||c("focus",r,r.currentTarget)}function H(r){h?.(r),r.defaultPrevented||c("blur",r,r.currentTarget)}return $("div",{className:y,style:k,role:n,tabIndex:E,"aria-label":w,"aria-labelledby":i,onScroll:A,onFocus:T,onBlur:H,...x,children:t})}export{D as Scrollbar};
