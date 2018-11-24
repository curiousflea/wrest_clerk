"use strict";

function Competition()
{
	this.name     = "";
	this.date     = "";
	this.place    = "";
	this.athletes = [];
	this.weights  = [];
}

function WeightCategory()
{
	this.wrestlers = [];
	this.rounds    = [];
}

function Wrestler()
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

function Round()
{
	this.matches = [];
}

function Match(number, redIndex, blueIndex)
{
	this.number       = number;
	this.players      = [];
	this.players[0]   = new Player(redIndex,  "red");
	this.players[1]   = new Player(blueIndex, "blue");
	this.timeBegin    = "";
	this.timeEnd      = "";
	this.timeDuration = "";
	this.referee      = "";
	this.judge        = "";
	this.matChairman  = "";
}

function Player(index, color)
{
	this.index                = index;
	this.color                = color;
	this.technicalPoints      = 0;
	this.classificationPoints = 0;
	this.periods              = [];
	this.periods[0]           = new Period();
	this.periods[1]           = new Period();
}

function Period()
{
	this.technicalPoints      = "";
	this.totalTechnicalPoints = 0;
}

const CS_NORDIC             = 0;
const CS_NORDIC_AB          = 1;
const CS_DIRECT_ELIMINATION = 2;

function getCompetitionSystem(wrestlerCount)
{
	if (wrestlerCount <= 5) {
		return CS_NORDIC;
	} else if (wrestlerCount <= 7) {
		return CS_NORDIC_AB;
	} else {
		return CS_DIRECT_ELIMINATION;
	}
}

function getCompetitionSystemName(cs)
{
	switch (cs) {
		case CS_NORDIC:
			return "Нордическая (круговая)";
		case CS_NORDIC_AB:
			return "Нордическая (подгруппы)";
		case CS_DIRECT_ELIMINATION:
			return "Прямого выбывания";
		default:
			return "НЕИЗВЕСТНАЯ";
	}
}
