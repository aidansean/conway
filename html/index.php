<?php
$title = 'Conway\'s game of life' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('conway.js') ;
include_once('project.php') ;
include_once($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
<h3>Conway's rules</h3>
<p>This page runs a mathematical model known as <a href="http://en.wikipedia.org/wiki/Conway's_Game_of_Life">Conway's game of life</a>.  (<a href="http://www.conwaylife.com/wiki/Main_Page">Life wiki</a>)  The rules are simple:</p>
<ol>
  <li>The plane is split up into a grid of cells.  Each cell can be "alive" (black) or "dead" (white).</li>
  <li>A dead cell comes to life if there are three adjacent cells which are alive.</li>
  <li>A living cell dies if there are fewer than two adjacent cells which are alive.</li>
  <li>A living cell dies if there are more than three adjacent cells which are alive.</li>
  <li>A living cell stays alive if there are exactly two or three adjacent cells which are alive.</li>
</ol>
<p>Starting from simple rules, complex patterns emerge.  Many patterns die out quickly, many converge on oscillating or static patterns, some produce copies of moving patterns.</p>
<p>Resetting the model will clear the area and set the counter back to 0.  All cells outside the area are considered "dead".</p>
<h3>Game controller</h3>
<div class="tab">
  <div class="tab_cell">
    <input type="submit" class="conway_button" id="button_start" value="&#9654;"/>
    <input type="submit" class="conway_button" id="button_stop"  value="&#9724;" />
    <input type="submit" class="conway_button" id="button_reset" value="Reset"/>
    Turn <span id="turn_counter">0</span>
  </div>
  <div class="tab_cell">
    Delay: <input type="text" id="input_delay" />ms <input type="submit" id="button_delay" value="Change"/>
  </div>
  <div class="tab_cell">
    Density: <input type="text" id="input_dust" /> <input type="submit" id="button_dust" value="Random dust"/>
  </div>
  <div class="tab_cell">
    <input type="submit" id="button_url" value="Generate URL"/>
    <a id="this_url" href="">Link</a>
  </div>
</div>

<p>Some interesting patterns: <a href="?100;111;010">R-pentomino</a> - <a href="?101;111;010">Fork</a> - <a href="?000001;000000;000011;000000;011100;000000;111000;010000">Minimal block generator</a> - <a href="?11001;10010;10011;00100;10111">Square block generator</a> - <a href="?1;1;1;1;1;1;1;1;0;1;1;1;1;1;0;0;0;1;1;1;0;0;0;0;0;0;1;1;1;1;1;1;1;0;1;1;1;1;1">Infinite linear</a> - <a href="http://aidansean.com/conway/?000011000;000011000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000011100;000100010;001000001;001000001;000001000;000100010;000011100;000001000;000000000;000000000;001110000;001110000;010001000;000000000;110001100;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;001100000;001100000">Gosper glider gun</a> - <a href="?1100011;0011100;0100010;0010100;0001000">Queen bee</a> - <a href="?000000000001000000000000;000000000101000000000000;000000001010000000000000;000000010010000000000000;000000001010000000000000;000000000101000000000000;000000000001000000000000;000000000000000000001000;000000000000000000010100;000000000000000000100010;000000000000000000011100;000000000000000001100011;110001100000000000000000;001110000000000000000000;010001000000000000000000;001010000000000000000000;000100000000000000000000;000000000000100000000000;000000000000101000000000;000000000000010100000000;000000000000010010000000;000000000000010100000000;000000000000101000000000;000000000000100000000000">Queen bee loop</a></p>

<div id="canvas_wrapper">
  <canvas id="life_canvas" width="700" height="700"></canvas>
</div>

<?php foot() ; ?>
