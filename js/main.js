//Global variables
var boardSize = 4;
var score = 0; 
var lightText = '#feefec';
var darkText = '#73695f';
var colorCodes = [
					{ value: 2,      color: '#efe5d9', fontColor: darkText},
					{ value: 4,      color: '#ece0ca', fontColor: darkText},
					{ value: 8,      color: '#f2b17b', fontColor: lightText},
					{ value: 16,     color: '#f59466', fontColor: lightText},
					{ value: 32,     color: '#f87962', fontColor: lightText},
					{ value: 64,     color: '#f35e35', fontColor: lightText},
					{ value: 128,    color: '#f2ce71', fontColor: lightText},
					{ value: 256,    color: '#edcb64', fontColor: lightText},
					{ value: 512,    color: '#f0c754', fontColor: lightText},
					{ value: 1024,   color: '#efc738', fontColor: lightText},
					{ value: 2048,   color: '#edc423', fontColor: lightText},
					{ value: 4096,   color: '#', fontColor: lightText},
					{ value: 8192,   color: '#', fontColor: lightText},
					{ value: 16384,  color: '#', fontColor: lightText},
					{ value: 32768,  color: '#', fontColor: lightText}
				 ]
				 
//Event listeners
$(window).resize(function() { updateGridDimensions(); });
$(document).ready(function() { setTimeout(function() { updateGridDimensions(); createBoard(); }, 10); setTimeout(function() { $('#grid').removeClass("hidden"); updateGridDimensions(); }, 15);});
$(window).keydown(function(e) { playerMove(e); });

//Event handler that updates the grid size dynamically
function updateGridDimensions() 
{
	var squareSize = $('.square').css('width');
	var squareSizePx = parseInt(squareSize);
	$('.square').css('height', squareSize);
	$('.square').css('width', squareSize);
	$('.square').css('font-size', (squareSizePx * 0.5) + 'px');
	$('.square').css('border', (squareSizePx * 0.06) + 'px solid #baad9e');
	$('#grid').css('border', (squareSizePx * 0.06) + 'px solid #baad9e');
}

function playerMove(e) 
{
	var key = (e.keyCode ? e.keyCode : e.which); 

	//Left move
	if(key == 37 || key == 65)
	{
		let squares = $('.square').filter(function() { return $(this).find('p').html().length != 0; }); //Squares with values
		let squareSize = $('.square').css('width');
		let current, currentRow, currentCol, currentValue, moves, leftSquare, leftSquareValue, currentInterior, oldInterior, newInterior;

		//Slide left animation
		for(let i = 0; i < squares.length; i++)
		{
			current = $(squares[i]);
			currentInterior = current.find('.square-interior');
			currentRow = parseInt(current.attr('row'));
			currentCol = parseInt(current.attr('col'));
			currentValue = current.find('p').html();
			moves = 0;
			
			//Loop from current col position in current row, leftwards checking for other squares or the end border
			for(var position = currentCol; position > 0; position--)
			{
				leftSquare = $('#s' + currentRow + (position - 1));
				leftSquareValue = leftSquare.find('p').html();

				//Empty square to the left
				if(leftSquareValue == '')
				{
					moves++;
				}
				//Matching square to the left
				else if(leftSquareValue == currentValue)
				{
					moves++;
					break;
				}
				//Non-empty, non-matching square to the left
				else 
				{
					break;
				}
			}

			if(moves != 0)
			{
				//Shift square leftwards into new position
				currentInterior.animate( { left: '-' + (parseInt(squareSize) * moves) + 'px' }, 100); 
				
				setTimeout(function() 
				{
					var newInteriorValue = newInterior.find('p').html();
					var oldInteriorValue = oldInterior.find('p').html();

					//Check for a match -> merge two values together
					if(newInteriorValue == oldInteriorValue)
					{
						var summedValue = parseInt(newInteriorValue) + parseInt(oldInteriorValue);
						newInterior.css('background-color', colorCodes[Math.log2(summedValue) - 1].color); //Calculate the color code index based on the value
						newInterior.find('p').html(summedValue);
						
						oldInterior.find('p').html('');
						oldInterior.css('background-color', '#ffffff');
						oldInterior.animate( { left: '0px' }, { duration: 1, queue: false }, 'linear');
					}
					//No match
					else
					{
						//Update square currently in that position with the new square's value and background
						newInterior.css('background-color', oldInterior.css('background-color'));
						newInterior.find('p').html(oldInterior.find('p').html());

						//Empty the old position square's contents and return it back to its original position
						oldInterior.find('p').html('');
						oldInterior.css('background-color', '#ffffff');
						oldInterior.animate( { left: '0px' }, { duration: 1, queue: false }, 'linear');
					}

				}, 125, newInterior = $('#s' + currentRow + '' + (currentCol - moves) + ' .square-interior'), oldInterior = currentInterior);
			}
		}
			
		//Spawn a new tile
		setTimeout(spawnTile, 150);
	}
	//Right move
	else if(key == 39 || key == 68)
	{


		spawnTile();
	}
	//Up move
	else if(key == 38 || key == 87)
	{


		spawnTile();
	}
	//Down move
	else if(key == 40 || key == 83)
	{


		spawnTile();
	}
}

function newGame() 
{
	$('#grid').find('p').text('');
}

function spawnTile()
{
	//Get all empty tiles
	var emptySquares = $('.square-interior p:empty');

	//Check if the grid is full -> Game Over
	if(emptySquares.length == 0)
	{
		alert('Game Over!\nScore: ' + score);
	}
	//Set a random, empty tile to either a value of 2 or 4
	else
	{
		var randomSquare = $(emptySquares[Math.floor(Math.random() * (emptySquares.length))]);
		var value = Math.random() < 0.9 ? 2 : 4; //90% chance of 2, 10% chance of 4
		randomSquare.html(value); 
		(value == 2) ? randomSquare.parent().css('background-color', colorCodes[0].color) : randomSquare.parent().css('background-color', colorCodes[1].color); //Set background color based on value
	}
}

//Create the grid based on the chosen size
function createBoard() 
{
	var grid = $('#grid');
	
	for(var row = 0; row < boardSize; row++) 
	{
		var rowDiv = $('<div class="row"></div>');

		for(var col = 0; col < boardSize; col++)
		{
			rowDiv.append('<div id="s' + row + col + '" class="col square" row="' + row + '" col="' + col + '"><div class="square-interior"><p></p></div></div>');
		}

		grid.append(rowDiv);
	}

	//Spawn a square somewhere to start off the game
	spawnTile();
}