import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [toilets, setToilets] = useState([]);

  useEffect(() => {
    fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=sanisettesparis&rows=100')
      .then((res) => res.json())
      .then((data) => {
        const list = data.records.map((r, i) => {
          const [lat, lon] = r.fields.geo_point_2d;
          return { id: i, lat, lon };
        });
        setToilets(list);
      });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {toilets.map((t) => (
          <Marker
            key={t.id}
            coordinate={{ latitude: t.lat, longitude: t.lon }}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default App;