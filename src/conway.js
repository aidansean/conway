var canvas  = 0 ;
var context = 0 ;
var mode    = 1 ;

// Mode values:
// 1: Conway's game of life
// 2: Magnetic domains
// 3: Rock paper scissors

var n_colors = 3 ; // Only used for domains and rock paper scissors
var colors = [] ;
colors.push('#ffffff') ;
colors.push('#ff0000') ;
colors.push('#00ff00') ;
colors.push('#0000ff') ;
colors.push('#ffff00') ;
colors.push('#ff00ff') ;
colors.push('#00dddd') ;
colors.push('#000000') ;

var n_families = 1 ;
var base_health = 10 ; // Only used for rock paper scissors
var wrap = false ;

// Control evolution duration and speed
var delay = 100 ;
var counter = 0 ;
var stop = 10000 ;
var paused = false ;
var dust_density = 0.1 ;

// Dimensions of play area
var width  = 700 ;
var height = 700 ;
var cellSize = 10 ;
var nRows = Math.floor(height/cellSize) ;
var nCols = Math.floor( width/cellSize) ;

// Keep track of where the mouse is
var hover_i = -1 ;
var hover_j = -1 ;

var cells = 0 ;

// To be called if nRows or nCols changes
function remake_cells(){
  cells = new Array() ;
  for(var i=0 ; i<nRows ; i++){
    cells.push(new Array()) ;
    for(var j=0 ; j<nCols ; j++){
      cells[i].push([0,0,0]) ;
    }
  }
}

function getParameterByName(name){
  // Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search) ;
  return match && decodeURIComponent(match[1].replace(/\+/g, ' ')) ;
}

function get_cell(i,j){
  if(wrap){
    if(i<0 ) i = nRows-1 ;
    if(j<0 ) j = nCols-1 ;
    if(i>=nRows) i = 0 ;
    if(j>=nCols) j = 0 ;
  }
  else{
    if(i<0 || i>=nRows) return 0 ;
    if(j<0 || j>=nCols) return 0 ;
  }
  return cells[i][j][1] ;
}

function turn_begin(){
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      cells[i][j][1] = cells[i][j][0] ;
    }
  }
}

function turn_run(){
  var n_w = 0 ;
  var n_r = 0 ;
  var n_g = 0 ;
  var n_b = 0 ;
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      update_cell(i,j) ;
      if(mode==3){
        if(Math.floor(get_cell(i,j)/100)==0) n_w++ ;
        if(Math.floor(get_cell(i,j)/100)==1) n_r++ ;
        if(Math.floor(get_cell(i,j)/100)==2) n_g++ ;
        if(Math.floor(get_cell(i,j)/100)==3) n_b++ ;
      }
    }
  }
  if(Get('span_white')) Get('span_white').innerHTML = n_w ;
  if(Get('span_red'  )) Get('span_red'  ).innerHTML = n_r ;
  if(Get('span_green')) Get('span_green').innerHTML = n_g ;
  if(Get('span_blue' )) Get('span_blue' ).innerHTML = n_b ;
}

var rgb = [0,0,0] ;
function turn_draw(){
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      if(mode==1){
        draw_cell(i,j) ;
      }
      else if(mode==2){
        draw_cell(i,j,colors[cells[i][j][0]]) ;
      }
      else if(mode==3){
        color = colors[Math.floor(cells[i][j][0]/100)] ;
        draw_cell(i,j,color) ;
      }
    }
  }
}

function turn_end(){ return ; }

function turn(){
  if(paused) return ;
  turn_begin() ;
  turn_run() ;
  turn_draw() ;
  turn_end() ;
  Get('turn_counter').innerHTML = counter ;
  counter++ ;
  if(stop>0 && counter>=stop) return ;
  window.setTimeout(turn,delay,false) ;
}

function draw_cell(i,j,color){
  if(i<0 || i>=nRows) return ;
  if(j<0 || j>=nCols) return ;
  if(color==undefined){
    if(cells[i][j][0]==1){
      color = 'black'
    }
    else{
      color = ((i+j)%2==0) ? '#eeeeee' : 'white' ;
    }
  }
  context.fillStyle = color ;
  context.fillRect(cellSize*i,cellSize*j,cellSize,cellSize)
}

