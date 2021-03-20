import React, { useState } from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Keyboard,
  FlatList
} from 'react-native';

import PrevisaoItem from './components/PrevisaoItem';

import chaves from './chaves';

export default function App() {
  const [cidade, setCidade] = useState("");
  const [previsoes, setPrevisoes] = useState([]);

  const apiForeCast = 'https://api.openweathermap.org/data/2.5/forecast?lang=pt&units=metric&q=';
  const apiOneCast = 'https://api.openweathermap.org/data/2.5/onecall?exclude=hourly,daily,minutely,alerts&units=metric&';

  const chave = chaves.chave;

  const capturarCidade = (cidade) => {
    setCidade(cidade);
  }

  const obterPrevisoes = () => {
    setPrevisoes([]);
    const target = `${apiForeCast}${cidade}&appid=${chave}`;
    fetch(target)
    .then((dados) => dados.json())
    .then((dados) => {
      let localizacao = dados["city"];
      const targetOneCall = `${apiOneCast}lat=${localizacao.coord.lat}&lon=${localizacao.coord.lon}&appid=${chave}`;
      fetch(targetOneCall)
      .then((dados) => dados.json())
      .then((dados) => {
        setPrevisoes([dados["current"]]);
        setCidade('');
        Keyboard.dismiss();
      }
    )});
  }



  return (
    <View style={styles.container}>
      <View style={styles.entrada}>
        <TextInput
          placeholder="Digite uma cidade..."
          style={styles.nomeCidade}
          value={cidade}
          onChangeText={capturarCidade} 
        />
        <Button
          title="OK"
          onPress={obterPrevisoes}
        />
      </View>
      <FlatList
        data={previsoes}
        renderItem={
          previsao => (
            <PrevisaoItem previsao={previsao.item} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 60,
    flexDirection: "column",
    flex: 1,
    backgroundColor: "white"
  },
  entrada: {
    marginBottom: 12
  },
  nomeCidade: {
    padding: 12,
    borderBottomColor: "#BB96F3",
    borderBottomWidth: 2,
    textAlign: "center",
    marginBottom: 8
  }
});