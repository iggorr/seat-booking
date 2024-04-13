$(function(){
		
	//Generating the key
	//Iterating through all th's in key table
	$('#key tr th').each(function(){
		var curr = $(this);						//Setting the current th
		
		//Check content of the th, removing content and adding class or bg color + size
		if (curr.text() === "T")
		{
			curr.empty();
			curr.css({'width':'26px', 'height':'26px'});
			curr.addClass("taken");
		}
		else if (curr.text()=== "F")
		{
			curr.empty();
			curr.css({'width':'26px', 'height':'26px','background-color': '#79E6F2'});
		}
		
		else if (curr.text()=== "B")
		{
			curr.empty();
			curr.css({'width':'26px', 'height':'26px','background-color': '#FFB03B'});
		}		
	});
	
	//Creating a new tr for Extra legroom seats
	var xtraTr = $('<tr><td>Extra legroom</td></tr>');							//Creating the tr with td
	var xtra = $('<th></th>');													//New th
	xtra.css({'width':'26px', 'height':'26px','background-color': '#57C6F2'});	//Adding the bg colour
	xtraTr.prepend(xtra);														//Prepending to the whole row
	xtraTr.appendTo($('#key table'));											//Appening the row to the table

	//Creating a new tr for Up Front seats
	var upTr = $('<tr><td>Up Front</td></tr>');									//Creating the tr with td
	var up = $('<th></th>');													//New th
	up.css({'width':'26px', 'height':'26px','background-color': '#0468BF'});	//Adding the bg colour
	upTr.prepend(up);															//Prepending to the whole row
	upTr.appendTo($('#key table'));											//Appening the row to the table
	
	//Create a final price block
	var finalBlock = $('<div/>');
	finalBlock.attr('id', 'finalBlock');
	
	//Create a header for the block
	var totals = $('<h2>Totals</h2>');
	finalBlock.append(totals);
	
	//Div with the total for the seats
	var seatTot = $('<div>Seats total: £</div>');
	var seatPrice = $('<span/>');							//Span within the seat total
	var seatP = 0;											//Initialising the total for the seats
	
	//Printing current total for seats
	seatPrice.attr('id', 'seatPrice');
	seatPrice.text(seatP.toFixed(2));	
	seatTot.append(seatPrice);
	
	//Adding to the block
	finalBlock.append(seatTot);

	//Total price line
	var totPrice = $('<h3>Final Price: £</h3>');
	var totalPrice = $('<span/>');						//Span within the total price
	var subTotal = 0;									//Initialising subtotal
	var totPr = 0; 										//Initialising the total
	totalPrice.attr('id', 'totalPrice');
	
	//Printing the total..
	totalPrice.text(totPr.toFixed(2));	
	totPrice.append(totalPrice);
	finalBlock.append(totPrice);
	
	//Creating radio buttons with card payment selection, adding to the block
	var radio1 = $('<input type ="radio" name = "card" id = radio1 >Pay by Debit Card: £<span id=debit></span><br>').appendTo(finalBlock);
	var radio2 = $('<input type ="radio" name = "card" id = radio2 >Pay by Credit Card: £<span id=credit></span><br>').appendTo(finalBlock);
	var creditPrice = 0;								//Initialising the price for paying with credit card
	
	
	//Inserting the final block into the page
	finalBlock.insertAfter('#bookingSummary');
	//$('#content').append(finalBlock);
	
	//Adding a disabled Continue button (with the disabled class and property) to the final block
	var btn = $('<button/>');
	btn.addClass('button');
	btn.addClass('disabled');	
	btn.prop('disabled', true);
	btn.text("Continue");	
	$('#finalBlock').append(btn);
	
	//Adding the click functionality to the button
	btn.click(function(){
		alert("Seats booked, thanks!");
	});
	
	//Clearing all T's and F's
	$("td.n").empty();	
	
	//Adding seat letters
	var header = $("<tr/>");								//Create new table row
	var firstSeat = 65;										//Set the letter of the first seat
	var lastSeat = 70;										//Set the letter of the last seat
	for (var i = firstSeat; i<= lastSeat; i++)				//Iterate through the seats
	{
		var cell = $("<th/>");								//Create new th
		//Add an empty th for the aisle (middle seat)
		if (i == Math.round((firstSeat+lastSeat)/2))		
		{
			var empty = $("<th/>")
			header.append(empty);			
		}
		cell.append(String.fromCharCode(i));				//Print the current letter in the th
		header.append(cell);								//Add th to the new row
	}	
	$('#plan table').prepend(header);						//Prepend new row to table
	
	//Add row numbers
	$('#plan tr').each(function(index) {					//Iterate through each tr in div #plan		
		$(this).children('td:not(.n)').html(index);			//Change the html of td's without a class in the current tr to the row number
	});	
	
	var numberSeats = 0;									//Initialising the number of seats
	
	//Get flight details from the server
	$.getJSON('booking1.json',function(d){
		
		//Setting the values of the fields
		$('#whereFrom').text(d.whereFrom);
		$('#whereTo').text(d.whereTo);
		$('#whereTo1').text(d.whereTo);
		$('#flightId').text(d.flightId);
		
		numberSeats = d.numSeats;							//Getting the number of seats from JSON
		
		//Setting the values of the fields..
		$('#numSeats').text(numberSeats);
		$('#numSeats1').text(numberSeats);
		$('#numSeats2').text(numberSeats);	
		
		$('#unitPrice').text(d.unitPrice.toFixed(2));
		
		//Creating a list of selected seats 
		for (var i = 1; i <= numberSeats; i++)				
		{
			var line = $('<div/>');							//Create a new line
			line.text("Seat " + i + ": ");					//Adding count of the seat
			var span = $('<span/>');						//Create a new span
			span.attr('id', 'selSeat' + i);					//Adding seat number as the id of the span
			line.append(span);								//Append span to the line
			$('#bookingSummary').append(line);				//Append line to the summary
		}
		
		//Handling the date
		var leave = new Date(d.departAt);
		var arrive = new Date(d.arriveAt);
		
		//Setting the values of the fields
		$('#date').text(leave.toDateString());
		$('#takeOffTime').text(leave.toLocaleTimeString());
		$('#landTime').text(arrive.toLocaleTimeString());
				
		//Calculating and printing the subtotal
		subTotal = numberSeats * d.unitPrice;		
		$('#subTotal').text(subTotal.toFixed(2));
		
		//Calculating and printing the total and debit total (which are equal to subtotal because no seats selected so far)
		totPr = subTotal;
		$('#totalPrice').text(totPr.toFixed(2));
		$('#debit').text(subTotal.toFixed(2));
		
		//Calculating and printing the total for paying with credit card (2% fee)
		creditPrice = subTotal * 1.02;
		$('#credit').text(creditPrice.toFixed(2));		
		
		//Updating taken seats from alloc array by iterating through each element of the alloc array
		for (var i = 0; i <d.alloc.length; i++)
		{
			if (d.alloc[i] == 1)
			{
				$($('td.n')[i]).addClass('taken');				//Add the class "taken" if the seat is taken
			}
		}
		
		//Adding prices and category to each seat
		//Iterating through each row of the plan table
		$('#plan tr').each(function(index) {	
			var row = index;									//Getting the row number (row 0 is the row with seat letters)
			var $this = $(this);
			
			//Iterating through each pricing category in the JSON file
			$(d.pricing).each(function(index){
				var lower = this.range[0];						//Getting the lowest value in the range
				lower = lower.substring(1, lower.length-1);		//Removing underscore and letter
				var upper = this.range[1];						//Getting the highest value in the range
				upper = upper.substring(1, upper.length-1);		//Removing underscore and letter
				
				//Checking if the row number is within the range of the category
				if(row >= lower && row <= upper)
				{
					$this.children('td.n').data('price',this.price);	//Adding a price data to each td with class n of the current row
					var category;										//Declaring the category
					if (this.cat === '')
						category = "Standard";							//If category is not specified, put in 'Standard'
					else
						category = this.cat;
					$this.children('td.n').data('cat', category);		//Setting the category data of the td.n
					return false;										//Getting out of the inner loop
				}
			});
		});
		
		//Iterating through each td.n, if category is one of the two then add the class to the td
		$('td.n').each(function(){
			if ($(this).data('cat') === 'Extra legroom')
				$(this).addClass('extra');
			if ($(this).data('cat') === 'Up Front')
				$(this).addClass('up');
		});
	});

	//Handle the click event
	$('#plan td.n').click(function(){
		
		if (!($(this).hasClass("taken")))					//Check that the seat is not already taken
		{
			var numSelected = $(".selected").length;		//Number of seats selected so far
			
			//Check if there are more seats to select or the current seat is already selected
			if (numSelected < numberSeats || $(this).hasClass("selected"))	
			{
				//If about to book the last seat, enable the continue button
				if (numSelected == numberSeats-1 && !$(this).hasClass("selected"))
				{
					btn.removeClass("disabled");
					btn.prop('disabled', false);
				}
				
				//Otherwise, if button is already enabled, disable it
				else if(!btn.hasClass("disabled"))
				{
					btn.addClass("disabled");
					btn.prop('disabled', true);
				}

				//Check if the seat has already been selected
				if($(this).hasClass("selected"))
				{
					seatP -= $(this).data('price');				//Substract the unselected seat's price from the seat total					

					//If about to unselected the only selected seat, set seat total to zero (to avoid weird conversion)
					if ($('.selected').length == 1)
					{
						seatP = 0;
					}
					
					//Iterate through selected seat list
					for (var i = 1; i<= numberSeats; i++)
					{
						var current = $('#selSeat' + i);			//Getting the span
						var idNum = $(this).attr('id');				//Getting the id of the clicked seat
						
						//Check if current span contains the id (in upper case) of the selected seat
						if ((current.text().search(idNum.substring(1).toUpperCase()))!=-1) 	
						{
							current.empty();						//If yes, clear the span
							break;									//Get out of the loop
						}						
					}
				}
				
				//Otherwise, (if seat has not been already selected), find the first empty span to put the seat number into
				else
				{
					seatP += $(this).data('price');						//Add the clicked seat's price to the seat total
					
					//Iterate through selected seat list
					for (var i = 1; i <= numberSeats; i++)
					{
						var current = $('#selSeat' + i);				//Getting the span
						if (current.text().length == 0)					//Check whether the span is empty
						{
							var idNum = $(this).attr('id');				//Getting the id of the clicked seat
							
							//Add the id of the seat and the price to the span, omitting the underscore and using upper case
							current.append(idNum.substring(1).toUpperCase() + ', £' + $(this).data('price'));			
							break;										//Get out of the loop
						}
					}
				}				
				
				$('#seatPrice').text(seatP.toFixed(2));				//Refresh the seat total field
				totPr = subTotal + seatP;							//Calculating the total price 
				$('#debit').text(totPr.toFixed(2));					//Printing the amount to be paid with debit card
				creditPrice = totPr * 1.02;							//Calculating and printing the amount to be paid with credit card
				$('#credit').text(creditPrice.toFixed(2));
				
				//If the credit card radio button is currently checked, display the credit card amount as the final price
				if($('#radio2').prop("checked"))
				{
					$('#totalPrice').text(creditPrice.toFixed(2));						
				}
				
				//Otherwise, print the debit card amount as the final price
				else
				{
					$('#totalPrice').text(totPr.toFixed(2));
				}
				
				$(this).toggleClass("selected");			//Toggle the class "selected" of the seat
				numSelected = $(".selected").length;		//Get the number of seats selected				
			}
			$('#seatsAlloc').text(numSelected);				//Printing the number of seats selected
		}
	});
	
	//Handling the radio button click function
	$('input').click(function(){
		
		//If the debit radio button has been clicked, display the debit amount as total price
		if($(this).attr('id') === 'radio1')
		{
			$('#totalPrice').text(totPr.toFixed(2));
		}
		
		//Otherwise, print the credit card amount as the final price
		else
		{
			$('#totalPrice').text(creditPrice.toFixed(2));
		}
		
	});
	
	//Handling the hovering over the seats
	$('td.n:not(.taken)').mouseenter(function(e){
		var pos = $(this).position();					//Getting the position of the hovered over seat
		var curr = $(this).attr('id');					//Getting id of the hovered over seat
		curr = curr.substring(1).toUpperCase();			//Getting rid of underscore + letter and using upperscore..
		
		//Creating a new div with the hovered over seat's id, price and category depending on the position of the seat
		var zonePrice = $('<div/>', {
			html: curr + " £" + $(this).data('price') + "<br>" + $(this).data('cat'),
			id: 'zonePrice',
			css:{ top : pos.top-55, left: pos.left-50}
		});		
		$('#content').prepend(zonePrice);				//Prepending
		}) .mouseleave(function(){
		$('#zonePrice').remove();						//When mouse leave remove the div
	});
})
