String.prototype.replaceAll = function(de, para) {
	var str = this;
	var pos = str.indexOf(de);
	while (pos > -1) {
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
	return str;
};

export default (text, set) => {
	const last = text.substr(text.length - 1, 1);
	let texto =
		last +
		text
			.replace("R$", "")
			.replace(/ /g, "")
			.replace(/,/g, "")
			.replaceAll(".", "")
			.substr(0, text.length - 1);

	set(texto);
};
