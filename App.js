import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import shuffle from './shuffle.js'


function Question({ answerHandler }) {
  let [render, triggerRender] = useState(false)
  let [question, setQuestion] = useState([])
  let [answers, setAnswers] = useState([])

  function handleAnswer(answer) {
    answerHandler(answer === question.correctAnswer)
    triggerRender(!render)
  }

  useEffect(() => {
    async function get() {
      let res = await fetch('https://the-trivia-api.com/api/questions')
      let questions = await res.json()
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      const possibleAnswers = shuffle([...randomQuestion.incorrectAnswers, randomQuestion.correctAnswer])
      setQuestion(randomQuestion)
      setAnswers(possibleAnswers)
    }

    get()
  }, [render])

  let view = <View></View>
  if (question) {
    view = <View>
      <Text style={styles.question}>{question.question}</Text>
      {
        answers.map((answer, id) =>
          <TouchableOpacity key={id} style={styles.answer} onPress={() => handleAnswer(answer)}>
            <Text>{answer}</Text>
          </TouchableOpacity>)
      }
    </View>
  }

  return view
}

export default function App() {
  let [score, setScore] = useState(0)
  let [background, setBackground] = useState('')

  useEffect(() =>  {
    setTimeout(() => setBackground('white'), 200)
  }, [background])

  function answerHandler(success) {
    if (success) {
      setScore(score + 1)
      setBackground('green')
    } else {
      setBackground('red')
    }
  }

  return (
    <View style={{ ...styles.container, backgroundColor: background }}>
      <Text style={styles.score}>Your score is: {score}</Text>
      <Question answerHandler={answerHandler} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  score: {
    position: 'absolute',
    top: 200,
    marginBottom: 40,
    fontSize: 20
  },
  question: {
    paddingBottom: 20,
    fontWeight: 'bold'
  },
  answer: {
    borderWidth: 1,
    borderColor: 'light-grey',
    marginBottom: 5,
    padding: 10
  },
  choice: {
    padding: 5,
    margin: 2,
    borderWidth: 1,
    borderColor: 'light-grey'
  }
})
