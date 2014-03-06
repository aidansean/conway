<?php
$title = 'Conway\'s game of life' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('conway.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
<p>
  This page runs a mathematical model known as <a href="http://en.wikipedia.org/wiki/Conway's_Game_of_Life">Conway's game of life</a>.  (<a href="http://www.conwaylife.com/wiki/Main_Page">Life wiki</a>)  The rules are simple:</p>
<ol>
  <li>The plane is split up into a grid of cells.  Each cell can be "alive" (black) or "dead" (white).</li>
  <li>A dead cell comes to life if there are three adjacent cells which are alive.</li>
  <li>A living cell dies if there are fewer than two adjacent cells which are alive.</li>
  <li>A living cell dies if there are more than three adjacent cells which are alive.</li>
  <li>A living cell stays alive if there are exactly two or three adjacent cells which are alive.</li>
</ol>
<p>Starting from simple rules, complex patterns emerge.  Many patterns die out quickly, many converge on oscillating or static patterns, some produce copies of moving patterns.</p>
<p>Resetting the model will clear the area and set the counter back to 0.  All cells outside the area are considered "dead".</p>
<p>
  <input type="submit" id="button_start" value="Start"/>
  <input type="submit" id="button_stop"  value="Stop" />
  <input type="submit" id="button_reset" value="Reset"/>
  Turn <span id="turn_counter">0</span>
</p>
  <p>Delay: <input type="text" id="input_delay" />ms <input type="submit" id="button_delay" value="Change"/></p>
  <p>Density: <input type="text" id="input_dust" /> <input type="submit" id="button_dust" value="Random dust"/></p>
<p>
  <input type="submit" id="button_url" value="Generate URL"/>
  <a id="this_url" href="">Link</a>
</p>
<div id="extra_content_wrapper"></div>

<div id="canvas_wrapper">
  <canvas id="life_canvas" width="700" height="700"></canvas>
</div>

<?php foot() ; ?>
