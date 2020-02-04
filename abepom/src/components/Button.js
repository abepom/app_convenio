import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../constants/Style";
const Button = props => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
      style={[styles.btnDefault, , props.style]}
    >
      <Text style={{ textAlign: "center", color: "#fff" }}>
        {props.placeholder}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
