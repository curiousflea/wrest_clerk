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
		this.dummy                = false;
		this.index                = -1;
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

	get finished()
	{
		return this.red.dummy || this.blue.dummy
			|| this.red.classificationPoints >= 3
			|| this.blue.classificationPoints >= 3;

	}

	get winner()
	{
		if (this.red.dummy && this.blue.dummy)
			return -1;
		else if (!this.red.dummy && this.blue.dummy)
			return this.red.index;
		else if (this.red.dummy && !this.blue.dummy)
			return this.blue.index;
		else if (this.red.classificationPoints >= 3 &&
			this.blue.classificationPoints < 3
		)
			return this.red.index;
		else if (this.red.classificationPoints < 3 &&
			this.blue.classificationPoints >= 3
		)
			return this.blue.index;
		else
			return -1;
	}

	get loser()
	{
		if (this.red.dummy || this.blue.dummy)
			return -1;
		else if (this.red.classificationPoints >= 3 &&
			this.blue.classificationPoints < 3
		)
			return this.blue.index;
		else if (this.red.classificationPoints < 3 &&
			this.blue.classificationPoints >= 3
		)
			return this.red.index;
		else
			return -1;
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

	get finished()
	{
		for (let m of this.matches)
			if (!m.finished)
				return false;
		return true;
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
		// If less than 6 wrestlers are registered in one weight category,
		// one group will be established and all wrestlers will compete
		// against each other.
		let round;
		this.rounds.length = 0;
		switch (this.wrestlers.length)
		{
			case 1:
				// Round №1
				round = new Round(1);
				this.rounds.push(round);
				round.matches[0].red.index  = 0;
				round.matches[0].blue.dummy = true;
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
				round.matches[1].blue.dummy = true;

				// Round №2
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 2;
				round.matches[0].blue.index = 0;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.dummy = true;

				// Round №3
				round = new Round(2);
				this.rounds.push(round);
				round.matches[0].red.index  = 1;
				round.matches[0].blue.index = 2;
				round.matches[1].red.index  = 0;
				round.matches[1].blue.dummy = true;
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
				round.matches[2].blue.dummy = true;

				// Round №2
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 4;
				round.matches[0].blue.index = 0;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.index = 2;
				round.matches[2].red.index  = 3;
				round.matches[2].blue.dummy = true;

				// Round №3
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 1;
				round.matches[0].blue.index = 4;
				round.matches[1].red.index  = 0;
				round.matches[1].blue.index = 3;
				round.matches[2].red.index  = 2;
				round.matches[2].blue.dummy = true;

				// Round №4
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 3;
				round.matches[0].blue.index = 4;
				round.matches[1].red.index  = 2;
				round.matches[1].blue.index = 0;
				round.matches[2].red.index  = 1;
				round.matches[2].blue.dummy = true;

				// Round №5
				round = new Round(3);
				this.rounds.push(round);
				round.matches[0].red.index  = 1;
				round.matches[0].blue.index = 3;
				round.matches[1].red.index  = 4;
				round.matches[1].blue.index = 2;
				round.matches[2].red.index  = 0;
				round.matches[2].blue.dummy = true;
				break;
			default:
				throw new Error("Bad number of wrestlers!");
		}
	}

	calcNordicAB()
	{
		// If there are 6 or 7 athletes in one weight category,
		// the competition starts with a pool phase with two groups.
		let round;
		this.rounds.length = 0;
		switch (this.wrestlers.length)
		{
			case 6:
				// Round №1
				round = new Round(4);
				this.rounds.push(round);
				// Group A
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 1;
				round.matches[1].red.index  = 2;
				round.matches[1].blue.dummy = true;
				// Group B
				round.matches[2].red.index  = 3;
				round.matches[2].blue.index = 4;
				round.matches[3].red.index  = 5;
				round.matches[3].blue.dummy = true;

				// Round №2
				round = new Round(4);
				this.rounds.push(round);
				// Group A
				round.matches[0].red.index  = 2;
				round.matches[0].blue.index = 0;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.dummy = true;
				// Group B
				round.matches[2].red.index  = 5;
				round.matches[2].blue.index = 3;
				round.matches[3].red.index  = 4;
				round.matches[3].blue.dummy = true;

				// Round №3
				round = new Round(4);
				this.rounds.push(round);
				// Group A
				round.matches[0].red.index  = 1;
				round.matches[0].blue.index = 2;
				round.matches[1].red.index  = 0;
				round.matches[1].blue.dummy = true;
				// Group B
				round.matches[2].red.index  = 4;
				round.matches[2].blue.index = 5;
				round.matches[3].red.index  = 3;
				round.matches[3].blue.dummy = true;
				break;
			case 7:
				// Round №1
				round = new Round(4);
				this.rounds.push(round);
				// Group A
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 1;
				round.matches[1].red.index  = 2;
				round.matches[1].blue.index = 3;
				// Group B
				round.matches[2].red.index  = 4;
				round.matches[2].blue.index = 5;
				round.matches[3].red.index  = 6;
				round.matches[3].blue.dummy = true;

				// Round №2
				round = new Round(4);
				this.rounds.push(round);
				// Group A
				round.matches[0].red.index  = 3;
				round.matches[0].blue.index = 0;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.index = 2;
				// Group B
				round.matches[2].red.index  = 6;
				round.matches[2].blue.index = 4;
				round.matches[3].red.index  = 5;
				round.matches[3].blue.dummy = true;

				// Round №3
				round = new Round(4);
				this.rounds.push(round);
				// Group A
				round.matches[0].red.index  = 0;
				round.matches[0].blue.index = 2;
				round.matches[1].red.index  = 1;
				round.matches[1].blue.index = 3;
				// Group B
				round.matches[2].red.index  = 5;
				round.matches[2].blue.index = 6;
				round.matches[3].red.index  = 4;
				round.matches[3].blue.dummy = true;
				break;
			default:
				throw new Error("Bad number of wrestlers!");
		}

		// The semi-final matches will consist with:
		// - the first ranked in the group A against
		// the second ranked in the group B
		// - the second ranked in the group A against
		// the first ranked in the group B

		// Round №4 (semi-final)
		round = new Round(2);
		this.rounds.push(round);
		round.matches[0].red.index  = this.groupRank("A", 1);
		round.matches[0].blue.index = this.groupRank("B", 2);
		round.matches[1].red.index  = this.groupRank("A", 2);
		round.matches[1].blue.index = this.groupRank("B", 1);

		// The gold medal match will be between the winners
		// of the semi-finals and the bronze medal match will be
		// between the losers of the semi-finals.

		// Round №5 (finals)
		let semi = round;
		round = new Round(2);
		this.rounds.push(round);
		// Bronze medal match
		round.matches[0].red.index  = semi.matches[0].loser;
		round.matches[0].blue.index = semi.matches[1].loser;
		// Gold medal match
		round.matches[1].red.index  = semi.matches[0].winner;
		round.matches[1].blue.index = semi.matches[1].winner;
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
