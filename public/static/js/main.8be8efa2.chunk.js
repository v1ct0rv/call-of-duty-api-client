(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{432:function(e,t,n){},434:function(e,t,n){},500:function(e,t,n){"use strict";n.r(t);var a,r,i=n(0),c=n.n(i),l=n(19),s=n.n(l),o=(n(432),n(433),n(434),n(21)),d=n(273),j=n.n(d),b=n(393),f=n.n(b),u=n(403),O=n.n(u),m=n(394),p=n.n(m),h=n(401),x=n.n(h),g=n(283),w=n.n(g),P=n(282),y=n.n(P),S=n(395),v=n.n(S),k=n(396),I=n.n(k),W=n(398),D=n.n(W),R=n(399),M=n.n(R),F=n(400),N=n.n(F),C=n(404),$=n.n(C),L=n(397),T=n.n(L),K=n(402),_=n.n(K),E=n(405),U=n.n(E),A=n(178),G=n(549),q=n(551),z=n(552),B=new G.a({uri:"/graphql",cache:new q.a}),J=Object(z.a)(a||(a=Object(A.a)(["\n  query($page: Int, $perPage: Int, $sort: SortFindManybrstatsInput, $filter:  FilterFindManybrstatsInput){\n    brStatPagination(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n      count\n      pageInfo {\n        pageCount\n        itemCount\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        lastUpdate\n        platform\n        username\n        teams\n        br {\n          wins\n          kills\n          deaths\n          kdRatio\n          timePlayed\n          gamesPlayed\n          downs\n          revives\n          scorePerMinute\n          topFive\n          topTen\n          topTwentyFive\n          winsPercent\n          killsPerGame\n          gamesPerWin\n          killsPerMin\n          lastWin {\n            matchID\n            date\n            playerStats {\n              kills\n              deaths\n              kdRatio\n              gulagDeaths\n            }\n          }\n        }\n      }\n    }\n  }\n"]))),H=n(152),V=n.n(H),Q=n(39),X=n(9),Y={Add:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(f.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),Check:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(p.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),Clear:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(y.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),Delete:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(v.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),DetailPanel:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(w.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),Edit:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(I.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),Export:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(T.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),Filter:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(D.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),FirstPage:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(M.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),LastPage:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(N.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),NextPage:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(w.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),PreviousPage:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(x.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),ResetSearch:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(y.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),Search:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(_.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),SortArrow:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(O.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),ThirdStateCheck:Object(i.forwardRef)((function(e,t){return Object(X.jsx)($.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))})),ViewColumn:Object(i.forwardRef)((function(e,t){return Object(X.jsx)(U.a,Object(o.a)(Object(o.a)({},e),{},{ref:t}))}))},Z=[{title:"User name",field:"username"},{title:"Wins",field:"br.wins",type:"numeric"},{title:"KD",field:"br.kdRatio",type:"numeric",render:function(e){return e.br.kdRatio.toFixed(2)},defaultSort:"desc"},{title:"LastWin",field:"br.lastWin.date",type:"datetime",render:function(e){return e.br.lastWin.matchID?Object(X.jsx)("span",{title:V()(e.br.lastWin.date).format("LLL"),children:Object(X.jsx)("a",{href:"https://wzstats.gg/match/".concat(e.br.lastWin.matchID,"/"),target:"_blank",rel:"noreferrer",children:V()(e.br.lastWin.date).fromNow()})}):Object(X.jsx)("span",{children:"Not Available yet"})}},{title:"Games",field:"br.gamesPlayed",type:"numeric"},{title:"% Wins",field:"br.winsPercent",type:"numeric",render:function(e){return e.br.winsPercent.toFixed(2)}},{title:"Games x Win",field:"br.gamesPerWin",type:"numeric",render:function(e){return e.br.gamesPerWin.toFixed(2)}},{title:"Time Played",field:"br.timePlayed",type:"numeric",render:function(e){var t=function(e){e=Number(e);var t=Math.floor(e/86400),n=Math.floor(e%86400/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60);return{d:t,h:n,m:a,s:r}}(e.br.timePlayed);return Object(X.jsxs)("div",{children:[t.d,Object(X.jsx)("span",{className:"small",children:"D "}),t.h,Object(X.jsx)("span",{className:"small",children:"H "}),t.m,Object(X.jsx)("span",{className:"small",children:"MIN "})]})}},{title:"Kills",field:"br.kills",type:"numeric"},{title:"Deaths",field:"br.deaths",type:"numeric"},{title:"Kills x Game",field:"br.killsPerGame",type:"numeric",render:function(e){return e.br.killsPerGame.toFixed(2)}},{title:"Kills x Min",field:"br.killsPerMin",type:"numeric",render:function(e){return e.br.killsPerMin.toFixed(2)}},{title:"Top 5",field:"br.topFive",type:"numeric"},{title:"Top 10",field:"br.topTen",type:"numeric"},{title:"Top 25",field:"br.topTwentyFive",type:"numeric"},{title:"LastUpdate",field:"lastUpdate",type:"time",sorting:!1}],ee=function(e){return B.query({query:J,variables:{page:0,perPage:50,sort:te(e),filter:ne(e)}}).then((function(t){return{data:JSON.parse(JSON.stringify(t.data.brStatPagination.items)),page:e.page,totalCount:t.data.brStatPagination.count}}))};function te(e){return e.orderBy?"asc"===e.orderDirection?"".concat(e.orderBy.field.toUpperCase().replaceAll(".","__"),"_ASC"):"".concat(e.orderBy.field.toUpperCase().replaceAll(".","__"),"_DESC"):"BR__KDRATIO_DESC"}function ne(e){var t={_operators:{date:{gte:(new Date).toISOString().substring(0,10)},teams:{in:r.toLowerCase()}}};return e.search&&""!==e.search?(t._operators.username={regex:e.search},t):t}var ae,re,ie=function(e){var t=Object(Q.f)().team;return r=t,Object(X.jsx)("div",{className:"App",children:Object(X.jsx)("div",{style:{width:"95%",margin:"40px auto"},children:Object(X.jsx)("div",{children:Object(X.jsx)(j.a,{icons:Y,columns:Z,data:ee,title:r+" Team",options:{toolbar:!0,sorting:!0,draggable:!0,pageSize:20,thirdSortClick:!1,exportButton:!0}})})})})},ce=n(149),le=n(548),se=n(546),oe=n(285),de=n(553),je=Object(z.a)(ae||(ae=Object(A.a)(["\nquery ($filter: FilterFindManyrebirthstatsInput!) {\n  rebirthStatMany(filter: $filter) {\n      username\n      wins\n      kdRatio\n      kills\n      deaths\n      winsPercent\n      gamesPerWin\n      timePlayed\n      lastWin {\n        matchID\n        date\n      }\n      lastUpdate\n      longestStreak\n      longestStreakWin\n      maxKills\n      maxKillsWin\n    }\n  }\n"]))),be=(Object(z.a)(re||(re=Object(A.a)(["\n  query($page: Int, $perPage: Int, $sort: SortFindManybrstatsInput, $filter:  FilterFindManybrstatsInput){\n    brStatPagination(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n      count\n      pageInfo {\n        pageCount\n        itemCount\n        hasNextPage\n        hasPreviousPage\n      }\n      items {\n        lastUpdate\n        platform\n        username\n        teams\n        br {\n          wins\n          kills\n          deaths\n          kdRatio\n          timePlayed\n          gamesPlayed\n          downs\n          revives\n          scorePerMinute\n          topFive\n          topTen\n          topTwentyFive\n          winsPercent\n          killsPerGame\n          gamesPerWin\n          killsPerMin\n          lastWin {\n            matchID\n            date\n            playerStats {\n              kills\n              deaths\n              kdRatio\n              gulagDeaths\n            }\n          }\n        }\n      }\n    }\n  }\n"]))),n(409));var fe=function(e,t){var n=Object(i.useState)((function(){return function(e,t){if("undefined"!==typeof window){var n=localStorage.getItem(e);return null!==n?JSON.parse(n):t}}(e,t)})),a=Object(ce.a)(n,2),r=a[0],c=a[1];return Object(i.useEffect)((function(){void 0===r?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(r))}),[e,r]),[r,c]},ue=n(550),Oe=function(e){var t=e.field||"";return Object(X.jsx)("td",{children:Object(X.jsx)("span",{title:V()(e.dataItem[t].date).format("LLL"),children:Object(X.jsx)("a",{href:"https://wzstats.gg/match/".concat(e.dataItem[t].matchID,"/"),target:"_blank",rel:" noreferrer",children:V()(e.dataItem[t].date).fromNow()})})})},me=function(e){var t=e.field||"",n=function(e){e=Number(e);var t=Math.floor(e/86400),n=Math.floor(e%86400/3600),a=Math.floor(e%3600/60),r=Math.floor(e%60);return{d:t,h:n,m:a,s:r}}(e.dataItem[t]);return Object(X.jsxs)("td",{children:[n.d,Object(X.jsx)("span",{className:"small",children:"D "}),n.h,Object(X.jsx)("span",{className:"small",children:"H "}),n.m,Object(X.jsx)("span",{className:"small",children:"MIN "})]})};var pe=function(e){var t=Object(Q.f)().team,n=Object(de.a)(je,{variables:{filter:{_operators:{date:{gte:(new Date).toISOString().substring(0,10)},teams:{in:[t.toLowerCase()]}}}}}),a=n.loading,r=n.error,l=n.data,s=c.a.useRef(null),d=fe("statsGridSort","maxKills"),j=Object(ce.a)(d,2),b=j[0],f=j[1],u=fe("statsGridSortOrder","desc"),O=Object(ce.a)(u,2),m=O[0],p=O[1],h=Object(i.useState)({gridDataState:{sort:[{field:b,dir:m}],skip:0,take:20}}),x=Object(ce.a)(h,2),g=x[0],w=x[1];return a?Object(X.jsx)("p",{children:"Loading..."}):r?Object(X.jsx)("p",{children:"Error :( "}):Object(X.jsx)("div",{className:"App",children:Object(X.jsx)("div",{style:{width:"95%",margin:"40px auto"},children:Object(X.jsx)(ue.a,{data:l.rebirthStatMany,ref:s,children:Object(X.jsxs)(le.a,Object(o.a)(Object(o.a)({data:Object(be.a)(l.rebirthStatMany,g.gridDataState)},g.gridDataState),{},{onDataStateChange:function(e){var t,n;f(null===(t=e.dataState.sort[0])||void 0===t?void 0:t.field),p(null===(n=e.dataState.sort[0])||void 0===n?void 0:n.dir),w({gridDataState:e.dataState})},sortable:!0,children:[Object(X.jsx)(se.a,{children:Object(X.jsx)("button",{title:"Export Excel",className:"k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary",onClick:function(){null!==s.current&&s.current.save()},children:"Export to Excel"})}),Object(X.jsx)(oe.a,{field:"username",title:"Username",width:"150px"}),Object(X.jsx)(oe.a,{field:"wins",title:"Wins",width:"80px"}),Object(X.jsx)(oe.a,{field:"maxKills",title:"Max Kills",width:"100px"}),Object(X.jsx)(oe.a,{field:"kdRatio",title:"KD",format:"{0:n2}",width:"60px"}),Object(X.jsx)(oe.a,{field:"lastWin",title:"LastWin",cell:Oe,width:"170px"}),Object(X.jsx)(oe.a,{field:"kills",title:"Kills",width:"90px"}),Object(X.jsx)(oe.a,{field:"deaths",title:"Deaths",width:"90px"}),Object(X.jsx)(oe.a,{field:"maxKillsWin",title:"maxKillsWin",width:"100px"}),Object(X.jsx)(oe.a,{field:"longestStreak",title:"Kill Streak",width:"100px"}),Object(X.jsx)(oe.a,{field:"longestStreakWin",title:"Kill Streak Win",width:"120px"}),Object(X.jsx)(oe.a,{field:"winsPercent",title:"% Wins",width:"120px",format:"{0:n2} %"}),Object(X.jsx)(oe.a,{field:"gamesPerWin",title:"gamesPerWin",width:"120px",format:"{0:n2}"}),Object(X.jsx)(oe.a,{field:"timePlayed",title:"timePlayed",width:"120px",cell:me}),Object(X.jsx)(oe.a,{field:"lastUpdate",title:"Last Update",cell:function(e){return Object(X.jsx)("td",{children:new Date(e.dataItem[e.field]).toLocaleString()})},format:"{0:d}"})]}))})})})},he=n(112),xe=n(547),ge=new G.a({uri:"/graphql",cache:new q.a});var we=function(){return Object(X.jsx)(xe.a,{client:ge,children:Object(X.jsx)(he.a,{children:Object(X.jsx)("div",{children:Object(X.jsxs)(Q.c,{children:[Object(X.jsx)(Q.a,{path:"/:team",exact:!0,children:Object(X.jsx)(ie,{})}),Object(X.jsx)(Q.a,{path:"/:team/rebirth",children:Object(X.jsx)(pe,{})}),Object(X.jsxs)(Q.a,{path:"/",children:["Please Select your Team:",Object(X.jsx)("nav",{children:Object(X.jsxs)("ul",{children:[Object(X.jsx)("li",{children:Object(X.jsx)(he.b,{to:"/hackzone",children:"Hackzone"})}),Object(X.jsx)("li",{children:Object(X.jsx)(he.b,{to:"/warzone",children:"Warzone"})}),Object(X.jsx)("li",{children:Object(X.jsx)(he.b,{to:"/a-team",children:"A-Team"})}),Object(X.jsx)("li",{children:Object(X.jsx)(he.b,{to:"/ortonators",children:"Ortonators"})})]})})]})]})})})})},Pe=function(e){e&&e instanceof Function&&n.e(6).then(n.bind(null,707)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,i=t.getLCP,c=t.getTTFB;n(e),a(e),r(e),i(e),c(e)}))};s.a.render(Object(X.jsx)(c.a.StrictMode,{children:Object(X.jsx)(we,{})}),document.getElementById("root")),Pe()}},[[500,1,2]]]);
//# sourceMappingURL=main.8be8efa2.chunk.js.map