var neighbours = new Array() ;
function update_cell(i,j){
  if(mode==1){
    var n_alive = 0 ;
    for(var di=-1 ; di<=1 ; di++){
      for(var dj=-1 ; dj<=1 ; dj++){
        if(di==0 && dj==0) continue ;
        n_alive += get_cell(i+di,j+dj) ;
      }
    }
    if(cells[i][j][1]==0){
      if(n_alive==3){ cells[i][j][0] = 1 ; return ; }
    }
    else{
      if     (n_alive<2){ cells[i][j][0] = 0 ; return ; }
      else if(n_alive>3){ cells[i][j][0] = 0 ; return ; }
      else              { cells[i][j][0] = 1 ; return ; }
    }
  }
  else if(mode==2){
    var adjacent_colors = new Array() ;
    for(var ic=0 ; ic<=n_colors ; ic++){ adjacent_colors.push(0) ; }
    for(var di=-1 ; di<=1 ; di++){
      for(var dj=-1 ; dj<=1 ; dj++){
        if(di==0 && dj==0) continue ;
        var value = get_cell(i+di,j+dj) ;
        adjacent_colors[value]++ ;
      }
    }
    var max_n = 0 ;
    var max_i = 0 ;
    var draw = false ;
    for(var ic=1 ; ic<=n_colors ; ic++){
      if(adjacent_colors[ic]>max_n){
        max_n = adjacent_colors[ic] ;
        max_i = ic ;
        draw = false
      }
      else if(adjacent_colors[ic]==max_n){
        draw = true ;
      }
    }
    if(draw==false){ cells[i][j][0] = max_i          ; return ; }
    else           { cells[i][j][0] = cells[i][j][1] ; return ; }
  }
  else if(mode==3){
    var index=0 ;
    for(var di=-1 ; di<=1 ; di++){
      for(var dj=-1 ; dj<=1 ; dj++){
        if(di==0 && dj==0) continue ;
        var value = get_cell(i+di,j+dj) ;
        neighbours[index] = value ;
        index++ ;
      }
    }
    var other  = neighbours[ Math.floor(8*Math.random()) ] ;
    var breed  = Math.floor(cells[i][j][1]/100) ;
    var health = cells[i][j][1]%100 ;
    var other_breed  = Math.floor(other/100) ;
    var other_health = other%100 ;
    if(breed==0){
      if(other_breed!=0 && other_health>=1){
        var white_health = other_health-1 ;
        if(white_health==0) white_health = 1 ;
        cells[i][j][0] = other_breed*100+white_health ; return ;
      }
    }
    else{
      var eaten = false ;
      var nom   = false ;
      if(other_breed!=0 && (breed+n_colors+1)%n_colors==(other_breed+n_colors)%n_colors) eaten = true ;
      if(other_breed!=0 && (breed+n_colors-1)%n_colors==(other_breed+n_colors)%n_colors) nom   = true ;
      if(n_families==2 && n_colors==6){
        // Require exactly 6 colours for this
        
        // Reset feeding information
        eaten = false ;
        nom   = false ;
        if(breed>=1 && breed<=3){
          if(other_breed>=4 && other_breed<=6) return ; // Nothing to see here          
          if(breed==1 && other_breed==2) eaten = true ;
          if(breed==2 && other_breed==3) eaten = true ;
          if(breed==3 && other_breed==1) eaten = true ;
          if(breed==1 && other_breed==3) nom   = true ;
          if(breed==2 && other_breed==1) nom   = true ;
          if(breed==3 && other_breed==2) nom   = true ;
        }
        else if(breed>=4 && breed<=6){
          if(other_breed>=1 && other_breed<=3) return ; // Nothing to see here
          if(breed==4 && other_breed==5) eaten = true ;
          if(breed==5 && other_breed==6) eaten = true ;
          if(breed==6 && other_breed==4) eaten = true ;
          if(breed==4 && other_breed==6) nom   = true ;
          if(breed==5 && other_breed==4) nom   = true ;
          if(breed==6 && other_breed==5) nom   = true ;
        }
      }
      if(eaten){
        // Get eaten by neighbour
        health-- ;
        if(health>1){
          cells[i][j][0] = 100*breed+health ;
          return ;
        }
        else{
          if(other_health>1){
            cells[i][j][0] = other-1 ; return ;
          }
          else{
            cells[i][j][0] = other ;
          }
        }
      }
      if(nom){
        // Get eaten by neighbour
        health++ ;
        if(health>base_health) health = base_health ;
        cells[i][j][0] = 100*breed+health ;
        return ;
      }
    }
  }
}

function start_life(){
  paused = false ;
  turn() ;
}
function stop_life(){
  paused = true ;
}
function reset_life(){
  paused = true ;
  counter = 0 ;
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      cells[i][j][0] = 0 ;
      draw_cell(i,j) ;
    }
  }
  Get('turn_counter').innerHTML = counter ;
}

