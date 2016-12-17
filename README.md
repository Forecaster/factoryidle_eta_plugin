# factoryidle_eta_plugin
A plugin for FactoryIdle.com that displays time until a money goal is reached based on current income
Run either by copying main.js and paste in your browser console after each page load, or by adding it to Greasemonkey/Tampermonkey or similar to have it run automatically.

1. Install script manager:
 - [Tampermonkey](https://tampermonkey.net/) (Chrome)
 - [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
2. Install script:
 - [fi_eta.user.js](https://github.com/Forecaster/factoryidle_eta_plugin/blob/master/fi_eta.user.js)

### Changelog:

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
