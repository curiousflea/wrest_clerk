"use strict";

function ready(fn)
{
	if (document.attachEvent
		? document.readyState === "complete"
		: document.readyState !== "loading")
		fn();
	else
		document.addEventListener("DOMContentLoaded", fn);
}

ready(
	() =>
	{

		let weight = new Weight();
		for (let i = 0; i < 7; ++i) {
			let w = new Wrestler();
			weight.wrestlers.push(w);
			w.name = i;
		}

		weight.autoLots();
		weight.sort();

		drawTableWrestlers(
			document.querySelector("table"),
			weight.wrestlers);
	}
);

function loadStoredData()
{
	// Load stored data
	for (let e of document.querySelectorAll("input[data-stored]"))
	{
		let val = window.localStorage.getItem(e.id);
		if (val)
			e.value = val;

		// Handler to store each change
		e.addEventListener("change",
			function ()
			{
				window.localStorage.setItem(this.id, this.value);
			}
		);
	}
}

function newRowWithCells(cellTag, cellCount)
{
	let tr = document.createElement("tr");
	for (let i = 0; i < cellCount; ++i)
		tr.append(document.createElement(cellTag));
	return tr;
}

function drawTableWrestlers(table, wrestlers)
{
	// Remove old rows
	for (let e of table.querySelectorAll("tr"))
		e.remove();

	// Head
	let frag = document.createDocumentFragment();
	let tr = newRowWithCells("th", 8);
	frag.append(tr);
	tr.cells[0].append("№");
	tr.cells[1].append("Жребий");
	tr.cells[2].append("ФИО");
	tr.cells[3].append("Год рождения");
	tr.cells[4].append("Разряд");
	tr.cells[5].append("Город");
	tr.cells[6].append("Тренер");
	tr.cells[7].append("Вес");
	let thead = table.createTHead();
	thead.append(frag);

	// Body
	for (let i = 0; i < wrestlers.length; ++i)
	{
		let w = wrestlers[i];
		tr = newRowWithCells("td", 8);
		frag.append(tr);
		tr.cells[0].append(i + 1);
		tr.cells[1].append(w.lot);
		tr.cells[2].append(w.name);
		tr.cells[3].append(w.birthdate);
		tr.cells[4].append(w.grade);
		tr.cells[5].append(w.country);
		tr.cells[6].append(w.coach);
		tr.cells[7].append(w.weight);
	}

	let tbody = table.querySelector("tbody");
	if (!tbody)
		tbody = table.createTBody();
	tbody.append(frag);
}
