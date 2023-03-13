import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'

interface DataType {
  cc: string
  exchangedate: string
  rate: number
}

export default function App() {
  const [data, setData] = useState<DataType[]>([])
  const [text, setText] = useState<string>('')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const handleToggleTheme = () => setIsDarkMode(!isDarkMode)

  const appStyle = {
    ...styles.container,
    backgroundColor: isDarkMode ? '#333' : '#e5e5e5',
  }

  const titleStyle = {
    ...styles.title,
    color: isDarkMode ? '#e5e5e5' : '#333',
  }

  const inputStyleContainer = {
    ...styles.inputContainer,
    borderColor: isFocused ? '#456DF2' : 'grey',
  }

  const placehodlerStyle = isDarkMode ? '#e5e5e5' : '#333'

  const inputStyle = {
    ...styles.input,
    color: isDarkMode ? '#e5e5e5' : '#333',
  }

  const outputStyle = {
    ...styles.output,
    color: isDarkMode ? '#e5e5e5' : '#333',
  }

  const infoStyle = {
    ...styles.info,
    color: isDarkMode ? '#e5e5e5' : '#333',
  }

  useEffect(() => {
    fetch(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json'
    )
      .then((res) => res.json())
      .then((response) =>
        setData([response.find((el: DataType) => el.cc === 'USD')])
      )
      .catch((e) => console.log(e))

    return () => setData([])
  }, [])

  const currencyFormat = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  })

  const formattedNumber = (textValue: number) =>
    currencyFormat.format(textValue)

  return (
    <View onTouchStart={Keyboard.dismiss} style={appStyle}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <TouchableOpacity onPress={handleToggleTheme}>
        <Text onPress={handleToggleTheme} style={titleStyle}>
          Currency Transducer
        </Text>
      </TouchableOpacity>
      <View style={inputStyleContainer}>
        <TextInput
          style={inputStyle}
          keyboardType="numeric"
          maxLength={5}
          placeholderTextColor={placehodlerStyle}
          placeholder="USD"
          autoCorrect={false}
          onChangeText={setText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={text?.toString()}
        />
      </View>
      <View>
        {data &&
          data.map((el, idx) => {
            return (
              <View key={idx} style={styles.outputContainer}>
                <Text style={outputStyle}>
                  {formattedNumber(el.rate * +text)}
                </Text>
                <Text style={infoStyle}>
                  {el.cc}: {(el.rate * 1).toFixed(2)} $
                </Text>
                <Text style={infoStyle}>
                  Currency rate at {el.exchangedate} by NBU
                </Text>
              </View>
            )
          })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e5e5e5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: 80,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
  },
  outputContainer: {
    alignItems: 'center',
  },
  output: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    color: '#333',
    padding: 2,
    opacity: 0.6,
  },
})
