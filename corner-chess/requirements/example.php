<html xmlns="http://www.w3.org/1999/xhtml">
<head>

   # This is an example for the html file you need for your game to work on the site, taken from the voronoi game. 
#this html file assumes your game involves high scores. If it doesn't feel free to ignore those bits
#Remember that in the end all that really matters is that your game needs to report the winner and the score to the player(s) at the end. How you do so can be through this page or could be integrated into your game.

   #this stuff below is the same for all games, leave it as is...
<!-- pages title -->
<title>Dr Ecco</title>

<!-- open the css sheet for the style -->
<link href="../../style.css" rel="stylesheet" type="text/css" media="screen" />

</head>
<body>

<!-- div to get the background and the css style -->
<div id="body1">

#end standard header

#put your game's name in the indicated location
<div class="post">
	<h2 class="title"><a href="#">YourGameNameHere</a></h2>
</div>

#this javascript block serves to return the winner's name and score on demand(used below with a "submit score" button).
#your code doesn't need to use javascript, but it does need to be able to pass the name and score as specified in the "document.location.href" line below.
#example alternative: write out the name and score to a temp file(or "still playing" if the game is not over), have the php script read that in when needed.
#you may need to learn a little php for this. I recommend http://www.w3schools.com/default.asp as a basic tutorial hub for web design.

<!-- javascript to get the winner's variables in the game's code -->
<SCRIPT>
	function theWinner(){
		if(document.voronoiapplet.getTheWinnerName() != "not set"){	
			
			
			winnerScore = document.voronoiapplet.getTheWinnerScore()
			winnerScoreString = winnerScore.toString();
			winnerScoreOk = winnerScoreString.split('.');
			winnerFinalScore = winnerScoreOk[0];
			
			#this is the important line here if you intend to save high scores. It calls to another php script, index.php, and passes it the game name, winner name, and winner score via the url as shown. This is actually not great web design since you can inject arbitrary scores this way without playing the game first, so I might change it later, but for now follow this form.
			#basically, you just need to make sure this one line gets called once the game is over.
			document.location.href="http://cims.nyu.edu/drecco/index.php?task=YourGameNameHere&winner="+document.voronoiapplet.getTheWinnerName()+"&ws="+winnerFinalScore;
			
		}else{
			alert ("the winner is not known !");
		}
	}
	
</SCRIPT>


<center> 
<br /><br />

#this is an example of one way to save the score, by button press. If you wanted, you could substitute "theWinner()" with the "document.location.href=" line from the function depending on how you return the winner's info.
<!-- "Save my score" button to save the score in the database -->
<form name ="voronoiWinner">
<input type="button" value="Save my score" onClick="theWinner()">
</form>


#Launch the game in a java applet window. Works as-is for those of you using java. Should be pretty straight forward- just build your code and GUI, then call this on the top level class.
<!-- launch the java applet -->
<applet name="voronoiapplet" code="Voronoi.class" width="740" height="470" >
</applet>

</center>
<br /><br />

#fetches the high score table. Feel free to include this on your game's page if needed.
<!-- display the last and best scores -->

	<!-- open the connection with the dabatase -->
	
	<?php 
		include '../../functions.php';
		
		
		getScores("YourGameNameHere");
		
	?>	




#Some notes:
#you may want to have instructions on the page if you don't explain the game yourself. Doing so is pretty straightforward in html, and you can check the tutorial mentioned at top if you need help. Also see the nanomunchers page.html file for an example of this at /usr/httpd/entities/drecco/games/nanomunchers/page.html
#the means by which you run your game and the means by which you return a score will vary depending on what language you are using. I suggest you make sure you figure out a good way to do that in your language, at least generally, before you dig in to the coding. Looking at existing game examples may help.


</div>
</body>
</html>