function load_from_url(){
  var url = document.URL ;
  var string = url.split('?') ;
  if(string.length==1) return ;
  string = string[1] ;
  if(string.length==0) return ;
  var rows = string.split(';') ;
  var max_cols = 0 ;
  for(var i=0 ; i<rows.length ; i++){
    if(rows[i].length>max_cols) max_cols = rows[i].length ;
  }
  var margin_left = Math.floor(0.5*(nCols-max_cols)) ;
  var margin_top  = Math.floor(0.5*(nRows-rows.length)) ;
  
  var cell_coords = [] ;
  for(var i=0 ; i<rows.length ; i++){
    for(var j=0 ; j<rows[i].length ; j++){
      var value = parseInt(rows[i][j]) ;
      switch(value){
        case 1:
          cell_coords.push([i,j]) ;
        case 0:
          break ;
        default:
          return ; // Broken input!
      }
    }
  }
  remake_cells() ;
  for(var i=0 ; i<cell_coords.length ; i++){
    var u = cell_coords[i][0]+margin_top  ;
    var v = cell_coords[i][1]+margin_left ;
    cells[u][v] = [1,1] ;
  }
}
function make_url(){
  var m_l = 0 ;
  var m_r = nCols-1 ;
  var m_t = 0 ;
  var m_b = nRows-1 ;
  
  var quit ;
  
  quit = false ;
  for(m_t=0 ; m_t<nRows ; m_t++){
    for(var j=0 ; j<nCols ; j++){
      if(cells[m_t][j][0]==1){
        quit = true ;
        break ;
      }
    }
    if(quit) break ;
  }
  quit = false ;
  for(m_b=nRows-1 ; m_b>=0 ; m_b--){
    for(var j=0 ; j<nCols ; j++){
      if(cells[m_b][j][0]==1){
        quit = true ;
        break ;
      }
    }
    if(quit) break ;
  }
  quit = false ;
  for(m_l=0 ; m_l<nCols ; m_l++){
    for(var j=0 ; j<nRows ; j++){
      if(cells[j][m_l][0]==1){
        quit = true ;
        break ;
      }
    }
    if(quit) break ;
  }
  quit = false ;
  for(m_r=nCols-1 ; m_r>=0 ; m_r--){
    for(var j=0 ; j<nRows ; j++){
      if(cells[j][m_r][0]==1){
        quit = true ;
        break ;
      }
    }
    if(quit) break ;
  }
  var string = '' ;
  for(var i=m_t ; i<=m_b ; i++){
    for(var j=m_l ; j<=m_r ; j++){
      string += cells[i][j][0] ;
    }
    if(i<m_b) string += ';' ;
  }
  var base_url = document.URL.split('?')[0] ;
  var url = base_url + '?' + string ;
  Get('this_url').href = url ;
}

function change_delay(){
  var delay_in = parseInt(Get('input_delay').value) ;
  if(delay_in==NaN) return ;
  delay = delay_in ;
}

function change_dust(){
  var dust_in = parseFloat(Get('input_dust').value) ;
  if(dust_in==NaN) return ;
  dust_density = dust_in ;
  if(dust_density<0) dust_density = 0 ;
  if(dust_density>1) dust_density = 1 ;
  for(var i=0 ; i<nRows ; i++){
    for(var j=0 ; j<nCols ; j++){
      var value = 0 ;
      switch(mode){
        case 1:
        default:
          value = (Math.random()<dust_density) ;
          break ;
        case 2:
          value = Math.floor(1+n_colors*Math.random()) ;
          break ;
        case 3:
          value = 0 ;
          if(Math.random()<dust_density){
            value = Math.floor(1+n_colors*Math.random()) ;
            value = 100*value + base_health ;
          }
          break ;
      }
      cells[i][j] = [value,value] ;
    }
  }
  turn_draw() ;
}

