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


+function() {
	let div = document.createElement("div");
	div.innerHTML = "Privet";
	document.body.appendChild(div);
}();
