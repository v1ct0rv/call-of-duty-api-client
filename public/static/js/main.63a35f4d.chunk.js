(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{401:function(e,t,r){},402:function(e,t,r){},465:function(e,t,r){"use strict";r.r(t);var n,a,i=r(0),c=r.n(i),o=r(18),s=r.n(o),f=(r(401),r(402),r(22)),b=r(255),l=r.n(b),j=r(371),u=r.n(j),d=r(381),O=r.n(d),p=r(372),m=r.n(p),g=r(379),x=r.n(g),h=r(264),P=r.n(h),y=r(263),w=r.n(y),R=r(373),v=r.n(R),S=r(374),F=r.n(S),k=r(376),C=r.n(k),M=r(377),T=r.n(M),D=r(378),_=r.n(D),I=r(382),N=r.n(I),$=r(375),B=r.n($),G=r(380),U=r.n(G),W=r(383),A=r.n(W),E=r(368),K=r(503),L=r(504),q=r(505),J=new K.a({uri:"/graphql",cache:new L.a}),z=Object(q.a)(n||(n=Object(E.a)(["\n  query($page: Int, $perPage: Int, $sort: SortFindManybrstatsInput, $filter:  FilterFindManybrstatsInput){\n    brStatPagination(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n      count\n      pageInfo {\n        pageCount\n        itemCount\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        lastUpdate\n        platform\n        username\n        teams\n        br {\n          wins\n          kills\n          deaths\n          kdRatio\n          timePlayed\n          gamesPlayed\n          downs\n          revives\n          scorePerMinute\n          topFive\n          topTen\n          topTwentyFive\n          winsPercent\n          killsPerGame\n          gamesPerWin\n          killsPerMin\n        }\n      }\n    }\n  }\n"]))),H=r(25),Q={Add:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(u.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),Check:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(m.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),Clear:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(w.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),Delete:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(v.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),DetailPanel:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(P.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),Edit:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(F.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),Export:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(B.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),Filter:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(C.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),FirstPage:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(T.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),LastPage:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(_.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),NextPage:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(P.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),PreviousPage:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(x.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),ResetSearch:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(w.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),Search:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(U.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),SortArrow:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(O.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),ThirdStateCheck:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(N.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))})),ViewColumn:Object(i.forwardRef)((function(e,t){return Object(H.jsx)(A.a,Object(f.a)(Object(f.a)({},e),{},{ref:t}))}))},V=[{title:"User name",field:"username"},{title:"Wins",field:"br.wins",type:"numeric"},{title:"KD",field:"br.kdRatio",type:"numeric",render:function(e){return e.br.kdRatio.toFixed(2)},defaultSort:"desc"},{title:"Games",field:"br.gamesPlayed",type:"numeric"},{title:"% Wins",field:"br.winsPercent",type:"numeric",render:function(e){return e.br.winsPercent.toFixed(2)}},{title:"Games x Win",field:"br.gamesPerWin",type:"numeric",render:function(e){return e.br.gamesPerWin.toFixed(2)}},{title:"Time Played",field:"br.timePlayed",type:"numeric",render:function(e){var t=function(e){e=Number(e);var t=Math.floor(e/86400),r=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),a=Math.floor(e%60);return{d:t,h:r,m:n,s:a}}(e.br.timePlayed);return Object(H.jsxs)("div",{children:[t.d,Object(H.jsx)("span",{className:"small",children:"D "}),t.h,Object(H.jsx)("span",{className:"small",children:"H "}),t.m,Object(H.jsx)("span",{className:"small",children:"MIN "})]})}},{title:"Kills",field:"br.kills",type:"numeric"},{title:"Deaths",field:"br.deaths",type:"numeric"},{title:"Kills x Game",field:"br.killsPerGame",type:"numeric",render:function(e){return e.br.killsPerGame.toFixed(2)}},{title:"Kills x Min",field:"br.killsPerMin",type:"numeric",render:function(e){return e.br.killsPerMin.toFixed(2)}},{title:"Top 5",field:"br.topFive",type:"numeric"},{title:"Top 10",field:"br.topTen",type:"numeric"},{title:"Top 25",field:"br.topTwentyFive",type:"numeric"},{title:"LastUpdate",field:"lastUpdate",type:"time",sorting:!1}],X=function(e){return console.log("Query object - ",e),J.query({query:z,variables:{page:0,perPage:50,sort:Y(e),filter:Z(e)}}).then((function(t){return console.dir(e),{data:JSON.parse(JSON.stringify(t.data.brStatPagination.items)),page:e.page,totalCount:t.data.brStatPagination.count}}))};function Y(e){return e.orderBy?"asc"===e.orderDirection?"".concat(e.orderBy.field.toUpperCase().replace(".","__"),"_ASC"):"".concat(e.orderBy.field.toUpperCase().replace(".","__"),"_DESC"):"BR__KDRATIO_DESC"}function Z(e){var t={_operators:{date:{gte:(new Date).toISOString().substring(0,10)},teams:{in:a.toLowerCase()}}};return e.search&&""!==e.search?(t._operators.username={regex:e.search},t):t}var ee=function(e){return a=e.team,Object(H.jsx)("div",{children:Object(H.jsx)(l.a,{icons:Q,columns:V,data:X,title:a+" Team",options:{toolbar:!0,sorting:!0,draggable:!1,pageSize:20,thirdSortClick:!1,exportButton:!0}})})};var te=function(){return Object(H.jsx)("div",{className:"App",children:Object(H.jsx)("div",{style:{width:"80%",margin:"40px auto"},children:Object(H.jsx)(ee,{team:"Hackzone"})})})},re=function(e){e&&e instanceof Function&&r.e(6).then(r.bind(null,662)).then((function(t){var r=t.getCLS,n=t.getFID,a=t.getFCP,i=t.getLCP,c=t.getTTFB;r(e),n(e),a(e),i(e),c(e)}))};s.a.render(Object(H.jsx)(c.a.StrictMode,{children:Object(H.jsx)(te,{})}),document.getElementById("root")),re()}},[[465,1,2]]]);
//# sourceMappingURL=main.63a35f4d.chunk.js.map