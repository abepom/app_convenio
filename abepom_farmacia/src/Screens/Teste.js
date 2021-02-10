import React from "react";

import WebView from "react-native-webview";

const Screens = () => {
	return (
		<>
			<WebView
				source={{
					uri:
						"https://intranet.abepom.org.br/ImprimeOrcamentoParc.asp?id=292622&dep=04",
				}}
			/>
		</>
	);
};

export default Screens;
