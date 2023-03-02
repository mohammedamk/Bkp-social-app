import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Modal from "react-native-modal";
import Layout from "../constants/Layout";

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

export default class ReportEventComponent extends Component {

    constructor() {
        super();
        this.state = {
            isModalVisible: false
        };
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isModalVisible: nextProps.isModalVisible
        })
    }

    closeModal() {
        this.setState({
            isModalVisible: false
        })
    }

    render() {
        return (
            <Modal isVisible={this.state.isModalVisible} animationType={'fade'} onRequestClose={this.closeModal}
                   style={{margin: 0, flex: 1}}>
                <TouchableOpacity onPress={this.closeModal}>
                    <View style={{height: SCREEN_HEIGHT - SCREEN_HEIGHT * 0.4234375, width: SCREEN_WIDTH}}/>
                </TouchableOpacity>
                <View style={{
                    backgroundColor: 'white',
                    height: SCREEN_HEIGHT * 0.4234375,
                    width: SCREEN_WIDTH,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: SCREEN_HEIGHT * 0.0328125
                }}>
                    <TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}> IT'S SPAM </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}> IT'S INAPPROPRIATE </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}> UNDERAGE USER </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider}/>

                    <TouchableOpacity onPress={this.closeModal}>
                        <View style={styles.textContainer}>
                            <Text style={{
                                color: '#FDD302',
                                fontSize: SCREEN_WIDTH * SCREEN_HEIGHT / 10000 * 0.8,
                                fontFamily: 'Roboto',
                                marginBottom: 10
                            }}> CANCEL </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        color: '#FDD302',
        fontSize: SCREEN_WIDTH * SCREEN_HEIGHT / 10000 * 0.8,
        fontFamily: 'Roboto'
    },
    divider: {
        borderTopColor: '#cacbcc',
        borderTopWidth: 1,
        width: SCREEN_WIDTH,
        marginTop: -10
    },
    textContainer: {
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});