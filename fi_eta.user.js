// ==UserScript==
// @name         FactoryIdle eta display
// @namespace    https://github.com/Forecaster/factoryidle_eta_plugin
// @version      0.9.1
// @description  A plugin for FactoryIdle.com that displays time until a money goal is reached based on current income
// @author       Forecaster
// @match        http://factoryidle.com/
// @grant        none
// ==/UserScript==
(function(){var n="FactoryIdle eta display";var e="0.9";function k(b){console.info("["+n+"] "+b)}k("Script Loaded");var v=[{id:"thousand",power:1000,keywords:["K","k","kilo","thousand","tho"]},{id:"million",power:1000000,keywords:["M","m","mega","million","mil"]},{id:"billion",power:1000000000,keywords:["G","g","giga","b","billion","bil"]},{id:"trillion",power:1000000000000,keywords:["T","t","tera","trillion","tri"]},{id:"quadrillion",power:1000000000000000,keywords:["P","p","peta","quadrillion","qua"]},{id:"quintillion",power:1000000000000000000,keywords:["E","e","exa","quintillion","qui"]},{id:"sextillion",power:1e+21,keywords:["Z","z","zetta","sextillion","sex"]}];if(!String.prototype.format){String.prototype.format=function(){var b=arguments;return this.replace(/{(\d+)}/g,function(i,H){return typeof b[H]!="undefined"?b[H]:i})}}function m(b){return !(typeof b=="undefined"||b===null)}function F(b){return E(b*1000)}function E(H){var K=H;if(H<0){H=H*-1}var M=H/1000;var J=Math.floor(M/60/60/24/30/12);M=M-(J*12*30*24*60*60);var i=Math.floor(M/60/60/24/30);M=M-(i*30*24*60*60);var b=Math.floor(M/60/60/24/7);M=M-(b*7*24*60*60);var N=Math.floor(M/60/60/24);M=M-(N*24*60*60);var L=Math.floor(M/60/60);M=M-(L*60*60);var I=Math.floor(M/60);M=M-(I*60);return{years:J,months:i,weeks:b,days:N,hours:L,minutes:I,seconds:Math.floor(M),input:K}}function l(I,H,L){var K="";var b=[];if(!m(L)){L=6}if(m(H)&&H){if(I.years>0){b.push(I.years+"y, ")}if(I.months>0){b.push(I.months+"m, ")}if(I.weeks>0){b.push(I.weeks+"w, ")}if(I.days>0){b.push(I.days+"d, ")}if(I.hours>0){b.push(I.hours+"h, ")}if(I.minutes>0){b.push(I.minutes+"m, ")}if(I.seconds>0){b.push(I.seconds+"s, ")}}else{if(I.years>0){b.push((I.years==1)?I.years+" year, ":I.years+" years, ")}if(I.months>0){b.push((I.months==1)?I.months+" month, ":I.months+" months, ")}if(I.weeks>0){b.push((I.weeks==1)?I.weeks+" week, ":I.weeks+" weeks, ")}if(I.days>0){b.push((I.days==1)?I.days+" day, ":I.days+" days, ")}if(I.hours>0){b.push((I.hours==1)?I.hours+" hour, ":I.hours+" hours, ")}if(I.minutes>0){b.push((I.minutes==1)?I.minutes+" minute, ":I.minutes+" minutes, ")}if(I.seconds>0){b.push((I.seconds==1)?I.seconds+" second, ":I.seconds+" seconds, ")}}for(var J=0;J<L&&J<b.length;J++){K+=b[J]}K=K.replace(/, $/,"");if(K.length===0){K="<0"}return K}function t(I){var H=I.target.getAttribute("data-setting");var i=I.target.getAttribute("data-setting-sub");var b=I.target.getAttribute("data-disabled");if(typeof b=="undefined"||b===null){b=false}if(typeof H=="undefined"||H===null||b=="true"){z[i][H]=I.target.checked}}function d(b){if(b.target.value=="top_left"){p.style.top="20px";p.style.left="20px";p.style.right=null;p.style.bottom=null}else{if(b.target.value=="top_right"){p.style.top="20px";p.style.left=null;p.style.right="20px";p.style.bottom=null}else{if(b.target.value=="bottom_left"){p.style.top=null;p.style.left="20px";p.style.right=null;p.style.bottom="20px"}else{if(b.target.value=="bottom_right"){p.style.top=null;p.style.left=null;p.style.right="20px";p.style.bottom="2opx"}}}}}function j(H){var L=/[-\d.]*([a-zA-Z]*)/;var J=1;var b=H.match(L);if(b.length==2){b=b[1];for(var I=0;I<v.length;I++){if(v[I].keywords.indexOf(b)>=0){J=v[I].power;I=100000}}}var K=parseFloat(H);if(!isNaN(K)){return K*J}else{return 0}}var z={money:{generate_timer_link:true},research:{generate_timer_link:true}};var p=document.createElement("div");p.style.position="absolute";p.style.top="20px";p.style.right="20px";p.innerHTML="<div>Version "+e+"</div>";var q=document.createElement("div");var h=document.createElement("select");h.onchange=d;h.innerHTML="<option value='top_left'>Top Left</option><option value='top_right'>Top Right</option><option value='bottom_left'>Bottom Left</option><option value='bottom_right'>Bottom Right</option>";q.appendChild(h);var D=document.createElement("div");D.style.backgroundColor="white";D.style.color="black";D.style.padding="10px";D.style.border="4px solid orange";var o=document.createElement("div");o.id="money_total_output";o.innerHTML="0";var C=document.createElement("div");C.innerHTML="<input id='calc_money_goal' placeholder='Target (eg 5 mil or 5 million)' />";var u=document.createElement("div");u.id="calc_money_display";var g=document.createElement("div");g.style.color="red";g.id="money_warning_output";var B=document.createElement("div");B.style.backgroundColor="white";B.style.color="black";B.style.padding="10px";B.style.border="4px solid lightblue";var a=document.createElement("div");a.id="research_total_output";a.innerHTML="0";var r=document.createElement("div");r.innerHTML="<input id='calc_research_goal' placeholder='Target (eg 5 mil or 5 million)' />";var c=document.createElement("div");c.id="calc_research_display";var y=document.createElement("div");y.style.color="red";y.id="research_warning_output";D.appendChild(o);D.appendChild(C);D.appendChild(u);D.appendChild(g);B.appendChild(a);B.appendChild(r);B.appendChild(c);B.appendChild(y);p.appendChild(q);p.appendChild(D);p.appendChild(B);document.body.appendChild(p);var f="https://duckduckgo.com/?q=timer+{0}+seconds&ia=timer";var x=0;var G=0;function s(i,I){var R;if(typeof i=="undefined"||i===null){i="money"}if(typeof I=="undefined"||I===null){R=document.getElementById("calc_money_display")}else{R=document.getElementById(I)}if(document.getElementById("factorySelection")!==null){var L=document.getElementById("calc_"+i+"_goal").value;if(L==""){R.innerHTML="No target set";return}L=L.replace(",","").replace(" ","");var K=parseFloat(L);L=j(L);if(K.length!=L.length){document.getElementById(i+"_warning_output").innerHTML="Invalid operator ignored!"}var Q=document.getElementById("ticks").innerHTML;var b;if(i=="money"){b=document.getElementById("money").innerHTML}else{if(i=="research"){b=document.getElementById("researchPoints").innerHTML}}b=b.replace(" ","").replace(",","");b=j(b);var N=0;var H=document.getElementsByClassName("factoryButton");for(x=0;x<H.length;x++){var O=H[x];var M=0;if(O.children[1].innerHTML=="&nbsp;"&&O.children.hasOwnProperty(6)&&O.children[6].innerHTML=="SELECT"){if(i=="money"){M=j(O.children[3].innerHTML.replace(" ","").replace(",","").replace("+",""))}else{if(i=="research"){M=j(O.children[5].innerHTML.replace(" ","").replace(",","").replace("+",""))}}}console.warn("Factory "+x+" income: "+M);N=N+M}document.getElementById(i+"_total_output").innerHTML=Math.round(N).toString();var S=Q*N;var J=L-b;if(!isNaN(J)){if(J>0){if(S>0){var P=J/S;R.innerHTML=l(F(P),true,2)}else{R.innerHTML="No income!"}}else{R.innerHTML="Goal reached!"}}else{R.innerHTML="Unable to calculate goal"}}else{R.innerHTML="Visit Factory Screen to update!"}}var w=document.getElementsByClassName("setting");for(var A=0;A<w.length;A++){w[A].onchange=t}k("Register interval");setInterval(function(){s("money","calc_money_display")},1000);setInterval(function(){s("research","calc_research_display")},1000)})();