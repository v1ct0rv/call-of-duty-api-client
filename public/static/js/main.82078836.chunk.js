(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{401:function(e,t,r){},402:function(e,t,r){},465:function(e,t,r){"use strict";r.r(t);var n,a=r(0),c=r.n(a),i=r(18),o=r.n(i),s=(r(401),r(402),r(22)),f=r(255),b=r.n(f),j=r(371),u=r.n(j),d=r(381),l=r.n(d),O=r(372),p=r.n(O),m=r(379),g=r.n(m),x=r(264),h=r.n(x),y=r(263),P=r.n(y),w=r(373),R=r.n(w),v=r(374),S=r.n(v),C=r(376),F=r.n(C),T=r(377),k=r.n(T),D=r(378),_=r.n(D),I=r(382),N=r.n(I),M=r(375),$=r.n(M),B=r(380),U=r.n(B),W=r(383),A=r.n(W),E=r(368),q=r(503),J=r(504),L=r(505),K=new q.a({uri:"/graphql",cache:new J.a}),z=Object(L.a)(n||(n=Object(E.a)(["\n  query($page: Int, $perPage: Int, $sort: SortFindManybrstatsInput, $filter:  FilterFindManybrstatsInput){\n    brStatPagination(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n      count\n      pageInfo {\n        pageCount\n        itemCount\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        lastUpdate\n        platform\n        username\n        br {\n          wins\n          kills\n          deaths\n          kdRatio\n          timePlayed\n          gamesPlayed\n          downs\n          revives\n          scorePerMinute\n          topFive\n          topTen\n          topTwentyFive\n          winsPercent\n          killsPerGame\n          gamesPerWin\n        }\n      }\n    }\n  }\n"]))),H=r(25),G={Add:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(u.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Check:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(p.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Clear:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(P.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Delete:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(R.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),DetailPanel:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(h.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Edit:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(S.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Export:Object(a.forwardRef)((function(e,t){return Object(H.jsx)($.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Filter:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(F.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),FirstPage:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(k.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),LastPage:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(_.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),NextPage:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(h.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),PreviousPage:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(g.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),ResetSearch:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(P.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Search:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(U.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),SortArrow:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(l.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),ThirdStateCheck:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(N.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),ViewColumn:Object(a.forwardRef)((function(e,t){return Object(H.jsx)(A.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))}))},Q=[{title:"User name",field:"username"},{title:"Wins",field:"br.wins",type:"numeric"},{title:"KD",field:"br.kdRatio",type:"numeric",render:function(e){return e.br.kdRatio.toFixed(2)},defaultSort:"desc"},{title:"Partidas",field:"br.gamesPlayed",type:"numeric"},{title:"% Wins",field:"br.winsPercent",type:"numeric",render:function(e){return e.br.winsPercent.toFixed(2)}},{title:"Partidas x W",field:"br.gamesPerWin",type:"numeric",render:function(e){return e.br.gamesPerWin.toFixed(2)}},{title:"Time Played",field:"br.timePlayed",type:"numeric",render:function(e){var t=function(e){e=Number(e);var t=Math.floor(e/86400),r=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),a=Math.floor(e%60);return{d:t,h:r,m:n,s:a}}(e.br.timePlayed);return Object(H.jsxs)("div",{children:[t.d,Object(H.jsx)("span",{className:"small",children:"D "}),t.h,Object(H.jsx)("span",{className:"small",children:"H "}),t.m,Object(H.jsx)("span",{className:"small",children:"MIN "})]})}},{title:"Kills",field:"br.kills",type:"numeric"},{title:"Deaths",field:"br.deaths",type:"numeric"},{title:"Top 5",field:"br.topFive",type:"numeric"},{title:"Top 10",field:"br.topTen",type:"numeric"},{title:"Top 25",field:"br.topTwentyFive",type:"numeric"},{title:"LastUpdate",field:"lastUpdate",type:"time",sorting:!1}],V=function(e){return console.log("Query object - ",e),K.query({query:z,variables:{page:0,perPage:50,sort:X(e),filter:Y(e)}}).then((function(t){return console.dir(e),{data:JSON.parse(JSON.stringify(t.data.brStatPagination.items)),page:e.page,totalCount:t.data.brStatPagination.count}}))};function X(e){return e.orderBy?"asc"===e.orderDirection?"".concat(e.orderBy.field.toUpperCase().replace(".","__"),"_ASC"):"".concat(e.orderBy.field.toUpperCase().replace(".","__"),"_DESC"):"BR__KDRATIO_DESC"}function Y(e){var t={_operators:{date:{gte:(new Date).toISOString().substring(0,10)}}};return e.search&&""!==e.search?(t._operators.username={regex:e.search},t):t}var Z=function(e){return Object(H.jsx)("div",{children:Object(H.jsx)(b.a,{icons:G,columns:Q,data:V,title:"Hackzone Team",options:{toolbar:!0,sorting:!0,draggable:!1,pageSize:20,thirdSortClick:!1,exportButton:!0}})})};var ee=function(){return Object(H.jsx)("div",{className:"App",children:Object(H.jsx)("div",{style:{width:"80%",margin:"40px auto"},children:Object(H.jsx)(Z,{})})})},te=function(e){e&&e instanceof Function&&r.e(6).then(r.bind(null,662)).then((function(t){var r=t.getCLS,n=t.getFID,a=t.getFCP,c=t.getLCP,i=t.getTTFB;r(e),n(e),a(e),c(e),i(e)}))};o.a.render(Object(H.jsx)(c.a.StrictMode,{children:Object(H.jsx)(ee,{})}),document.getElementById("root")),te()}},[[465,1,2]]]);
//# sourceMappingURL=main.82078836.chunk.js.map