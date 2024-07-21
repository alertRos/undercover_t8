import { StatusBar } from 'expo-status-bar';
import { ScrollView, Modal, Text, TextInput, TouchableOpacity, View, Image, Platform, Button, ImageBackground } from 'react-native';
import React, {useEffect, useState} from 'react';
import { styles } from '../assets/styles/incidents_style';
import * as SQLite from 'expo-sqlite'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import {Audio} from 'expo-av'
import { useFocusEffect } from '@react-navigation/native';

const Incidents = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  const [audioUri, setAudioUri] = useState('');
  const [result, setResult] = useState('');
  const [open_dateP, setOpen] = useState(false);  
  const [edit, setEdit] = useState(false);
  
  type prop = {
    id: number,
    title: string,
    desc: string,
    date: string,
    image: string,
    audio: string
  }
  
  const [cardModal, setCardModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePicker, setDatePicker] = useState(new Date());
  const [incidentList, setIncidentList] = useState<prop[]>([]);
  const [incident, setIncident] = useState<prop>({id: 0, title: '', desc: '', date: '', image: '', audio: ''});
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(new Audio.Sound());
  
  useEffect(() => {
    async function initializeDatabase() {
      const db = await SQLite.openDatabaseAsync('undercover');
      await db.execAsync('CREATE TABLE IF NOT EXISTS Incident (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, desc TEXT, date TEXT, image TEXT, audio TEXT);');
      setIncidentList(await db.getAllAsync('SELECT * FROM Incident'));
      await db.closeAsync();
    };
    initializeDatabase();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      async function update() {
        const db = await SQLite.openDatabaseAsync('undercover');
        setIncidentList(await db.getAllSync('SELECT * FROM Incident'));
        await db.closeAsync();
      };
      update();
    }, [])
  );

  const createIncident = async (incidentId: number) => {
    if (edit) {
      const updatedTitle = title.trim() ? title : incident.title;
      const updatedDesc = desc.trim() ? desc : incident.desc;
      const updatedDate = date.trim() ? date : incident.date;
      const updatedImage = image.trim() ? image : incident.image;
      const updatedAudio = audioUri.trim() ? audioUri : incident.audio;

      const db = await SQLite.openDatabaseAsync('undercover');
      await db.execAsync(`UPDATE Incident SET title ='${updatedTitle}', "desc" ='${updatedDesc}', date ='${updatedDate}', image ='${updatedImage}', audio ='${updatedAudio}' WHERE id=${incidentId};`);

      setIncidentList(await db.getAllSync('SELECT * FROM Incident'));
      await db.closeAsync();
      setEdit(false);
      setCardModal(false);
      setTitle(''); setDesc(''); setImage(''); setDate(''); setAudioUri('');
    } else {
      let error = false;
    
      if (title.trim().length === 0 || desc.trim().length === 0 || date.trim().length === 0 || image.trim().length === 0 || audioUri.trim().length === 0) {
        setResult('Completa todos los campos y sube una imagen y un audio asociado');
        error = true;
      }
      if (!error) {
        setResult('');
        const db = await SQLite.openDatabaseAsync('undercover');
        await db.execAsync(`INSERT INTO Incident(title, "desc", date, image, audio) VALUES('${title}', '${desc}', '${date}', '${image}', '${audioUri}');`);
        setIncidentList(await db.getAllSync('SELECT * FROM Incident'));
        await db.closeAsync();
        setCreateModal(false);
        setTitle(''); setDesc(''); setImage(''); setDate(''); setAudioUri('');
      }
    }
  };

  

  const getIncident = async (incidentId: number) => {
    const db = await SQLite.openDatabaseAsync('undercover');
    const result = await db.getFirstAsync<prop>(`SELECT * FROM Incident WHERE id = ${incidentId};`) ?? {id: 0, title: '', desc: '', date: '', image: '', audio: ''};

    const newIncident: prop = {
      id: result.id,
      title: result.title,
      desc: result.desc,
      date: result.date,
      image: result.image,
      audio: result.audio
    };

    setIncident(newIncident);
    await db.closeAsync();
  }

  const selectCardView = (incidentId: number) => {
    getIncident(incidentId);
    setCardModal(true);
  }

  const deleteIncident = async (incidentId: number) => {
    const db = await SQLite.openDatabaseAsync('undercover');
    await db.execAsync(`DELETE FROM Incident WHERE id = ${incidentId};`)
    setIncidentList(await db.getAllSync('SELECT * FROM Incident'));
    await db.closeAsync();
    setCardModal(false);
  }

  const loadImage = async() => {
    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    if (!imageResult.canceled) {
      setImage(imageResult.assets[0].uri)
      if (edit) {
        incident.image = imageResult.assets[0].uri
        if (edit) {
          setIncident(prev => ({ ...prev, image: imageResult.assets[0].uri }));
        }
      }
    }
  }

  const uploadAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['audio/*'] });
    if (!result.canceled) {
      setAudioUri(result.assets[0].uri);
    }
  }

  const playAudio = async () => {
    if(!isPlaying){
      await sound.loadAsync({
          uri: incident.audio
      })
      await sound.playAsync()
    }else{
      await sound.unloadAsync();
      await sound.stopAsync();
    }
  }

  const closeViewModal = async () => {
    setCardModal(false);
    setEdit(false);
    setTitle(''); 
    setDesc(''); 
    setImage(''); 
    setDate(''); 
    setAudioUri(''); 
    setResult('');
  }

  return (
    <View style={styles.container}>
      <ImageBackground resizeMode='cover'  source={require('../assets/images/grid.jpg')} style={{flex: 1, width: 400, height: 200, justifyContent: 'center'}}>
        <View style={styles.header}>
          <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom:10, marginTop: 15, color: '#fff'}}>Incidents</Text>
          <TouchableOpacity onPress={() => setCreateModal(true)}>
            <View style={styles.createIncidentBtn}>
              <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', color: '#405d89'}}> +    Registrar incidencia</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Modal transparent={true} visible={createModal}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.cardModal}>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#A50F0F'}}>Registra tu incidencia</Text>
            <TextInput
              value={title}
              placeholder='Ingresa un título'
              onChangeText={setTitle}
              style={styles.formInput}
            />
            <TextInput
              value={desc}
              placeholder='Describe la incidencia'
              onChangeText={setDesc}
              style={styles.formInput}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={styles.uploadInput}>
                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', padding: 10, fontWeight: 'bold'}}>SELECCIONAR FECHA</Text>
              </View>
            </TouchableOpacity>
            <TextInput
              readOnly
              value={date}
              placeholder='Selecciona una fecha'
              onChangeText={setDate}
              style={styles.formInput}
            />

            {showDatePicker &&
              <DateTimePicker
                value={datePicker}
                mode='date'
                display='default'       
                onChange={(event, dateS) => {
                  const newDate = dateS || date;
                  setDate(newDate.toString())
                  setShowDatePicker(Platform.OS === 'ios');
                }}
                locale='es-ES'
              />
            }

            <TouchableOpacity onPress={() => loadImage()}>
              <View style={styles.uploadInput}>
                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', padding: 10, fontWeight: 'bold'}}>CARGAR IMAGEN</Text>
              </View>
            </TouchableOpacity>

            {image && <Image source={{uri: image}} style={{width: 200, height: 160, margin: 10}}/>}

            <TouchableOpacity onPress={() => uploadAudio()}>
              <View style={styles.uploadInput}>
                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', padding: 10, fontWeight: 'bold'}}>SUBIR AUDIO</Text>
              </View>
            </TouchableOpacity>

            {audioUri && <Text style={{margin: 10}}>Audio cargado</Text>}

            <View style={{width: 250}}>
              <Text style={{color:'darkred', fontSize: 16, textAlign: 'center'}}>{result}</Text>
            </View>

            <TouchableOpacity onPress={() => createIncident(0)}>
              <View style={styles.register}>
                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>REGISTRAR</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setCreateModal(false), setTitle(''); setDesc(''); setImage(''); setDate(''); setAudioUri(''); setResult('');}}>
              <View style={styles.close}>
                <Text style={{color: 'white', fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>CERRAR</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <View style={{height: 620}}>
        <ScrollView style={{marginTop: 10, width: 400}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10}}>
            {incidentList.map((i_incident) => (
              <TouchableOpacity key={i_incident.id} onPress={() => selectCardView(i_incident.id)}>
                <View style={styles.cardView}>
                  <View style={{flexDirection: 'row'}}> 
                    <Image source={require('../assets/images/icon.png')} style={{bottom: 1, width: 25, height: 25, marginRight: 10}}/>
                    <Text style={{fontSize: 20, color: 'white'}}>{i_incident.title}</Text>
                  </View>
                  <Text style={{fontSize: 16, color: '#c9c8c7', fontWeight: '400', paddingTop: 5}}>{i_incident.desc.length > 50 ? i_incident.desc.substring(0, 50) + '...' : i_incident.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      
      <Modal transparent={true} visible={cardModal}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.cardModal}>
            {edit ? (
              <>
                <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#A50F0F'}}>Edita tu incidencia</Text>
                <TextInput
                  defaultValue={incident.title}
                  placeholder='Ingresa un título'
                  onChangeText={setTitle}
                  style={styles.formInput}
                />
                <TextInput
                  defaultValue={incident.desc}
                  placeholder='Describe la incidencia'
                  onChangeText={setDesc}
                  style={styles.formInput}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View style={styles.uploadInput}>
                    <Text style={{color: 'white', fontSize: 16, textAlign: 'center', padding: 10, fontWeight: 'bold'}}>SELECCIONAR FECHA</Text>
                  </View>
                </TouchableOpacity>
                <TextInput
                  readOnly
                  value={date}
                  defaultValue={incident.date}
                  placeholder='Selecciona una fecha'
                  onChangeText={setDate}
                  style={styles.formInput}
                />

                {showDatePicker &&
                  <DateTimePicker
                    value={datePicker}
                    mode='date'
                    display='default'
                    onChange={(event, dateS) => {
                      const newDate = dateS || date;
                      setDate(newDate.toString())
                      setShowDatePicker(Platform.OS === 'ios');
                    }}
                    locale='es-ES'
                  />
                }

                <TouchableOpacity onPress={() => loadImage()}>
                  <View style={styles.uploadInput}>
                    <Text style={{color: 'white', fontSize: 16, textAlign: 'center', padding: 10, fontWeight: 'bold'}}>CARGAR IMAGEN</Text>
                  </View>
                </TouchableOpacity>

                {incident.image && <Image source={{uri: incident.image}} style={{width: 200, height: 160, margin: 10}}/>}
                
                <TouchableOpacity onPress={() => uploadAudio()}>
                  <View style={styles.uploadInput}>
                    <Text style={{color: 'white', fontSize: 16, textAlign: 'center', padding: 10, fontWeight: 'bold'}}>SUBIR AUDIO</Text>
                  </View>
                </TouchableOpacity>

                {audioUri && <Text style={{margin: 10}}>Audio cargado</Text>}

                <View style={{width: 250}}>
                  <Text style={{color:'darkred', fontSize: 16, textAlign: 'center'}}>{result}</Text>
                </View>

                <TouchableOpacity onPress={() => createIncident(incident.id)}>
                  <View style={styles.register}>
                    <Text style={{color: 'white', fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>EDITAR</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => closeViewModal()}>
                  <View style={styles.close}>
                    <Text style={{color: 'white', fontSize: 16, textAlign: 'center', fontWeight: 'bold'}}>CERRAR</Text>
                  </View>
                </TouchableOpacity>
              </>
            ):(
              <>
                <Text style={{fontWeight: 'bold', marginBottom: 20, fontSize: 18, textAlign: 'left', width: 260, color: '#5d5d5d'}}> 
                  {incident.date}
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 22, textAlign: 'center', color: '#A50F0F'}}>
                  {incident.title}
                </Text>

                <ScrollView style={{width: 260, height: 100, marginTop: 20}}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {incident.image && <Image source={{uri: incident.image}} style={{width: 200, height: 160, margin: 10, alignItems: 'center'}}/>}
                  </View>
                  <Text style={{fontWeight: 'bold', fontSize: 18, textAlign: 'justify', color: '#4F4F4F'}}>
                    {incident.desc}
                  </Text>
                </ScrollView>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <TouchableOpacity onPress={() => {setEdit(true); setImage(incident.image); setDate(incident.date); setAudioUri(incident.audio); }}>
                    <View style={styles.register}>
                      <Text style={{color: 'white', fontSize: 18, textAlign: 'center'}}>EDITAR</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async () => {closeViewModal() ;setIsPlaying(false);await sound.unloadAsync(); await sound.stopAsync();}}>
                    <View style={styles.uploadInput}>
                      <Text style={{color: 'black', fontSize: 18, textAlign: 'center', padding: 10}}>CERRAR</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteIncident(incident.id)}>
                    <View style={styles.uploadInput}>
                      <Text style={{color: 'black', fontSize: 18, textAlign: 'center', padding: 10}}>ELIMINAR</Text>
                    </View>
                  </TouchableOpacity>
                  {isPlaying == false ? (
                    <TouchableOpacity onPress={() => {playAudio(), setIsPlaying(true)}}>
                    <View style={styles.uploadInput}>
                      <Text style={{color: 'black', fontSize: 18, textAlign: 'center', padding: 10}}>REPRODUCIR AUDIO</Text>
                    </View>
                  </TouchableOpacity>
                                      
                  ):(
                    <TouchableOpacity onPress={() => {playAudio(), setIsPlaying(false)}}>
                    <View style={styles.uploadInput}>
                      <Text style={{color: 'black', fontSize: 18, textAlign: 'center', padding: 10}}>PAUSAR AUDIO</Text>
                    </View>
                  </TouchableOpacity>
                  )}

                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

export default Incidents