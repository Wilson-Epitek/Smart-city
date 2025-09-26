import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
 
const App = () => {
  const [toilets, setToilets] = useState([]);
  const [selectedToilet, setSelectedToilet] = useState(null);
 
  useEffect(() => {
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

  const handleReportProblem = () => {
    // Fonction pour signaler un problème - à implémenter plus tard
    console.log('Signaler un problème pour:', selectedToilet);
  };
 
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}

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
        <View style={styles.infoBox}>
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
            onPress={handleReportProblem}
          >
            <Text style={styles.reportButtonText}>⚠️ Signaler un problème</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
 
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
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
    paddingRight: 40, // Pour éviter le chevauchement avec le X
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
});
 
export default App;