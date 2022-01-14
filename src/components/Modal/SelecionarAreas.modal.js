import React from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import useConvenio from "../../Data/Convenio";
import styles from "../../utils/Style";

// import { Container } from './styles';

export default ModalAreas = (props) => {
  const [convenio, setConv] = useConvenio();
  const { visible, areas } = props;
  const [modal, setModal] = visible;

  return (
    <Modal visible={modal} transparent>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#f1f1f1",
          borderRadius: 5,
          padding: 10,
        }}
      >
        <Text style={{ alignSelf: "center", marginTop: "10%" }}>
          SELECIONE A ÁREA DE LANÇAMENTO
        </Text>
        <View style={{ marginBottom: "50%", paddingVertical: 5 }}>
          <FlatList
            data={areas}
            keyExtractor={(item) => item.cd_da_area}
            style={{
              paddingVertical: 5,
            }}
            renderItem={({ item }) => {
              if (item.cd_da_area != "0045")
                return (
                  <View
                    style={{
                      margin: 5,

                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      key="entrar"
                      style={[
                        styles.btnDefault,
                        {
                          padding: 10,
                          paddingHorizontal: 20,
                          backgroundColor: "#114267",
                          width: "80%",
                          height: 100,
                        },
                      ]}
                      onPress={() => {
                        setConv({
                          ...convenio,
                          tipo_lancamento: item.tipo_lancamento,
                          cd_da_area: item.cd_da_area,
                          nome_area: `${
                            areas.find((i) => i.cd_da_area == item.cd_da_area)[
                              "Descrição"
                            ]
                          }`,
                        });

                        setModal(false);
                      }}
                    >
                      <Image
                        source={{ uri: item.caminho_icone }}
                        style={{
                          width: 50,
                          height: 50,
                          resizeMode: "contain",
                          tintColor: "white",
                        }}
                      />
                      <Text style={{ color: "white" }}>
                        {item["Descrição"]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
