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

		let wrestlers = [];
		for (let i = 0; i < 10; ++i) {
			let w = new Wrestler();
			wrestlers.push(w);
			//		w.lot = i;
		}

		wrestlers.forEach(w => console.log(w.lot));

		autoLots(wrestlers, 1, 1);

		console.log("-----------");
		wrestlers.forEach(w => console.log(w.lot));
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

addRowAndCells(elem, cellTag, cellCount)
{
	let tr = document.createElement("tr");
	for (let i = 0; i < cellsCount; ++i)
	{
	tr.appendChild(document.createElement("th")).append("");
	tr.appendChild(document.createElement("th")).append("");
	tr.appendChild(document.createElement("th")).append("");

	// Body
	let frag = document.createDocumentFragment();
	for (let i = 0; i < wrestlers.length; ++i)
	{
		let w = wrestlers[i];
		let tr = tbody.insertRow();
		tr.insertCell().append(i + 1);
		tr.insertCell().append(w.lot);
		tr.insertCell().append(w.name);
		tr.insertCell().append(w.birthdate);
		tr.insertCell().append(w.grade);
		tr.insertCell().append(w.country);
		tr.insertCell().append(w.coach);
		tr.insertCell().append(w.weight);
	}
	let tbody = table.createTBody();
	tbody.append(frag);
}

drawTableWrestlers(table, wrestlers)
{
	// Remove old rows
	for (let e of table.querySelectorAll("tr"))
		e.remove();

	// Head
	let thead = table.createTHead();
	let tr = thead.insertRow();
	tr.appendChild(document.createElement("th")).append("");
	tr.appendChild(document.createElement("th")).append("");
	tr.appendChild(document.createElement("th")).append("");

	// Body
	let frag = document.createDocumentFragment();
	for (let i = 0; i < wrestlers.length; ++i)
	{
		let w = wrestlers[i];
		let tr = document.createElement("tr");
		frag.append(tr);
		tr.appendChild(document.createElement("td")).append(i + 1);
		tr.appendChild(document.createElement("td")).append(w.lot);
		tr.appendChild(document.createElement("td")).append(w.name);
		tr.appendChild(document.createElement("td")).append(w.birthdate);
		tr.appendChild(document.createElement("td")).append(w.grade);
		tr.appendChild(document.createElement("td")).append(w.country);
		tr.appendChild(document.createElement("td")).append(w.coach);
		tr.appendChild(document.createElement("td")).append(w.weight);
	}

	let tbody = table.querySelector("tbody");
	if (!tbody)
		tbody = table.createTBody();
	tbody.append(frag);
}
