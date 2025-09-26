import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'

function Report() {
  const [choix, setChoix] = useState('')
  const options = ['Fermée', 'Hors service', 'Sale', 'Cassée']

  function handleSubmit() {
    if (choix === '') {
      Alert.alert('Erreur', 'Veuillez sélectionner une option.')
      return
    }
    Alert.alert('Signalement envoyé', 'Choix : ' + choix)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3e4e4ff', padding: 20 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Signaler un problème</Text>

        {options.map(function(option) {
          return (
            <TouchableOpacity
              key={option}
              style={styles.optionContainer}
              onPress={function() {
                setChoix(option)
              }}
            >
              <View
                style={[
                  styles.circle,
                  choix === option ? styles.selectedCircle : null,
                ]}
              />

              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          )
        })}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#8B0000',  
    backgroundColor: '#ffe6e6ff', 
    padding: 20,
    marginTop: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#202020ff',
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  circle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B0000', 
    marginRight: 15,
  },
  selectedCircle: {
    backgroundColor: '#c20707ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Report;