import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, TextInput, View, FlatList, Text, Modal, TouchableHighlight, Dimensions, Image, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { issue, broadcast, invokeScript, nodeInteraction } from '@waves/waves-transactions';

const data = {
  timestamp: 1567884743,
  title: 'Концерт "Ленинград"',
  place: 'Олимпийский',
  description: 'Концерт в Олимпийском. Все самые любимые песни для Вас.',
  image: 'url',
  price: '10800',
}


const createTickets = async (name, description, quantity, price, cb) => {
  const nodeUrl = 'https://testnodes.wavesnodes.com/';
  const seed = await AsyncStorage.getItem('@Store:seed');
  const dApp = await AsyncStorage.getItem('@Store:dApp');
  console.log(seed);
  console.log(dApp);

  try {
    const signedIssueTx = issue({
      name,
      description,
      // With given options you'll have 100000.00000 tokens
      quantity,
      decimals: 0,
      precision: 0,
      // This flag defines whether additional emission is possible
      reissuable: false,
      fee: 100000000,
      timestamp: Date.now(),
      chainId: 'T'
    }, seed)
    broadcast(signedIssueTx, nodeUrl).then(resp => {
      setTimeout(() => {
        const signedInvokeScript = invokeScript({
          dApp,
          call: {
            function: 'createOrder',
            args: [{
              type: 'integer',
              value: price,
            }],
          },
          payment: [{ amount: quantity, assetId: resp.assetId }],
          chainId: 'T'
        }, seed)
        broadcast(signedInvokeScript, nodeUrl).then(resp => {
          cb(null, resp)
        })
      }, 10000);
    })
  } catch (err) {
    cb(err);
  }
}



export default function EventsScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [place, setPlace] = useState('');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState('');

  useEffect(() => {
    // setModalVisible(false)
  });

  return (
    <View style={s.container}>
      <ScrollView style={s.container}>
        <View>
          <View style={s.itemCenter}>
            <Text style={s.itemTitle}>Новое событие</Text>
          </View>

          <View style={s.itemCenter}>
            <TextInput
              style={s.input}
              onChangeText={text => setTitle(text)}
              value={title}
              placeholder="Наименование"
            />
            <TextInput
              style={s.input}
              onChangeText={text => setDescription(text)}
              value={description}
              placeholder="Описание"
            />
            <TextInput
              style={s.input}
              onChangeText={text => setTimestamp(text)}
              value={timestamp}
              placeholder="Время начала"
            />
            <TextInput
              style={s.input}
              onChangeText={text => setPlace(text)}
              value={place}
              placeholder="Место проведения"
            />
            {/*// TODO: add picture*/}
            <TextInput
              style={s.input}
              onChangeText={text => setPrice(text)}
              value={price}
              placeholder="Стоимость билета"
            />
            <TextInput
              style={s.input}
              onChangeText={text => setCount(text)}
              value={count}
              placeholder="Количество билетов"
            />
            <View style={s.itemHorizontal}>
              <Text style={s.addImageText}>Добавить фото</Text>
              <Image
                source={require('../assets/images/image.png')}
                style={s.addImage}
              />
            </View>
          </View>


          <View style={s.itemCenter}>
            <TouchableHighlight
              title="Создать"
              style={s.button}
              onPress={async ()=>{
                await createTickets(title, description, count, price * 100000000, (err, tx) => {
                  console.log(err,tx);
                });
              }}
            >
              <Text style={s.textButton}>Создать</Text>
            </TouchableHighlight>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

EventsScreen.navigationOptions = {
  title: 'Событие',
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  input: {
    margin: 5,
    padding: 5,
    height: 40,
    width: '80%',
    borderBottomColor: '#42a5f5',
    borderBottomWidth: 2,
    // borderRadius: 20,
    // fontSize: 16,
    // color: '#2e78b7',
    // backgroundColor: 'rgba(21, 30, 51, 0.01)',
    // boxShadow: 'inset 0px 0px 10px rgba(21, 30, 51, 0.2)'
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    //fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  itemTimestamp: {
    paddingLeft: 5,
    fontSize: 14,
    // color: 'gray'
  },
  itemPrice: {
    paddingLeft: 5,
    fontSize: 20,
    //fontWeight: 'bold',
    // color: 'gray'
  },
  itemTitle: {
    paddingLeft: 5,
    fontSize: 16,
    //fontWeight: 500,
    color: 'black'
  },
  itemPlace: {
    paddingLeft: 5,
    fontSize: 12,
    color: 'gray'
  },
  itemCenter: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    fontSize: 18,
    height: 44,
    // borderBottom: 'solid 1px gray',
    // borderBottomColor: 'rgba(0,0,0,0.05)',
    // borderBottomWidth: 1,
  },
  itemImage: {
    alignItems: 'center'
  },
  itemInfo: {
    // alignItems: 'center'
    padding: 10,
  },
  itemHorizontal: {
    flexDirection: 'row',
    // alignItems: 'center'
    // padding: 10,
  },
  item: {
    flexDirection: 'row',
    // alignItems: 'center'
    // padding: 10,
  },
  button: {
    alignItems: 'center',
    margin: 5,
    padding: 10,
    height: 40,
    width: '60%',
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 20,
    backgroundColor: '#42a5f5',
    color: '#fff',
    // boxShadow: '0px 5px 15px rgba(21, 30, 51, 0.2)'
  },
  textButton: {
    color: '#fff',
  },
  addImage: {
    width: 80,
    height: 65,
  },
  addImageText: {
    color: 'gray',
    marginTop: 20,
    marginRight: 20,
  }
});
