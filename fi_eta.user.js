// ==UserScript==
// @name         FactoryIdle eta display
// @namespace    http://towerofawesome.org
// @version      0.4
// @description  A plugin for FactoryIdle.com that displays time until a money goal is reached based on current income
// @author       Forecaster
// @match        http://factoryidle.com/
// @grant        none
// ==/UserScript==
console.warn("Script loaded");(function(){function d(b){return !(typeof b=="undefined"||b===null)}function x(b){return v(b*1000)}function v(z){var C=z;if(z<0){z=z*-1}var E=z/1000;var B=Math.floor(E/60/60/24/30/12);E=E-(B*12*30*24*60*60);var i=Math.floor(E/60/60/24/30);E=E-(i*30*24*60*60);var b=Math.floor(E/60/60/24/7);E=E-(b*7*24*60*60);var F=Math.floor(E/60/60/24);E=E-(F*24*60*60);var D=Math.floor(E/60/60);E=E-(D*60*60);var A=Math.floor(E/60);E=E-(A*60);return{years:B,months:i,weeks:b,days:F,hours:D,minutes:A,seconds:Math.floor(E),input:C}}function c(A,z,D){var C="";var b=[];if(!d(D)){D=6}if(d(z)&&z){if(A.years>0){b.push(A.years+"y, ")}if(A.months>0){b.push(A.months+"m, ")}if(A.weeks>0){b.push(A.weeks+"w, ")}if(A.days>0){b.push(A.days+"d, ")}if(A.hours>0){b.push(A.hours+"h, ")}if(A.minutes>0){b.push(A.minutes+"m, ")}if(A.seconds>0){b.push(A.seconds+"s, ")}}else{if(A.years>0){b.push((A.years==1)?A.years+" year, ":A.years+" years, ")}if(A.months>0){b.push((A.months==1)?A.months+" month, ":A.months+" months, ")}if(A.weeks>0){b.push((A.weeks==1)?A.weeks+" week, ":A.weeks+" weeks, ")}if(A.days>0){b.push((A.days==1)?A.days+" day, ":A.days+" days, ")}if(A.hours>0){b.push((A.hours==1)?A.hours+" hour, ":A.hours+" hours, ")}if(A.minutes>0){b.push((A.minutes==1)?A.minutes+" minute, ":A.minutes+" minutes, ")}if(A.seconds>0){b.push((A.seconds==1)?A.seconds+" second, ":A.seconds+" seconds, ")}}for(var B=0;B<D&&B<b.length;B++){C+=b[B]}C=C.replace(/, $/,"");if(C.length===0){C="<0"}return C}function k(A){var z=A.target.getAttribute("data-setting");var i=A.target.getAttribute("data-setting-sub");var b=A.target.getAttribute("data-disabled");if(typeof b=="undefined"||b===null){b=false}if(typeof z=="undefined"||z===null||b=="true"){p[i][z]=A.target.checked}}var p={money:{use_total_average:true,calculate_average:true,average_precision:20},research:{use_total_average:true,calculate_average:true,average_precision:20}};var f=document.createElement("div");f.style.position="absolute";f.style.top="20px";f.style.right="20px";var s=document.createElement("div");s.style.backgroundColor="white";s.style.color="black";s.style.padding="10px";s.style.border="4px solid orange";var l=document.createElement("div");l.id="calc_money_display";var t=document.createElement("div");t.innerHTML="<input id='calc_money_goal' placeholder='Target (eg 5 mil or 5 million)' />";var g=document.createElement("div");g.innerHTML="<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='money' data-disabled='true' data-setting='use_total_average' class='setting' style='cursor: pointer' title='Uses total average, which fluctuates a lot less.'/> Use Total Avg</label>";var e=document.createElement("div");e.innerHTML="<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='money' data-setting='calculate_average' class='setting' style='cursor: pointer' title='Calculates averages from the total of the individual incomes to fluctuate less while still being more accurate. Does not affect \"Use Total Avg\"'/> Calculate Average</label>";var r=document.createElement("div");r.style.backgroundColor="white";r.style.color="black";r.style.padding="10px";r.style.border="4px solid lightblue";var a=document.createElement("div");a.id="calc_research_display";var h=document.createElement("div");h.innerHTML="<input id='calc_research_goal' placeholder='Target (eg 5 mil or 5 million)' />";var w=document.createElement("div");w.innerHTML="<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='research' data-disabled='true' data-setting='use_total_average' class='setting' style='cursor: pointer' title='Uses total average, which fluctuates a lot less.'/> Use Total Avg</label>";var u=document.createElement("div");u.innerHTML="<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='research' data-setting='calculate_average' class='setting' style='cursor: pointer' title='Calculates averages from the total of the individual incomes to fluctuate less while still being more accurate. Does not affect \"Use Total Avg\"'/> Calculate Average</label>";s.appendChild(t);s.appendChild(l);r.appendChild(h);r.appendChild(a);f.appendChild(s);f.appendChild(r);document.body.appendChild(f);var n=0;var y=0;var o=[];console.log("Register function");function j(z,A){if(typeof z=="undefined"||z===null){z="money"}if(typeof A=="undefined"||A===null){A=document.getElementById("calc_money_display")}else{A=document.getElementById(A)}if(document.getElementById("factorySelection")!==null){var C=document.getElementById("calc_"+z+"_goal").value;if(C===""){A.innerHTML="No target set";return}C=C.replace(",","");C=C.replace(" ","");if(C.indexOf("m")>=0||C.indexOf("mil")>=0||C.indexOf("million")>=0){C=C.replace("million","");C=C.replace("mil","");C=C.replace("m","");C=parseFloat(C);C*=1000000}else{if(C.indexOf("b")>=0||C.indexOf("bil")>=0||C.indexOf("billion")>=0){C=C.replace("billion","");C=C.replace("bil","");C=C.replace("b","");C=parseFloat(C);C*=1000000000}else{if(C.indexOf("t")>=0||C.indexOf("tri")>=0||C.indexOf("trillion")>=0){C=C.replace("trillion","");C=C.replace("tri","");C=C.replace("t","");C*=1000000000000}}}console.info("Target: "+C+" "+z);var I=document.getElementById("ticks").innerHTML;var b;if(z=="money"){b=document.getElementById("money").innerHTML}else{if(z=="research"){b=document.getElementById("researchPoints").innerHTML}}b=b.replace(" ","");if(b.indexOf("million")>=0){b=b.replace("million","");b=parseFloat(b);b*=1000000}else{if(b.indexOf("billion")>=0){b=b.replace("billion","");b=parseFloat(b);b*=1000000000}else{if(b.indexOf("trillion")>=0){b=b.replace("trillion","");b=parseFloat(b);b*=1000000000000}}}console.info("Current: "+b+" "+z);if(!p[z].use_total_average){var D=document.getElementsByClassName(z);y=0;for(n=2;n<D.length;n++){var E=D[n].innerHTML.replace(" ","").replace("+","");if(E>0){var F=y;y=parseFloat(y)+parseFloat(E)}}if(p[z].calculate_average){var H=0;o.push(y);if(o.length>p.average_precision){o.shift()}for(var i=0;i<o.length;i++){H+=o[i]}y=H/o.length}}else{if(z=="money"){y=document.getElementById("income").innerHTML}else{if(z=="research"){y=document.getElementById("researchIncome").innerHTML}}y=y.replace(" ","");if(y.indexOf("million")>=0){y=y.replace("million","");y=parseFloat(y);y*=1000000}else{if(y.indexOf("billion")>=0){y=y.replace("billion","");y=parseFloat(y);y*=1000000000}else{if(y.indexOf("trillion")>=0){y=y.replace("trillion","");y=parseFloat(y);y*=1000000000000}}}}console.info("Income: "+y);var J=I*y;var B=C-b;if(!isNaN(B)){if(B>0){var G=B/J;A.innerHTML=c(x(G),true,2)}else{A.innerHTML="Goal reached!"}}else{A.innerHTML="Unable to calculate goal"}}else{A.innerHTML="Go to overview"}}var m=document.getElementsByClassName("setting");for(var q=0;q<m.length;q++){m[q].onchange=k}console.info("Register interval");setInterval(function(){j("money","calc_money_display")},1000);setInterval(function(){j("research","calc_research_display")},1000)})();
