	function displayBoard(board ,board_div) {
		var canvas = document.getElementById(board_div);
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,400,400);
		ctx.beginPath();
		ctx.moveTo(133,0);
		ctx.lineTo(133,400);
		ctx.moveTo(266,0);
		ctx.lineTo(266,400);
		ctx.moveTo(0,133);
		ctx.lineTo(400,133);
		ctx.moveTo(0,266);
		ctx.lineTo(400,266);
		ctx.lineWidth = "2";
		ctx.stroke();
		for(i=0;i<3;i++) {
			for (j=0;j<3;j++) {
				switch(board[i][j]) {
					case '':
						break;
					case 'x':
						drawX(ctx,i*133 + 60,j*133 + 60);
						break;
					case 'o':
						drawO(ctx,i*133 + 60,j*133 + 60);
						break;
					default:
						break;
				}
			}
		}
	}

	function drawX(ctx,x,y) {
		ctx.beginPath();
		ctx.moveTo(x-25,y-25);
		ctx.lineTo(x+25,y+25);
		ctx.moveTo(x+25,y-25);
		ctx.lineTo(x-25,y+25);
		ctx.stroke();
	}

	function drawO(ctx,x,y) {
		ctx.beginPath();
		ctx.arc(x,y,25,0,Math.PI*2,true);
		ctx.stroke();
	}
