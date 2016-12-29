// ==UserScript==
// @name         FactoryIdle eta display
// @namespace    https://github.com/Forecaster/factoryidle_eta_plugin
// @version      0.7
// @description  A plugin for FactoryIdle.com that displays time until a money goal is reached based on current income
// @author       Forecaster
// @match        http://factoryidle.com/
// @grant        none
// ==/UserScript==
(function(){var k="FactoryIdle eta display";function f(b){console.info("["+k+"] "+b)}f("Script Loaded");var s=[{id:"thousand",power:1000,keywords:["K","k","kilo","thousand","tho"]},{id:"million",power:1000000,keywords:["M","m","mega","million","mil"]},{id:"billion",power:1000000000,keywords:["G","g","giga","b","billion","bil"]},{id:"trillion",power:1000000000000,keywords:["T","t","tera","trillion","tri"]},{id:"quadrillion",power:1000000000000000,keywords:["P","p","peta","quadrillion","qua"]},{id:"quintillion",power:1000000000000000000,keywords:["E","e","exa","quintillion","qui"]},{id:"sextillion",power:1e+21,keywords:["Z","z","zetta","sextillion","sex"]}];if(!String.prototype.format){String.prototype.format=function(){var b=arguments;return this.replace(/{(\d+)}/g,function(i,D){return typeof b[D]!="undefined"?b[D]:i})}}function j(b){return !(typeof b=="undefined"||b===null)}function B(b){return A(b*1000)}function A(D){var G=D;if(D<0){D=D*-1}var I=D/1000;var F=Math.floor(I/60/60/24/30/12);I=I-(F*12*30*24*60*60);var i=Math.floor(I/60/60/24/30);I=I-(i*30*24*60*60);var b=Math.floor(I/60/60/24/7);I=I-(b*7*24*60*60);var J=Math.floor(I/60/60/24);I=I-(J*24*60*60);var H=Math.floor(I/60/60);I=I-(H*60*60);var E=Math.floor(I/60);I=I-(E*60);return{years:F,months:i,weeks:b,days:J,hours:H,minutes:E,seconds:Math.floor(I),input:G}}function h(E,D,H){var G="";var b=[];if(!j(H)){H=6}if(j(D)&&D){if(E.years>0){b.push(E.years+"y, ")}if(E.months>0){b.push(E.months+"m, ")}if(E.weeks>0){b.push(E.weeks+"w, ")}if(E.days>0){b.push(E.days+"d, ")}if(E.hours>0){b.push(E.hours+"h, ")}if(E.minutes>0){b.push(E.minutes+"m, ")}if(E.seconds>0){b.push(E.seconds+"s, ")}}else{if(E.years>0){b.push((E.years==1)?E.years+" year, ":E.years+" years, ")}if(E.months>0){b.push((E.months==1)?E.months+" month, ":E.months+" months, ")}if(E.weeks>0){b.push((E.weeks==1)?E.weeks+" week, ":E.weeks+" weeks, ")}if(E.days>0){b.push((E.days==1)?E.days+" day, ":E.days+" days, ")}if(E.hours>0){b.push((E.hours==1)?E.hours+" hour, ":E.hours+" hours, ")}if(E.minutes>0){b.push((E.minutes==1)?E.minutes+" minute, ":E.minutes+" minutes, ")}if(E.seconds>0){b.push((E.seconds==1)?E.seconds+" second, ":E.seconds+" seconds, ")}}for(var F=0;F<H&&F<b.length;F++){G+=b[F]}G=G.replace(/, $/,"");if(G.length===0){G="<0"}return G}function p(E){var D=E.target.getAttribute("data-setting");var i=E.target.getAttribute("data-setting-sub");var b=E.target.getAttribute("data-disabled");if(typeof b=="undefined"||b===null){b=false}if(typeof D=="undefined"||D===null||b=="true"){v[i][D]=E.target.checked}}function c(b){if(b.target.value=="top_left"){l.style.top="20px";l.style.left="20px";l.style.right=null;l.style.bottom=null}else{if(b.target.value=="top_right"){l.style.top="20px";l.style.left=null;l.style.right="20px";l.style.bottom=null}else{if(b.target.value=="bottom_left"){l.style.top=null;l.style.left="20px";l.style.right=null;l.style.bottom="20px"}else{if(b.target.value=="bottom_right"){l.style.top=null;l.style.left=null;l.style.right="20px";l.style.bottom="2opx"}}}}}var v={money:{generate_timer_link:true},research:{generate_timer_link:true}};var l=document.createElement("div");l.style.position="absolute";l.style.top="20px";l.style.right="20px";var m=document.createElement("div");var e=document.createElement("select");e.onchange=c;e.innerHTML="<option value='top_left'>Top Left</option><option value='top_right'>Top Right</option><option value='bottom_left'>Bottom Left</option><option value='bottom_right'>Bottom Right</option>";m.appendChild(e);var y=document.createElement("div");y.style.backgroundColor="white";y.style.color="black";y.style.padding="10px";y.style.border="4px solid orange";var r=document.createElement("div");r.id="calc_money_display";var g=document.createElement("div");g.id="calc_money_timer_link";var z=document.createElement("div");z.innerHTML="<input id='calc_money_goal' placeholder='Target (eg 5 mil or 5 million)' />";var x=document.createElement("div");x.style.backgroundColor="white";x.style.color="black";x.style.padding="10px";x.style.border="4px solid lightblue";var a=document.createElement("div");a.id="calc_research_display";var q=document.createElement("div");q.id="calc_research_timer_link";var n=document.createElement("div");n.innerHTML="<input id='calc_research_goal' placeholder='Target (eg 5 mil or 5 million)' />";y.appendChild(z);y.appendChild(r);y.appendChild(g);x.appendChild(n);x.appendChild(a);x.appendChild(q);l.appendChild(m);l.appendChild(y);l.appendChild(x);document.body.appendChild(l);var d="https://duckduckgo.com/?q=timer+{0}+seconds&ia=timer";var u=0;var C=0;function o(E,G){if(typeof E=="undefined"||E===null){E="money"}if(typeof G=="undefined"||G===null){G=document.getElementById("calc_money_display")}else{G=document.getElementById(G)}var O;if(E=="money"){O=document.getElementById("calc_money_timer_link")}else{if(E=="research"){O=document.getElementById("calc_research_timer_link")}}if(document.getElementById("factorySelection")!==null){var L=document.getElementById("calc_"+E+"_goal").value;if(L===""){G.innerHTML="No target set";return}L=L.replace(",","");L=L.replace(" ","");var S=/[\d\.]*([a-zA-Z]*)/;var D=1;var F=L.match(S);if(F.length==2){F=F[1];for(var I=0;I<s.length;I++){if(s[I].keywords.indexOf(F)>=0){D=s[I].power;I=100000}}}L=parseFloat(L)*D;var Q=document.getElementById("ticks").innerHTML;var b;if(E=="money"){b=document.getElementById("money").innerHTML}else{if(E=="research"){b=document.getElementById("researchPoints").innerHTML}}b=b.replace(" ","");D=1;F=b.match(S);if(F.length==2){F=F[1];for(var J=0;J<s.length;J++){if(s[J].keywords.indexOf(F)>=0){D=s[J].power;J=1000000}}}b=parseFloat(b)*D;var K=document.getElementsByClassName(E);C=0;for(I=2;I<K.length;I++){var N=K[I].innerHTML.replace(" ","").replace("+","");if(N>0){var M=C;C=parseFloat(C)+parseFloat(N)}}var R=Q*C;var H=L-b;if(!isNaN(H)){if(H>0){if(R>0){var P=H/R;G.innerHTML=h(B(P),true,2)}else{G.innerHTML="No income!"}}else{G.innerHTML="Goal reached!"}}else{G.innerHTML="Unable to calculate goal"}}else{G.innerHTML="Visit Factory Screen to update!"}}var t=document.getElementsByClassName("setting");for(var w=0;w<t.length;w++){t[w].onchange=p}f("Register interval");setInterval(function(){o("money","calc_money_display")},1000);setInterval(function(){o("research","calc_research_display")},1000)})();