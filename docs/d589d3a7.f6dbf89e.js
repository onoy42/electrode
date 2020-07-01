(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{162:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return l})),a.d(t,"metadata",(function(){return b})),a.d(t,"rightToc",(function(){return i})),a.d(t,"default",(function(){return p}));var n=a(2),c=a(12),r=(a(0),a(173)),l={id:"getting-started",title:"Getting started"},b={id:"getting-started",isDocsHomePage:!1,title:"Getting started",description:"Building large scale universal React Web Applications",source:"@site/docs/getting-started.md",permalink:"/electrode/docs/getting-started",editUrl:"https://github.com/electrode-io/electrode/tree/master/docusaurus/docs/docs/getting-started.md",sidebar:"someSidebar",previous:{title:"Glossary",permalink:"/electrode/docs/glossary"}},i=[{value:"Building large scale universal React Web Applications",id:"building-large-scale-universal-react-web-applications",children:[{value:"Quick start",id:"quick-start",children:[]},{value:"<code>@xarc</code> npm Scope",id:"xarc-npm-scope",children:[]},{value:"Essentials",id:"essentials",children:[]}]},{value:"License",id:"license",children:[]}],o={rightToc:i};function p(e){var t=e.components,a=Object(c.a)(e,["components"]);return Object(r.b)("wrapper",Object(n.a)({},o,a,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h2",{id:"building-large-scale-universal-react-web-applications"},"Building large scale universal React Web Applications"),Object(r.b)("p",null,"Electrode was developed as the engine that has been powering the ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"http://www.walmart.com"}),"http://www.walmart.com")," eCommerce website since 2016."),Object(r.b)("p",null,"Electrode Web is a rapid application development framework; a full stack, end-to-end platform for developing, deploying, and maintaining JavaScript applications at Walmart."),Object(r.b)("div",{className:"admonition admonition-important alert alert--info"},Object(r.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(r.b)("h5",{parentName:"div"},Object(r.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(r.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(r.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})))),"important")),Object(r.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(r.b)("p",{parentName:"div"},Object(r.b)("strong",{parentName:"p"},"Do you have 5 minutes?")," That is how long it takes to scaffold your first app."),Object(r.b)("p",{parentName:"div"},"Try it now!"))),Object(r.b)("h3",{id:"quick-start"},"Quick start"),Object(r.b)("h4",{id:"development-on-your-local-machine"},"Development on your local machine"),Object(r.b)("p",null,"To generate and deploy your Electrode app and Electrode components, install the following (if you have not already):"),Object(r.b)("ol",null,Object(r.b)("li",{parentName:"ol"},Object(r.b)("p",{parentName:"li"},"Install the ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"https://nodejs.org/en/download"}),"node.js")," version 10.x.x or later"),Object(r.b)("ul",{parentName:"li"},Object(r.b)("li",{parentName:"ul"},"We recommend a tool such as ",Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"https://github.com/nvm-sh/nvm#install-script"}),"nvm")," for managing node.js installations."),Object(r.b)("li",{parentName:"ul"},"If you are on Windows, then ",Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"https://www.npmjs.com/package/@jchip/nvm"}),"universal nvm")," is recommended."))),Object(r.b)("li",{parentName:"ol"},Object(r.b)("p",{parentName:"li"},"To build an app scaffold, run the following command in your console/terminal:"))),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"npx @xarc/create-app my-app\n")),Object(r.b)("ol",{start:3},Object(r.b)("li",{parentName:"ol"},"Wait for this to complete. The console will display the following with some instructions:")),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"Created react/node webapp in directory 'my-app'\n")),Object(r.b)("ol",{start:4},Object(r.b)("li",{parentName:"ol"},"Follow the instructions outlined in the console."),Object(r.b)("li",{parentName:"ol"},"When complete, open your browser to ",Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"http://localhost:3000"}),"localhost:3000")),Object(r.b)("li",{parentName:"ol"},"To stop the DEV server, press ",Object(r.b)("inlineCode",{parentName:"li"},"Q"))),Object(r.b)("p",null,"Your new electrode app will appear as shown below."),Object(r.b)("p",null,Object(r.b)("img",Object(n.a)({parentName:"p"},{src:"/electrode/img/electrode-first-run.png",alt:"Hello from Electrode"}))),Object(r.b)("div",{className:"admonition admonition-important alert alert--info"},Object(r.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(r.b)("h5",{parentName:"div"},Object(r.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(r.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(r.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})))),"Important: Existing electrode users")),Object(r.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(r.b)("p",{parentName:"div"},"If you are an existing electrode user, please take note of the following sections"))),Object(r.b)("h3",{id:"xarc-npm-scope"},Object(r.b)("inlineCode",{parentName:"h3"},"@xarc")," npm Scope"),Object(r.b)("p",null,"New Electrode X packages are published under the npm scope ",Object(r.b)("inlineCode",{parentName:"p"},"@xarc"),", where arc is inspired by <",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"http://www.twi-global.com/technical-knowledge/faqs/what-is-arc-welding%3E"}),"www.twi-global.com/technical-knowledge/faqs/what-is-arc-welding>")),Object(r.b)("h3",{id:"essentials"},"Essentials"),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Package"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Corresponding old package"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/app"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"JS server runtime support for electrode X"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"electrode-archetype-react-app")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/app-dev"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"dev support for electrode X"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"electrode-archetype-react-app-dev")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/webpack"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"default webpack configs"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"N/A")))),Object(r.b)("h4",{id:"optionals"},"Optionals"),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Package"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/config-jest")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/config-karma")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/config-mocha")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/ui-config")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/ui-logger")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/dll")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/dll-dev")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/config-eslint")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"@xarc/create-app")))),Object(r.b)("h2",{id:"license"},"License"),Object(r.b)("p",null,"Copyright (c) 2016-present, Walmart"),Object(r.b)("p",null,"Licensed under the ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"https://www.apache.org/licenses/LICENSE-2.0"}),"Apache License, Version 2.0")))}p.isMDXComponent=!0}}]);