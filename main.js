// ==UserScript==
// @name         FactoryIdle eta display
// @namespace    http://towerofawesome.org
// @version      0.4
// @description  A plugin for FactoryIdle.com that displays time until a money goal is reached based on current income
// @author       Forecaster
// @match        http://factoryidle.com/
// @grant        none
// ==/UserScript==

//Changelog:
//0.4
// - Added support for research points
// - Broke non Use total Avg mode in the process, now permanently uses "Use Total Avg" since there wasn't really a difference without it anyway
// - Added support for single character suffix. ("million, mil or m" all work for example)
//0.3
// - Added average calculation for non "Use Total Avg" mode to smooth out the calculation (essentially produces the same result as Use total Avg)
// - Added orange border around gui box
// - Detect when not on overview screen and stop trying to calculate and display "Go to overview" message instead
//0.2
// - Fixed calculation being incorrect unless "Use Total Avg" is enabled

console.warn("Script loaded");

(function() {
  'use strict';


  function isset(variable)
  {
    return !(typeof variable == "undefined" || variable === null);
  }

  function parse_seconds(seconds)
  {
    return parse_milliseconds(seconds * 1000);
  }

  function parse_milliseconds(milliseconds)
  {
    var input = milliseconds;
    if (milliseconds < 0)
      milliseconds = milliseconds * -1;

    var seconds = milliseconds / 1000;

    var years = Math.floor(seconds / 60 / 60 / 24 / 30 / 12);

    seconds = seconds - (years * 12 * 30 * 24 * 60 * 60);

    var months = Math.floor(seconds / 60 / 60 / 24 / 30);

    seconds = seconds - (months * 30 * 24 * 60 * 60);

    var weeks = Math.floor(seconds / 60 / 60 / 24 / 7);

    seconds = seconds - (weeks * 7 * 24 * 60 * 60);

    var days = Math.floor(seconds / 60 / 60 / 24);

    seconds = seconds - (days * 24 * 60 * 60);

    var hours = Math.floor(seconds / 60 / 60);

    seconds = seconds - (hours * 60 * 60);

    var minutes = Math.floor(seconds / 60);

    seconds = seconds - (minutes * 60);

    return {"years" : years, "months" : months, "weeks" : weeks, "days" : days, "hours" : hours, "minutes" : minutes, "seconds" : Math.floor(seconds), "input": input};
  }

  function time_string(time_obj, short_labels, display_highest_x)
  {
    var time_string = "";
    var strings = [];

    if (!isset(display_highest_x))
      display_highest_x = 6;

    if (isset(short_labels) && short_labels)
    {
      if (time_obj.years > 0)   strings.push(time_obj.years + "y, ");
      if (time_obj.months > 0)  strings.push(time_obj.months + "m, ");
      if (time_obj.weeks > 0)   strings.push(time_obj.weeks + "w, ");
      if (time_obj.days > 0)    strings.push(time_obj.days + "d, ");
      if (time_obj.hours > 0)   strings.push(time_obj.hours + "h, ");
      if (time_obj.minutes > 0) strings.push(time_obj.minutes + "m, ");
      if (time_obj.seconds > 0) strings.push(time_obj.seconds + "s, ");
    }
    else
    {
      if (time_obj.years > 0)   strings.push((time_obj.years == 1)    ? time_obj.years + " year, "      : time_obj.years + " years, ");
      if (time_obj.months > 0)  strings.push((time_obj.months == 1)   ? time_obj.months + " month, "    : time_obj.months + " months, ");
      if (time_obj.weeks > 0)   strings.push((time_obj.weeks == 1)    ? time_obj.weeks + " week, "      : time_obj.weeks + " weeks, ");
      if (time_obj.days > 0)    strings.push((time_obj.days == 1)     ? time_obj.days + " day, "        : time_obj.days + " days, ");
      if (time_obj.hours > 0)   strings.push((time_obj.hours == 1)    ? time_obj.hours + " hour, "      : time_obj.hours + " hours, ");
      if (time_obj.minutes > 0) strings.push((time_obj.minutes == 1)  ? time_obj.minutes + " minute, "  : time_obj.minutes + " minutes, ");
      if (time_obj.seconds > 0) strings.push((time_obj.seconds == 1)  ? time_obj.seconds + " second, "  : time_obj.seconds + " seconds, ");
    }

    for (var i = 0; i < display_highest_x && i < strings.length; i++)
      time_string += strings[i];

    time_string = time_string.replace(/, $/, "");
    if (time_string.length === 0)
      time_string = "<0";

    return time_string;
  }

  function update_setting(event)
  {
    var setting = event.target.getAttribute("data-setting");
    var sub = event.target.getAttribute("data-setting-sub");
    var disabled = event.target.getAttribute("data-disabled");
    if (typeof disabled == "undefined" || disabled === null)
      disabled = false;

    if (typeof setting == "undefined" || setting === null || disabled == "true")
      settings[sub][setting] = event.target.checked;
  }

  var settings = {
    money: {
      use_total_average: true,
      calculate_average: true,
      average_precision: 20,
    },
    research: {
      use_total_average: true,
      calculate_average: true,
      average_precision: 20,
    }
  };

  var container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "20px";
  container.style.right = "20px";

  var money_container = document.createElement("div");
  money_container.style.backgroundColor = "white";
  money_container.style.color = "black";
  money_container.style.padding = "10px";
  money_container.style.border = "4px solid orange";

  var money_display = document.createElement("div");
  money_display.id = "calc_money_display";

  var money_input = document.createElement("div");
  money_input.innerHTML = "<input id='calc_money_goal' placeholder='Target (eg 5 mil or 5 million)' />";

  var money_option1 = document.createElement("div");
  money_option1.innerHTML = "<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='money' data-disabled='true' data-setting='use_total_average' class='setting' style='cursor: pointer' title='Uses total average, which fluctuates a lot less.'/> Use Total Avg</label>";

  var money_option2 = document.createElement("div");
  money_option2.innerHTML = "<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='money' data-setting='calculate_average' class='setting' style='cursor: pointer' title='Calculates averages from the total of the individual incomes to fluctuate less while still being more accurate. Does not affect \"Use Total Avg\"'/> Calculate Average</label>";

  var rs_container = document.createElement("div");
  rs_container.style.backgroundColor = "white";
  rs_container.style.color = "black";
  rs_container.style.padding = "10px";
  rs_container.style.border = "4px solid lightblue";

  var rs_display = document.createElement("div");
  rs_display.id = "calc_research_display";

  var rs_input = document.createElement("div");
  rs_input.innerHTML = "<input id='calc_research_goal' placeholder='Target (eg 5 mil or 5 million)' />";

  var rs_option1 = document.createElement("div");
  rs_option1.innerHTML = "<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='research' data-disabled='true' data-setting='use_total_average' class='setting' style='cursor: pointer' title='Uses total average, which fluctuates a lot less.'/> Use Total Avg</label>";

  var rs_option2 = document.createElement("div");
  rs_option2.innerHTML = "<label style='cursor: pointer'><input type='checkbox' checked data-setting-sub='research' data-setting='calculate_average' class='setting' style='cursor: pointer' title='Calculates averages from the total of the individual incomes to fluctuate less while still being more accurate. Does not affect \"Use Total Avg\"'/> Calculate Average</label>";

  money_container.appendChild(money_input);
  money_container.appendChild(money_display);
  //money_container.appendChild(money_option1);
  //money_container.appendChild(money_option2);

  rs_container.appendChild(rs_input);
  rs_container.appendChild(rs_display);
  //rs_container.appendChild(rs_option1);
  //rs_container.appendChild(rs_option2);

  container.appendChild(money_container);
  container.appendChild(rs_container);

  document.body.appendChild(container);

  var i = 0;
  var total = 0;
  var income_log = [];

  console.log("Register function");
  function calculateTime(category, output)
  {
    if (typeof category == "undefined" || category === null)
      category = "money";
    if (typeof output == "undefined" || output === null)
      output = document.getElementById("calc_money_display");
    else
      output = document.getElementById(output);
    if (document.getElementById("factorySelection") !== null)
    {
      var target = document.getElementById("calc_" + category + "_goal").value;
      if (target === "")
      {
        output.innerHTML = "No target set";
        return;
      }
      target = target.replace(",", "");
      target = target.replace(" ", "");

      if (target.indexOf("m") >= 0 || target.indexOf("mil") >= 0 || target.indexOf("million") >= 0)
      {
        target = target.replace("million", "");
        target = target.replace("mil", "");
        target = target.replace("m", "");
        target = parseFloat(target);
        target *= 1000000;
      }
      else if (target.indexOf("b") >= 0 || target.indexOf("bil") >= 0 || target.indexOf("billion") >= 0)
      {
        target = target.replace("billion", "");
        target = target.replace("bil", "");
        target = target.replace("b", "");
        target = parseFloat(target);
        target *= 1000000000;
      }
      else if (target.indexOf("t") >= 0 || target.indexOf("tri") >= 0 || target.indexOf("trillion") >= 0)
      {
        target = target.replace("trillion", "");
        target = target.replace("tri", "");
        target = target.replace("t", "");
        target *= 1000000000000;
      }
      console.info("Target: " + target + " " + category);
      var ticks = document.getElementById("ticks").innerHTML;
      var money;
      if (category == "money")
        money = document.getElementById("money").innerHTML;
      else if (category == "research")
        money = document.getElementById("researchPoints").innerHTML;
      money = money.replace(" ", "");
      if (money.indexOf("million") >= 0)
      {
        money = money.replace("million", "");
        money = parseFloat(money);
        money *= 1000000;
      }
      else if (money.indexOf("billion") >= 0)
      {
        money = money.replace("billion", "");
        money = parseFloat(money);
        money *= 1000000000;
      }
      else if (money.indexOf("trillion") >= 0)
      {
        money = money.replace("trillion", "");
        money = parseFloat(money);
        money *= 1000000000000;
      }
      console.info("Current: " + money + " " + category);
      if (!settings[category].use_total_average)
      {
        var incomes = document.getElementsByClassName(category);
        total = 0;
        for (i = 2; i < incomes.length; i++)
        {
          var income = incomes[i].innerHTML.replace(" ", "").replace("+", "");

          if (income > 0)
          {
            var old_total = total;
            total = parseFloat(total) + parseFloat(income);
          }
        }

        if (settings[category].calculate_average)
        {
          var average_total = 0;
          income_log.push(total);
          if (income_log.length > settings.average_precision)
            income_log.shift();
          for (var p = 0; p < income_log.length; p++)
          {
            average_total += income_log[p];
          }
          total = average_total / income_log.length;
        }
      }
      else
      {
        if (category == "money")
          total = document.getElementById("income").innerHTML;
        else if (category == "research")
          total = document.getElementById("researchIncome").innerHTML;
        total = total.replace(" ", "");
        if (total.indexOf("million") >= 0)
        {
          total = total.replace("million", "");
          total = parseFloat(total);
          total *= 1000000;
        }
        else if (total.indexOf("billion") >= 0)
        {
          total = total.replace("billion", "");
          total = parseFloat(total);
          total *= 1000000000;
        }
        else if (total.indexOf("trillion") >= 0)
        {
          total = total.replace("trillion", "");
          total = parseFloat(total);
          total *= 1000000000000;
        }
      }
      console.info("Income: " + total);
      var incomeS = ticks * total;
      var difference = target - money;
      if (!isNaN(difference))
      {
        if (difference > 0)
        {
          var seconds = difference / incomeS;
          output.innerHTML = time_string(parse_seconds(seconds), true, 2);
        }
        else
          output.innerHTML = "Goal reached!";
      }
      else
      {
        output.innerHTML = "Unable to calculate goal";
      }
    }
    else
      output.innerHTML = "Go to overview";
  }

  var setting_toggles = document.getElementsByClassName("setting");

  for (var b = 0; b < setting_toggles.length; b++)
  {
    setting_toggles[b].onchange = update_setting;
  }

  console.info("Register interval");
  setInterval(function() {calculateTime("money", "calc_money_display");}, 1000);
  setInterval(function() {calculateTime("research", "calc_research_display");}, 1000);
})();
