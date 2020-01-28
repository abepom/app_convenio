import React from 'react';
import {View, Text, CheckBox} from 'react-native';

const testes = () => {
  const [areas, setAreas] = React.useState([
    {cod: 1, permitido: true},
    {cod: 2, permitido: true},
    {cod: 3, permitido: false},
    {cod: 4, permitido: true},
  ]);
  let a = {};
  areas.map(area => {
    a = [{[area.cod]: {...area}}];
  });
  console.log(a);

  return (
    <View style={{flex: 1}}>
      {areas.map(area => {
        console.log(this);
        return (
          <CheckBox
            key={area.cod}
            value={area.permitido}
            onValueChange={a => {
              console.log(a);
              let trocar = {...area, permitido: a};
              setAreas([...areas, trocar]);
            }}
          />
        );
      })}
    </View>
  );
};

export default testes;
