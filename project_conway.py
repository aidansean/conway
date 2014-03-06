from project_module import project_object, image_object, link_object, challenge_object

p = project_object('boxer')
p.domain = 'http://www.aidansean.com/'
p.path = 'boxer'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.github_repo_name = 'boxer'
p.mathjax = True
p.links.append(link_object(p.domain, 'boxer/', 'Live page'))
p.introduction = 'Conway\'s game of life is a very famous mathematical model with a rich variety of "creatures" that can interact with one another.  This script is a simple interactive sandbox where the user can "paint" cells to create different shapes.  There are a number of predefined boards that the user can choose to investigate some small and interesting patterns as they evolve.'
p.overview = '''The underlying mathematics is very simple.  Conway's game of life follows three simple rules:
<ol>
  <li>A dead cell comes to life if there are three adjacent cells which are alive.</li>
  <li>A living cell dies if there are fewer than two adjacent cells which are alive.</li>
  <li>A living cell dies if there are more than three adjacent cells which are alive.</li>
</ol>

This is achieved by simply iterating over the board where each cell has two possible states (dead/alive) as well as the state from the previous turn.  This procedure is then wrapped up in a series of <code>window.setTimeout</code> calls to allow the board to evolve.'''

p.challenges.append(challenge_object('The user must be able to paint cells to make shapes.  The interaction must match the underlying grid.', 'Overcoming this challenge was largely a matter of seamless performance as well as correct handling of events.  This was surprisingly straightforward given the <a href="http://www.quirksmode.org/js/events_properties.html#position">lack of cross browser support</a> for finding the cursor position.', 'Resolved'))

p.challenges.append(challenge_object('Ideally this should be an infinite sandbox.', 'After toying with the idea of an unlimited size of board the stretches to match the user\'s patterns it was decided that this would be unfeasible.  As the size of the board increases (for example, due to gospel gliders moving off to infinity) the amount of memory required to contain the game would increase to dangerous levels.  In addition the splicing of additional columns (and to a lesser extent, rows) of the board would incur a significant CPU cost.  The board is sufficiently large for most interesting patterns.', 'Resolved'))

p.challenges.append(challenge_object('Saving patterns with markup.', 'One of the most useful features was for users to be able to share their patterns with other people.  To do this there is a link which automatically updates, storing the current board as a string as a url argument.  This is then parsed, which turned out to be quite simple, and centred on the board.', 'Resolved'))

print p.wordpress_text()