import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Report from '../screens/Report'; 

export default function MapScreen() {
  const [toilets, setToilets] = useState([]);
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            'Permission de localisation refusée. La carte se centrera sur Paris.'
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(userCoords);
        
        setInitialRegion({
          ...userCoords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération de la localisation:', error);
        Alert.alert('Erreur', 'Impossible de récupérer votre position.');
      }
    };

    getLocation();

    fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=sanisettesparis&rows=100')
      .then(res => res.json())
      .then(data => {
        const list = data.records.map((r, i) => {
          return {
            id: i,
            lat: r.fields.geo_point_2d[0],
            lon: r.fields.geo_point_2d[1],
            nom: r.fields.nom,
            adresse: r.fields.adresse,
            horaire: r.fields.horaire,
            pmr: r.fields.acces_pmr,
            relais_bebe: r.fields.relais_bebe,
            arrondissement: r.fields.arrondissement,
          };
        });
        setToilets(list);
      })
      .catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={false}
        showsCompass={true}
      >
        {toilets.map(toilet => (
          <Marker
            key={toilet.id}
            coordinate={{ latitude: toilet.lat, longitude: toilet.lon }}
            onPress={() => setSelectedToilet(toilet)}
          />
        ))}
      </MapView>

      {selectedToilet && (
        <View style={styles.infoBox} pointerEvents="box-none">
          <TouchableOpacity 
            style={styles.closeX}
            onPress={() => setSelectedToilet(null)}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text style={styles.closeXText}>✕</Text>
          </TouchableOpacity> 

          <Text style={styles.title}>{selectedToilet.nom || 'Sanisette'}</Text>
          <Text style={styles.infoText}>Adresse : {selectedToilet.adresse || 'Non disponible'}</Text>
          <Text style={styles.infoText}>Arrondissement : {selectedToilet.arrondissement || 'Non renseigné'}</Text>
          <Text style={styles.infoText}>Horaires : {selectedToilet.horaire || 'Non renseigné'}</Text>
          <Text style={styles.infoText}>PMR : {selectedToilet.pmr === 'Oui' ? 'Oui' : 'Non'}</Text>
          <Text style={styles.infoText}>Relais bébé : {selectedToilet.relais_bebe === 'Oui' ? 'Oui' : 'Non'}</Text>
 
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setShowReport(true)}
          >
            <Text style={styles.reportButtonText}>⚠️ Signaler un problème</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showReport}
        animationType="slide"
        onRequestClose={() => setShowReport(false)}
      >
        <Report />
        <TouchableOpacity 
          onPress={() => setShowReport(false)} 
          style={styles.closeReportButton}
        >
          <Text style={styles.closeReportButtonText}>Fermer</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  closeX: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    zIndex: 1000,
    elevation: 10,
  },
  closeXText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    paddingRight: 40,
  },
  infoText: {
    marginBottom: 3,
    fontSize: 14,
  },
  reportButton: {
    marginTop: 10,
    backgroundColor: '#8B0000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  closeReportButton: {
    padding: 15,
    backgroundColor: '#8B0000',
  },
  closeReportButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});
