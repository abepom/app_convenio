import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Modal } from "react-native";
import formatCurrency from "currency-formatter";
import LancamentoComProcedimentos from "../Components/GrupoDeLancamentos/LancamentoComProcedimento";
import LancamentoRepasseParceladoABEPOM from "../Components/GrupoDeLancamentos/LancamentoRepasseParceladoABEPOM";
import LancamentoRepasseParceladoConvenio from "../Components/GrupoDeLancamentos/LancamentoRepasseParceladoConvenio";
import LancamentoSemProcedimento from "../Components/GrupoDeLancamentos/LancamentoSemProcedimento";
import { primary } from "../utils/Style";
import api from "../api";

import useConvenio from "../Data/Convenio";
import MenuTop from "./../Components/MenuTop";
import LancamentoComProntuario from "../Components/GrupoDeLancamentos/LancamentoComProntuario";

const CadastrarVenda = (props) => {
  const { matricula, dep, nome, titular } = props.route.params;
  const [{ token, tipo_lancamento }] = useConvenio();

  const [limiteAtual, setLimiteAtual] = useState("");

  const consultarLimite = async () => {
    let { data } = await api({
      url: `/limite?cartao=${matricula}`,
      method: "get",
      headers: { "x-access-token": token },
    });

    setLimiteAtual(data.limite);
  };

  useEffect(() => {
    consultarLimite();
  }, []);

  return (
    <>
      <MenuTop {...props} title="Cadastrar Lançamento">
        <View
          style={{
            width: Dimensions.get("screen").width,
            alignItems: "center",
          }}
        >
          <View
            style={{
              marginTop: 20,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 3,
              elevation: 2,
              width: "80%",
              borderColor: primary,
              borderWidth: 1,
            }}
          >
            {titular != nome ? (
              <>
                <Text style={{ color: primary }}>Dependente: {nome}</Text>
                <Text style={{ color: primary }}>Associado: {titular}</Text>
              </>
            ) : (
              <Text style={{ color: primary }}>Associado: {nome}</Text>
            )}
            <Text style={{ color: primary }}>Matrícula: {matricula}</Text>

            <Text style={{ color: primary }}>
              Limite:{" "}
              {limiteAtual > 150
                ? "R$ +150,00"
                : formatCurrency.format(limiteAtual, { code: "BRL" })}
            </Text>
          </View>
        </View>
        {tipo_lancamento == "1" && (
          <LancamentoComProcedimentos
            associado={{ matricula, dep }}
            props={props}
          />
        )}
        {tipo_lancamento == "2" && (
          <>
            <LancamentoRepasseParceladoABEPOM
              associado={{ matricula, dep }}
              props={props}
              style={{ backgroundColor: "blue" }}
            />
          </>
        )}
        {tipo_lancamento == "3" && (
          <LancamentoRepasseParceladoConvenio
            associado={{ matricula, dep }}
            props={props}
            style={{ backgroundColor: "blue" }}
          />
        )}
        {tipo_lancamento == "4" && (
          <LancamentoComProntuario
            associado={{ matricula, dep }}
            props={props}
            style={{ backgroundColor: "blue" }}
          />
        )}

        {tipo_lancamento == "5" && (
          <LancamentoSemProcedimento
            associado={{ matricula, dep }}
            props={props}
            style={{ backgroundColor: "blue" }}
          />
        )}
      </MenuTop>
    </>
  );
};

export default CadastrarVenda;
