import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "../constants/Style";

export default function ImputText(props) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text style={{ marginLeft: 10 }}>{props.placeholder}</Text>

      <TextInput
        style={[styles.input, { paddingLeft: 20 }]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
}
