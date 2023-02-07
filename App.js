import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Alert } from 'react-native';

import Header from './src/components/Header'
import params from './src/params'
import MineField from './src/components/MineField'
import LevelSelection from './src/screens/LevelSelection'
import { 
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed
} from './src/functions'

export default class App extends Component {
  constructor(props)
  {
    super(props)
    this.state = this.createState()
  }
  
  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return Math.ceil(cols * rows * params.difficultLevel)
  }

  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return { 
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false
    }
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wonGame(board)

    if (lost)
    {
      showMines(board)
      Alert.alert('Perdeeeu!', 'Tu é mo Enzo!')
    }

    if (won)
    {
      Alert.alert('Parabéns!', 'Tu é fuck!')
    }

    this.setState({board, lost, won})
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Parabéns', 'Tu eh bão memo')
    }

    this.setState({board, won})
  }

  onLevelSelected = level => {
    params.difficultLevel = level
    this.setState(this.createState())
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection} onLevelSelected={this.onLevelSelected} onCancel={() => this.setState({showLevelSelection: false})} ></LevelSelection>
        <Header flagsLeft={this.minesAmount() - flagsUsed(this.state.board)} onNewGame={() => this.setState(this.createState())} onFlagPress={() => this.setState({showLevelSelection: true})}></Header>
        <View>
          <MineField board={this.state.board} onOpenField={this.onOpenField} onSelectField={this.onSelectField}></MineField>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});
