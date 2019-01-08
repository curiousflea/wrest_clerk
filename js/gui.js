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
		let cmpt = new Competition();

		document.forms.add.elements.add.addEventListener("click",
			() =>
			{
				let w = newWrestler();
				cmpt.athletes.push(w);
				drawTableWrestlers(
					document.querySelector("table"),
					cmpt.athletes);
			}
		);


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

function drawTableWrestlers(table, wrestlers)
{
	// Order of columns
	let columns = [];
	for (let e of table.createTHead().children[0].cells)
		columns.push(e.dataset.column);

	// Body
	let tbody = table.querySelector("tbody");
	if (!tbody)
		tbody = table.createTBody();

	// Remove old content
	while (tbody.firstElementChild)
		tbody.firstElementChild.remove();

	// Append new content
	let frag = document.createDocumentFragment();
	for (let i = 0; i < wrestlers.length; ++i)
	{
		let w = wrestlers[i];
		let tr = document.createElement("tr");
		for (let j = 0; j < columns.length; ++j)
		{
			let td = document.createElement("td");
			let prop = columns[j];
			if (prop === "number")
				td.append(i + 1);
			else
				td.append(w[prop]);
			tr.append(td);
		}
		frag.append(tr);
	}
	tbody.append(frag);
}

function newWrestler()
{
	let w = new Wrestler();
	for (let e of document.forms.add.querySelectorAll("input"))
		w[e.name] = e.value;
	return w;
}

function newRowWithCells(cellTag, cellCount)
{
	let tr = document.createElement("tr");
	for (let i = 0; i < cellCount; ++i)
		tr.append(document.createElement(cellTag));
	return tr;
}
