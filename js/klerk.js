"use strict";

function ready(fn)
{
	if (document.attachEvent ?
		document.readyState === "complete" :
		document.readyState !== "loading")
	{
		fn();
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

ready(function() {
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
});
