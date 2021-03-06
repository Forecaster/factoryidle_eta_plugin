# factoryidle_eta_plugin
A plugin for FactoryIdle.com that displays time until a money and/or research goal is reached based on current balance and income.
Run either by copying the contents of fi_eta.user.js and paste in your browser console after each page load, or by adding it to Greasemonkey/Tampermonkey or similar to have it run automatically.

1. Install script manager:
 - [Tampermonkey](https://tampermonkey.net/) (Chrome)
 - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
2. Install script:
 - [fi_eta.user.js](https://github.com/Forecaster/factoryidle_eta_plugin/raw/master/fi_eta.user.js)
 
### Suffixes:
```
thousand:    ["K", "k", "kilo", "thousand", "tho"]
million:     ["M", "m", "mega", "million", "mil"]
billion:     ["G", "g", "giga", "b", "billion", "bil"]
trillion:    ["T", "t", "tera", "trillion", "tri"]
quadrillion: ["P", "p", "peta", "quadrillion", "qua"]
quintillion: ["E", "e", "exa", "quintillion", "qui"]
sextillion:  ["Z", "z", "zetta", "sextillion", "sex"]
```

### Changelog:

#### 0.9.1
 - Fix critical derp

#### 0.9
 - Fixed negative numbers not being matched

#### 0.8
 - Fixed calculations for individual factories to be correct (used to discard suffixes wrongly which caused terrible inaccuracy)
 - Takes into account paused factories correctly

#### 0.7
 - Change 'Go to overview' to 'Visit Factory Screen to update!'
 - Remove 'timer link' option that doesn't do anything anyway
 - Hopefully fix displaying 'Infinityy' sometimes

#### 0.6 \<HOTFIX>
 - Fix number-parsing breaking with decimals

#### 0.5
 - Add ability to change position of menu
 - Add support for more suffixes (List in readme)
 - Add timer feature (Via duckduckgo.com) will play a sound when timer expires
 - Re-write script to trivialize adding more suffixes

#### 0.4
 - Added support for research points
 - Broke non Use total Avg mode in the process, now permanently uses "Use Total Avg" since there wasn't really a difference without it anyway
 - Added support for single character suffix. ("million, mil or m" all work for example)
 
#### 0.3
 - Added average calculation for non "Use Total Avg" mode to smooth out the calculation (essentially produces the same result as Use total Avg)
 - Added orange border around gui box
 - Detect when not on overview screen and stop trying to calculate and display "Go to overview" message instead
 
#### 0.2
 - Fixed calculation being incorrect unless "Use Total Avg" is enabled
