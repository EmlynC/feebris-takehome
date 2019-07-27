import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, TouchableHighlight} from 'react-native';

import t from 'tcomb-form-native';

const API_URL = 'https://s8ynpxyiwh.execute-api.eu-west-2.amazonaws.com/emlyn';

let Form = t.form.Form;

let FluCheckForm = t.struct({
  hasFever: t.Boolean,
  temperature: t.String,
  hasCough: t.Boolean,
});

export default class App extends Component {
  
  state = {
    formData: {
      hasFever: null,
      temperature: null,
      hasCough: null,
    },
    diagnosis: '',
  };
  
  onChange(formData) {
    this.setState({formData});
  };
  
  options = {
    fields: {
      hasFever: {
        label: 'Do you have a fever and has it lasted 5 or more days?',
        error: "We need to know if you've had a fever in the last five days."
      },
      temperature: {
        label: 'Please measure your temperature, then provide your reading in degree celsius',
        error: "Please enter your current temperature."
      },
      hasCough: {
        label: "Have you been coughing regularly within the last 5 days?",
        error: "We need to know if you've had a cough recently."
      }
    }
  };
  
  onPress() {
    let val = this.refs.form.getValue();
    
    // send value to the backend
    fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.formData),
    });
    
    if (val.hasCough && val.hasFever && val.temperature > 38) {
      this.setState({
        'diagnosis': 'Based on your answers, it is likely that you have flu.'
      })
    } else {
      this.setState({
        'diagnosis': 'Based on your answers, it is unlikely that you have flu.'
      })
    }
  }
  
  render() {
    return (
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.container}>
            
            <Text style={styles.title}>Flu Check Questionnaire</Text>
            
            <Form
                ref="form"
                type={FluCheckForm}
                value={this.state.formData}
                options={this.options}
                onChange={this.onChange.bind(this)}
            />
            
            <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
            
            <Text style={styles.result}>
              Result: <Text style={styles.diagnosis}>{this.state.diagnosis}</Text>
            </Text>
          
          </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    top: 50,
    padding: 40
  },
  title: {
    alignItems: 'flex-start',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#0299c8',
    borderColor: '#0299c8',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  result: {
    paddingTop: 20,
    fontSize: 20,
  },
  diagnosis : {
    fontWeight: 'bold',
  }
});
