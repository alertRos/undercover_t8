import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../assets/styles/home_style'
import * as SQLite from 'expo-sqlite'
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const [count, setCount] = useState(0);
  type prop = {
    id: number,
    title: string,
    desc: string,
    date: string,
    image: string,
    audio: string
  }

  const [incidentList, setIncidentList] = useState<prop[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      async function initializeDatabase() {
        const db = await SQLite.openDatabaseAsync('undercover');
        await db.execAsync('CREATE TABLE IF NOT EXISTS Incident (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, desc TEXT, date TEXT, image TEXT, audio TEXT);');
        setIncidentList(await db.getAllAsync('SELECT * FROM Incident'));
        await db.closeAsync();
      };
      initializeDatabase();

      async function update() {
        const db = await SQLite.openDatabaseAsync('undercover');
        setIncidentList(await db.getAllSync('SELECT * FROM Incident ORDER BY id DESC LIMIT 3'));
        const totalCountResult: { count: number }[] = await db.getAllSync(`SELECT COUNT(*) as count FROM Incident`);
        setCount(totalCountResult.length > 0 ? totalCountResult[0].count : 0);
        await db.closeAsync();
      };
      update();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        resizeMode='cover'
        source={require('../assets/images/background.jpeg')} style={{ flex: 1, justifyContent: 'space-between' }}
      >
        <View style={styles.header}>
          <Image source={require('../assets/images/badge.png')} style={{ width: 60, height: 60 }} />
          <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold', paddingTop: 10 }}>UNDERCOVER POLICE MANAGEMENT</Text>
          <Text style={{ fontSize: 18, color: '#b6e2ff', fontWeight: '400', paddingTop: 15 }}>Bienvenido, agente </Text>
        </View>
        <View style={{ flexDirection: 'column', alignContent: 'flex-end', alignItems: 'flex-end', paddingRight: 10, backgroundColor: 'rgba(72, 92, 110, 0.38)' }}>
          <View style={styles.mid}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontSize: 36, color: '#b6e2ff', fontWeight: 'bold', paddingTop: 10, textAlign: 'right' }}>{count}</Text>
              <Text style={{ fontSize: 16, color: 'white', fontWeight: '400', textAlign: 'right' }}>INCIDENTES REGISTRADOS</Text>
            </View>
            <Image source={require('../assets/images/shield.png')} style={{ width: 110, height: 110 }} />
          </View>
        </View>
        <View>

        <View style={styles.card_title}><Text style={{ fontSize: 18, color: '#b6e2ff', fontWeight: '600', marginLeft: 10 }}>ULTIMOS INCIDENTES</Text></View>
          <View style={styles.card_container}>
            
            <View style={styles.card}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                {incidentList.map((i_incident) => (
                  <View style={styles.card} key={i_incident.id}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/images/icon.png')} style={{ bottom: 1, width: 25, height: 25, marginRight: 10 }} />
                      <Text style={{ fontSize: 20, color: 'white' }}>{i_incident.title}</Text>
                    </View>
                    <Text style={{ fontSize: 16, color: '#c9c8c7', fontWeight: '400', paddingTop: 5 }}>{i_incident.desc.length > 50 ? i_incident.desc.substring(0, 50) + '...' : i_incident.desc}</Text>
                  </View>
                ))}
              </View>
          </View>
        </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Home