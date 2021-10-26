import React from "react";
import { StatusBar } from "react-native";

const NotificationsBar = (props) => {
	return (
		<StatusBar
			backgroundColor={props.backgroundColor}
			barStyle="light-content"
		/>
	);
};

export default NotificationsBar;