function start(){
  var url = document.URL ;
  var url_parts = url.split('?') ;
  if(url_parts.length>1){
    var args = url_parts[1].split('&') ;
    for(var i=0 ; i<args.length ; i++){
      var arg_parts = args[i].split('=') ;
      if(arg_parts[0]=='mode'){
        if(arg_parts[1]=='1') mode = 1 ;
        if(arg_parts[1]=='2') mode = 2 ;
        if(arg_parts[1]=='3') mode = 3 ;
      }
      if(arg_parts[0]=='nColors'  ){   n_colors = parseInt(arg_parts[1]) ; }
      if(arg_parts[0]=='cellSize' ){   cellSize = parseInt(arg_parts[1]) ; }
      if(arg_parts[0]=='nFamilies'){ n_families = parseInt(arg_parts[1]) ; }
      if(arg_parts[0]=='wrap'){ wrap = true ; }
    }
  }
  Get('input_delay').value = delay ;
  canvas  = Get('life_canvas') ;
  context = canvas.getContext('2d') ;
  if(mode==1){
    canvas.addEventListener('click'    , click    , false) ;
    canvas.addEventListener('mousemove', mousemove, false) ;
  }
  Get('button_start').addEventListener('click', start_life  ,false) ;
  Get('button_stop' ).addEventListener('click', stop_life   ,false) ;
  Get('button_reset').addEventListener('click', reset_life  ,false) ;
  Get('button_url'  ).addEventListener('click', make_url    ,false) ;
  Get('button_delay').addEventListener('click', change_delay,false) ;
  Get('button_dust' ).addEventListener('click', change_dust ,false) ;
  Get('input_delay').value = delay ;
  Get('input_dust' ).value = dust_density ;
  
  var extra_content_wrapper = Get('extra_content_wrapper') ;
  extra_content_wrapper.innerHTML = extra_paragraph() ;
  
  if(mode==2 || mode==3){
    //cellSize = 5 ;
    nRows = Math.floor(height/cellSize) ;
    nCols = Math.floor( width/cellSize) ;
    remake_cells() ;
    stop = -1 ;
  }
  if(mode==2||mode==3) change_dust() ;
  remake_cells() ;
  load_from_url() ;
  
  turn_draw() ;
}
function click(evt){
  if(!evt) var evt = window.event ;
  var X = evt.pageX - evt.target.offsetLeft ;
  var Y = evt.pageY - evt.target.offsetTop  ;
  var i = Math.floor(X/cellSize) ;
  var j = Math.floor(Y/cellSize) ;
  cells[i][j][0] = 1-cells[i][j][0] ;
  draw_cell(i,j) ;
}
function mousemove(evt){
  if(!evt) var evt = window.event ;
  var X = evt.pageX - evt.target.offsetLeft ;
  var Y = evt.pageY - evt.target.offsetTop  ;
  draw_cell(hover_i,hover_j) ;
  hover_i = Math.floor(X/cellSize) ;
  hover_j = Math.floor(Y/cellSize) ;
  if(cells[hover_i][hover_j][0]==1){
    draw_cell(hover_i,hover_j,'rgb(0,100,0)') ;
  }
  else{
    draw_cell(hover_i,hover_j,'rgb(100,0,0)') ;
  }
}

function extra_paragraph(){
  if(mode==1){
    return '<p>Some interesting patterns: <a href="?100;111;010">R-pentomino</a> - <a href="?101;111;010">Fork</a> - <a href="?000001;000000;000011;000000;011100;000000;111000;010000">Minimal block generator</a> - <a href="?11001;10010;10011;00100;10111">Square block generator</a> - <a href="?1;1;1;1;1;1;1;1;0;1;1;1;1;1;0;0;0;1;1;1;0;0;0;0;0;0;1;1;1;1;1;1;1;0;1;1;1;1;1">Infinite linear</a> - <a href="http://aidansean.com/conway/?000011000;000011000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000011100;000100010;001000001;001000001;000001000;000100010;000011100;000001000;000000000;000000000;001110000;001110000;010001000;000000000;110001100;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;000000000;001100000;001100000">Gosper glider gun</a> - <a href="?1100011;0011100;0100010;0010100;0001000">Queen bee</a> - <a href="?000000000001000000000000;000000000101000000000000;000000001010000000000000;000000010010000000000000;000000001010000000000000;000000000101000000000000;000000000001000000000000;000000000000000000001000;000000000000000000010100;000000000000000000100010;000000000000000000011100;000000000000000001100011;110001100000000000000000;001110000000000000000000;010001000000000000000000;001010000000000000000000;000100000000000000000000;000000000000100000000000;000000000000101000000000;000000000000010100000000;000000000000010010000000;000000000000010100000000;000000000000101000000000;000000000000100000000000">Queen bee loop</a></p>' ;
  }
  if(mode==2 || mode==3){
    return '<p>White: <span id="span_white"></span><br />Red: <span id="span_red"></span><br />Green: <span id="span_green"></span><br />Blue: <span id="span_blue"></span></p>' ;
  }
}

function Get(id){ return document.getElementById(id) ; }