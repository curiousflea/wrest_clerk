"use strict";


const ST_NORDIC             = 0;
const ST_NORDIC_AB          = 1;
const ST_DIRECT_ELIMINATION = 2;


class Period
{
	constructor()
	{
		this.technicalPoints      = "";
		this.totalTechnicalPoints = 0;
	}
}

class Player
{
	constructor(color)
	{
		this.color                = color;
		this.index                = 0;
		this.technicalPoints      = 0;
		this.classificationPoints = 0;
		this.periods              = [];
		this.periods[0]           = new Period();
		this.periods[1]           = new Period();
	}
}

class Match
{
	constructor()
	{
		this.red          = new Player("red");
		this.blue         = new Player("blue");
		this.timeBegin    = "";
		this.timeEnd      = "";
		this.timeDuration = "";
		this.referee      = "";
		this.judge        = "";
		this.matChairman  = "";
		this.number       = 0;
	}
}

class Round
{
	constructor(matchesCount = 0)
	{
		this.matches = [];
		for (let i = 0; i < matchesCount; ++i)
		{
			let match = new Match();
			this.matches.push(match);
		}
	}
}

class Wrestler
{
	constructor()
	{
		this.lot       = "";
		this.name      = "";
		this.birthdate = "";
		this.grade     = "";
		this.country   = "";
		this.coach     = "";
		this.weight    = "";
		this.place     = "";
	}
}

class Weight
{
	constructor()
	{
		this.wrestlers = [];
		this.rounds    = [];
	}

	autoLots(start = 1, step = 1)
	{
		// Filter existed lots
		let existedLots = this.wrestlers
			.filter(w => w.lot !== "")
			.map(w => w.lot);

		// Create array of lots with special start and step parameters
		let lot = start;
		let lots = [];
		for (let w of this.wrestlers)
		{
			if (!existedLots.includes(w.lot))
				lots.push(lot);
			lot += step;
		}

		// Rearrange lots
		for (let v of lots)
		{
			let x = Math.floor(Math.random() * lots.length);
			let y = Math.floor(Math.random() * lots.length);
			[ lots[x], lots[y] ] = [ lots[y], lots[x] ];
		}

		// Set empty lots
		for (let w of this.wrestlers)
			if (w.lot === "")
				w.lot = lots.pop();
	}

	sort()
	{
		// Sort by ascenging lots
		this.wrestlers.sort((a, b) => a.lot - b.lot);

		// Only for 6 and 7 wrestlers
		if (this.systemType === ST_NORDIC_AB)
		{
			// Don't create new array!
			// Someone could cache reference to array!
			let arr = this.wrestlers;
			let w5 = arr.splice(5, 1);
			let w3 = arr.splice(3, 1);
			let w1 = arr.splice(1, 1);
			arr.push(w1[0], w3[0], w5[0]);
		}
	}

	get systemType()
	{
		let count = this.wrestlers.length;
		if (count <= 5)
			return ST_NORDIC;
		else if (count <= 7)
			return ST_NORDIC_AB;
		else
			return ST_DIRECT_ELIMINATION;
	}

	get systemName()
	{
		switch (this.systemType)
		{
			case ST_NORDIC:
				return "Нордическая (круговая)";
			case ST_NORDIC_AB:
				return "Нордическая (подгруппы)";
			case ST_DIRECT_ELIMINATION:
				return "Прямого выбывания";
			default:
				return "НЕИЗВЕСТНАЯ";
		}
	}

	calc()
	{
		this.sort();
	}

	calcNordic()
	{
		let round;
		this.rounds.length = 0;
		switch (this.wrestlers.length)
		{
			case 1:
				// Round №1
				round = new Round(1);
				this.rounds.push(round);
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = -1;
				break;
			case 2:
				// Round №1
				round = new Round(1);
				this.rounds.push(round);
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 1;
				break;
			case 3:
				// Round №1
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 1;
				round.matches[1].red.index  = 2;
				round.matches[1].blue.index = -1;

				// Round №2
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 2;
				round.matches[0].blue.index = 0;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.index = -1;

				// Round №3
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 1;
				round.matches[0].blue.index = 2;
				round.matches[1].red.index  = 0;
				round.matches[1].blue.index = -1;
				break;
			case 4:
				// Round №1
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 1;
				round.matches[1].red.index  = 2;
				round.matches[1].blue.index = 3;

				// Round №2
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 3;
				round.matches[0].blue.index = 0;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.index = 2;

				// Round №3
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 2;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.index = 3;
				break;
			case 5:
				// Round №1
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 1;
				round.matches[1].red.index  = 2;
				round.matches[1].blue.index = 3;
				round.matches[2].red.index  = 4;
				round.matches[2].blue.index = -1;

				// Round №2
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 4;
				round.matches[0].blue.index = 0;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.index = 2;
				round.matches[2].red.index  = 3;
				round.matches[2].blue.index = -1;

				// Round №3
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 1;
				round.matches[0].blue.index = 4;
				round.matches[1].red.index  = 0;
				round.matches[1].blue.index = 3;
				round.matches[2].red.index  = 2;
				round.matches[2].blue.index = -1;

				// Round №4
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 3;
				round.matches[0].blue.index = 4;
				round.matches[1].red.index  = 2;
				round.matches[1].blue.index = 0;
				round.matches[2].red.index  = 1;
				round.matches[2].blue.index = -1;

				// Round №5
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 1;
				round.matches[0].blue.index = 3;
				round.matches[1].red.index  = 4;
				round.matches[1].blue.index = 2;
				round.matches[2].red.index  = 0;
				round.matches[2].blue.index = -1;
				break;
			default:
				break;
		}
	}
}

class Competition
{
	constructor()
	{
		this.name     = "";
		this.date     = "";
		this.place    = "";
		this.athletes = [];
		this.weights  = [];
	}
}



//	sort()
//	{
//		this.wrestlers.sort(
//			(a, b) =>
//			{
//				let [aw, bw] = [a.weight, b.wieght];
//				if ( isNumver(aw) ) {
//					return isNumber(bw) ? aw - bw : aw;
//				} else if ( isNumver(bw) ) {
//					return bw;
//				} else {
//					return aw > bw;
//				}
//			}
//		);
//	}
