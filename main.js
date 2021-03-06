// ==UserScript==
// @name         FactoryIdle eta display
// @namespace    https://github.com/Forecaster/factoryidle_eta_plugin
// @version      0.9.1
// @description  A plugin for FactoryIdle.com that displays time until a money goal is reached based on current income
// @author       Forecaster
// @match        http://factoryidle.com/
// @grant        none
// ==/UserScript==

//Changelog:
//0.9.1
// - Fix critical derp
//0.9
// - Fixed negative numbers not being matched
//0.8
// - Fixed calculations for individual factories to be correct (used to discard suffixes wrongly which caused terrible inaccuracy)
// - Takes into account paused factories correctly
//0.7
// - Change 'Go to overview' to 'Visit Factory Screen to update!'
// - Remove 'timer link' option that doesn't do anything anyway
// - Hopefully fix displaying 'Infinityy' sometimes
//0.6 <HOTFIX>
// - Fix number-parsing breaking with decimals
//0.5
// - Add ability to change position of menu
// - Add support for more suffixes (List in readme)
// - Add timer feature (Via duckduckgo.com) will play a sound when timer expires
// - Re-write script to trivialize adding more suffixes
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

(function() {
  'use strict';
  var script_name = "FactoryIdle eta display";
  var version = '0.9.1';

  function log(message)
  {
    console.info("[" + script_name + "] " + message);
  }

  log("Script Loaded");

  //If you know what you're doing you can edit this to add more operators:
  var operators = [
    {id: "thousand",    power: 1000,                  keywords: ["K", "k", "kilo", "thousand", "tho"]},
    {id: "million",     power: 1000000,               keywords: ["M", "m", "mega", "million", "mil"]},
    {id: "billion",     power: 1000000000,            keywords: ["G", "g", "giga", "b", "billion", "bil"]},
    {id: "trillion",    power: 1000000000000,         keywords: ["T", "t", "tera", "trillion", "tri"]},
    {id: "quadrillion", power: 1000000000000000,      keywords: ["P", "p", "peta", "quadrillion", "qua"]},
    {id: "quintillion", power: 1000000000000000000,   keywords: ["E", "e", "exa", "quintillion", "qui"]},
    {id: "sextillion",  power: 1000000000000000000000,keywords: ["Z", "z", "zetta", "sextillion", "sex"]},
  ];

  if (!String.prototype.format)
  {
    String.prototype.format = function ()
    {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function (match, number)
      {
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
  }

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

  function update_position(event)
  {
    if (event.target.value == "top_left")
    {
      container.style.top = "20px";
      container.style.left = "20px";
      container.style.right = null;
      container.style.bottom = null;
    }
    else if (event.target.value == "top_right")
    {
      container.style.top = "20px";
      container.style.left = null;
      container.style.right = "20px";
      container.style.bottom = null;
    }
    else if (event.target.value == "bottom_left")
    {
      container.style.top = null;
      container.style.left = "20px";
      container.style.right = null;
      container.style.bottom = "20px";
    }
    else if (event.target.value == "bottom_right")
    {
      container.style.top = null;
      container.style.left = null;
      container.style.right = "20px";
      container.style.bottom = "2opx";
    }
  }

  /**
   * @param input {string}
   * @returns {number|float}
   */
  function parse_suffixes_for(input)
  {
    var operator_pattern = /[-\d.]*([a-zA-Z]*)/;

    var power = 1;
    var operator = input.match(operator_pattern);

    if (operator.length == 2)
    {
      operator = operator[1];
      for (var i = 0; i < operators.length; i++)
      {
        if (operators[i].keywords.indexOf(operator) >= 0)
        {
          power = operators[i].power;
          i = 100000;
        }
      }
    }

    var parse_input = parseFloat(input);

    if (!isNaN(parse_input))
      return parse_input * power;
    else
      return 0;
  }

  var settings = {
    money: {
      generate_timer_link: true,
    },
    research: {
      generate_timer_link: true,
    }
  };

  var container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "20px";
  container.style.right = "20px";
  container.innerHTML = "<div>Version " + version + "</div>";

  var position_switcher = document.createElement("div");
  var selecter = document.createElement("select");
  selecter.onchange = update_position;
  selecter.innerHTML = "<option value='top_left'>Top Left</option>"+
                       "<option value='top_right'>Top Right</option>"+
                       "<option value='bottom_left'>Bottom Left</option>"+
                       "<option value='bottom_right'>Bottom Right</option>";
  position_switcher.appendChild(selecter);

  var money_container = document.createElement("div");
  money_container.style.backgroundColor = "white";
  money_container.style.color = "black";
  money_container.style.padding = "10px";
  money_container.style.border = "4px solid orange";

  var money_total = document.createElement("div");
  money_total.id = "money_total_output";
  money_total.innerHTML = "0";

  var money_input = document.createElement("div");
  money_input.innerHTML = "<input id='calc_money_goal' placeholder='Target (eg 5 mil or 5 million)' />";

  var money_display = document.createElement("div");
  money_display.id = "calc_money_display";

  var money_warning_output = document.createElement("div");
  money_warning_output.style.color = "red";
  money_warning_output.id = "money_warning_output";

  var rs_container = document.createElement("div");
  rs_container.style.backgroundColor = "white";
  rs_container.style.color = "black";
  rs_container.style.padding = "10px";
  rs_container.style.border = "4px solid lightblue";

  var rs_total = document.createElement("div");
  rs_total.id = "research_total_output";
  rs_total.innerHTML = "0";

  var rs_input = document.createElement("div");
  rs_input.innerHTML = "<input id='calc_research_goal' placeholder='Target (eg 5 mil or 5 million)' />";

  var rs_display = document.createElement("div");
  rs_display.id = "calc_research_display";

  var rs_warning_output = document.createElement("div");
  rs_warning_output.style.color = "red";
  rs_warning_output.id = "research_warning_output";

  money_container.appendChild(money_total);
  money_container.appendChild(money_input);
  money_container.appendChild(money_display);
  money_container.appendChild(money_warning_output);

  rs_container.appendChild(rs_total);
  rs_container.appendChild(rs_input);
  rs_container.appendChild(rs_display);
  rs_container.appendChild(rs_warning_output);

  container.appendChild(position_switcher);
  container.appendChild(money_container);
  container.appendChild(rs_container);

  document.body.appendChild(container);

  var timer_url = "https://duckduckgo.com/?q=timer+{0}+seconds&ia=timer";
  var i = 0;
  var total = 0;

  function calculateTime(category, output)
  {
    var output_element;
    if (typeof category == "undefined" || category === null)
      category = "money";
    if (typeof output == "undefined" || output === null)
      output_element = document.getElementById("calc_money_display");
    else
      output_element = document.getElementById(output);
    if (document.getElementById("factorySelection") !== null)
    {
      var target = document.getElementById("calc_" + category + "_goal").value;
      if (target == "")
      {
        output_element.innerHTML = "No target set";
        return;
      }
      target = target.replace(",", "").replace(" ", "");

      var parse_target = parseFloat(target);

      target = parse_suffixes_for(target);

      if (parse_target.length != target.length)
        document.getElementById(category + "_warning_output").innerHTML = "Invalid operator ignored!";

      var ticks = document.getElementById("ticks").innerHTML;
      var money;
      if (category == "money")
        money = document.getElementById("money").innerHTML;
      else if (category == "research")
        money = document.getElementById("researchPoints").innerHTML;
      money = money.replace(" ", "").replace(",","");

      money = parse_suffixes_for(money);

      var total = 0;
      var factoryButtons = document.getElementsByClassName("factoryButton");
      for (i = 0; i < factoryButtons.length; i++)
      {
        var thisButton = factoryButtons[i];
        var button_income = 0;

        if (thisButton.children[1].innerHTML == "&nbsp;"  && thisButton.children.hasOwnProperty(6) && thisButton.children[6].innerHTML == "SELECT")
        {
          if (category == "money")
          {
            button_income = parse_suffixes_for(thisButton.children[3].innerHTML.replace(" ","").replace(",", "").replace("+", ""));
          }
          else if (category == "research")
            button_income = parse_suffixes_for(thisButton.children[5].innerHTML.replace(" ","").replace(",","").replace("+",""));
        }
        console.warn("Factory " + i + " income: " + button_income);
        total = total + button_income;
      }

      //console.info("Total income: " + total);
      document.getElementById(category + "_total_output").innerHTML = Math.round(total).toString();
      var incomeS = ticks * total;
      var difference = target - money;
      if (!isNaN(difference))
      {
        if (difference > 0)
        {
          if (incomeS > 0)
          {
            var seconds = difference / incomeS;
            output_element.innerHTML = time_string(parse_seconds(seconds), true, 2);
            //timer_link_output.innerHTML = "<a href='" + timer_url.format(seconds) + "'>Timer</a>";
          }
          else
          {
            output_element.innerHTML = "No income!";
          }
        }
        else
        {
          output_element.innerHTML = "Goal reached!";
        }
      }
      else
      {
        output_element.innerHTML = "Unable to calculate goal";
      }
    }
    else
    {
      output_element.innerHTML = "Visit Factory Screen to update!";
    }
  }

  var setting_toggles = document.getElementsByClassName("setting");

  for (var b = 0; b < setting_toggles.length; b++)
  {
    setting_toggles[b].onchange = update_setting;
  }

  log("Register interval");
  setInterval(function() {calculateTime("money", "calc_money_display");}, 1000);
  setInterval(function() {calculateTime("research", "calc_research_display");}, 1000);
})();