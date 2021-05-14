import React, {useState, useEffect} from 'react';
import { StyleSheet, TextInput, View, Button, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import ENV from './env';
import * as firebase from  'firebase';
import 'firebase/firestore'
if (!firebase.apps.length)
  firebase.initializeApp(ENV);

const db = firebase.firestore();

export default function App() {

  const [lembrete, setLembrete] = useState('');
  const [lembretes, setLembretes] = useState([]);

  useEffect(() => {
    db.collection('lembretes').onSnapshot ((snapshot) => {
      let aux = [];
      snapshot.forEach(doc => {
        aux.push({
          data: doc.data().data,
          texto: doc.data().texto,
          chave: doc.id
        })
      });
      setLembretes(aux);
    })
  }, []);

  const capturarLembrete = (lembrete) => {
    setLembrete(lembrete);
  }

  const adicionarLembrete = () => {
    db.collection('lembretes').add({
      texto: lembrete,
      data: new Date()
    })
    setLembrete('')
  }

  const removerLembrete = (chave) => {
    Alert.alert(
      'Apagar?',
      'Quer mesmo apagar seu lembrete?',
      [
        {text: 'Cancelar'},
        { text: "Sim!", onPress: () => db.collection('lembretes').doc(chave).delete() }
      ]
    )
    
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.entrada}
        placeholder="Digite seu lembrete"
        onChangeText={capturarLembrete}
        value={lembrete}
      />
      <View style={styles.botao}>
        <Button 
          title="OK"
          onPress={adicionarLembrete}
        />
      </View>
      <FlatList 
        style = {{ marginTop: 8}}
        data={lembretes}
        renderItem={lembrete => (
          <TouchableOpacity onLongPress={() => removerLembrete(lembrete.item.chave)}>
            <View style={styles.itemNaLista}>
              <Text>{lembrete.item.texto}</Text>
              <Text>{lembrete.item.data.toDate().toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60
  },
  entrada: {
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    fontSize:14,
    textAlign: 'center',
    width:"80%",
    marginBottom: 12
  },
  botao: {
    width: '80%'
  },
  itemNaLista: {
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  }
});
