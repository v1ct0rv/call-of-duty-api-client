(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{401:function(e,t,r){},402:function(e,t,r){},465:function(e,t,r){"use strict";r.r(t);var n,a=r(0),i=r.n(a),c=r(18),o=r.n(c),s=(r(401),r(402),r(22)),f=r(255),b=r.n(f),l=r(371),j=r.n(l),u=r(381),d=r.n(u),O=r(372),p=r.n(O),m=r(379),g=r.n(m),x=r(264),h=r.n(x),P=r(263),y=r.n(P),w=r(373),R=r.n(w),v=r(374),S=r.n(v),F=r(376),k=r.n(F),C=r(377),M=r.n(C),T=r(378),D=r.n(T),_=r(382),I=r.n(_),N=r(375),$=r.n(N),B=r(380),G=r.n(B),U=r(383),W=r.n(U),A=r(368),E=r(503),K=r(504),q=r(505),J=new E.a({uri:"/graphql",cache:new K.a}),L=Object(q.a)(n||(n=Object(A.a)(["\n  query($page: Int, $perPage: Int, $sort: SortFindManybrstatsInput, $filter:  FilterFindManybrstatsInput){\n    brStatPagination(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n      count\n      pageInfo {\n        pageCount\n        itemCount\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        lastUpdate\n        platform\n        username\n        br {\n          wins\n          kills\n          deaths\n          kdRatio\n          timePlayed\n          gamesPlayed\n          downs\n          revives\n          scorePerMinute\n          topFive\n          topTen\n          topTwentyFive\n          winsPercent\n          killsPerGame\n          gamesPerWin\n          killsPerMin\n        }\n      }\n    }\n  }\n"]))),z=r(25),H={Add:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(j.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Check:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(p.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Clear:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(y.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Delete:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(R.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),DetailPanel:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(h.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Edit:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(S.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Export:Object(a.forwardRef)((function(e,t){return Object(z.jsx)($.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Filter:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(k.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),FirstPage:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(M.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),LastPage:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(D.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),NextPage:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(h.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),PreviousPage:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(g.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),ResetSearch:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(y.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),Search:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(G.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),SortArrow:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(d.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),ThirdStateCheck:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(I.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))})),ViewColumn:Object(a.forwardRef)((function(e,t){return Object(z.jsx)(W.a,Object(s.a)(Object(s.a)({},e),{},{ref:t}))}))},Q=[{title:"User name",field:"username"},{title:"Wins",field:"br.wins",type:"numeric"},{title:"KD",field:"br.kdRatio",type:"numeric",render:function(e){return e.br.kdRatio.toFixed(2)},defaultSort:"desc"},{title:"Games",field:"br.gamesPlayed",type:"numeric"},{title:"% Wins",field:"br.winsPercent",type:"numeric",render:function(e){return e.br.winsPercent.toFixed(2)}},{title:"Games x Win",field:"br.gamesPerWin",type:"numeric",render:function(e){return e.br.gamesPerWin.toFixed(2)}},{title:"Time Played",field:"br.timePlayed",type:"numeric",render:function(e){var t=function(e){e=Number(e);var t=Math.floor(e/86400),r=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),a=Math.floor(e%60);return{d:t,h:r,m:n,s:a}}(e.br.timePlayed);return Object(z.jsxs)("div",{children:[t.d,Object(z.jsx)("span",{className:"small",children:"D "}),t.h,Object(z.jsx)("span",{className:"small",children:"H "}),t.m,Object(z.jsx)("span",{className:"small",children:"MIN "})]})}},{title:"Kills",field:"br.kills",type:"numeric"},{title:"Deaths",field:"br.deaths",type:"numeric"},{title:"Kills x Game",field:"br.killsPerGame",type:"numeric",render:function(e){return e.br.killsPerGame.toFixed(2)}},{title:"Kills x Min",field:"br.killsPerMin",type:"numeric",render:function(e){return e.br.killsPerMin.toFixed(2)}},{title:"Top 5",field:"br.topFive",type:"numeric"},{title:"Top 10",field:"br.topTen",type:"numeric"},{title:"Top 25",field:"br.topTwentyFive",type:"numeric"},{title:"LastUpdate",field:"lastUpdate",type:"time",sorting:!1}],V=function(e){return console.log("Query object - ",e),J.query({query:L,variables:{page:0,perPage:50,sort:X(e),filter:Y(e)}}).then((function(t){return console.dir(e),{data:JSON.parse(JSON.stringify(t.data.brStatPagination.items)),page:e.page,totalCount:t.data.brStatPagination.count}}))};function X(e){return e.orderBy?"asc"===e.orderDirection?"".concat(e.orderBy.field.toUpperCase().replace(".","__"),"_ASC"):"".concat(e.orderBy.field.toUpperCase().replace(".","__"),"_DESC"):"BR__KDRATIO_DESC"}function Y(e){var t={_operators:{date:{gte:(new Date).toISOString().substring(0,10)}}};return e.search&&""!==e.search?(t._operators.username={regex:e.search},t):t}var Z=function(e){return Object(z.jsx)("div",{children:Object(z.jsx)(b.a,{icons:H,columns:Q,data:V,title:"Hackzone Team",options:{toolbar:!0,sorting:!0,draggable:!1,pageSize:20,thirdSortClick:!1,exportButton:!0}})})};var ee=function(){return Object(z.jsx)("div",{className:"App",children:Object(z.jsx)("div",{style:{width:"80%",margin:"40px auto"},children:Object(z.jsx)(Z,{})})})},te=function(e){e&&e instanceof Function&&r.e(6).then(r.bind(null,662)).then((function(t){var r=t.getCLS,n=t.getFID,a=t.getFCP,i=t.getLCP,c=t.getTTFB;r(e),n(e),a(e),i(e),c(e)}))};o.a.render(Object(z.jsx)(i.a.StrictMode,{children:Object(z.jsx)(ee,{})}),document.getElementById("root")),te()}},[[465,1,2]]]);
//# sourceMappingURL=main.bc52dd96.chunk.js.map