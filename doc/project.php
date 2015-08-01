<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/conway" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=conway" ;
$project = new project_object("conway", "Conway's Game of Life", "https://github.com/aidansean/conway", "http://aidansean.com/projects/?tag=conway", "conway/images/project.jpg", "conway/images/project_bw.jpg", "Conway's game of life is a very famous mathematical model with a rich variety of \"creatures\" that can interact with one another.  This script is a simple interactive sandbox where the user can \"paint\" cells to create different shapes.  There are a number of predefined boards that the user can choose to investigate some small and interesting patterns as they evolve.", "Maths,Toys", "canvas,JavaScript,HTML") ;
?>