import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity, View, StatusBar} from 'react-native';

import { ImagePicker, Permissions } from 'expo';
import Modal from "react-native-modal";
import Layout from "../constants/Layout";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addProfilePhoto} from "../actions/userActions";

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;

class AddPhotoComponent extends Component {
	constructor(props) {
        super(props);
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
    	this.props.updateModal();
        this.setState({
            isModalVisible: false
        })
    }

    async _pickImage(option) {
    	let result;
    	if (option === 0) {
    		const permission = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

			if (permission.status === 'granted') {
	    		result = await ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [5, 5]
				});
	    	}
		}
		else {
			result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [5, 5]
			});
		}

		if (!result.cancelled) {
			this.props.addProfilePhoto(result.uri);
			this.closeModal();
		}
	}

    render() {
        return (
            <Modal
            	isVisible={this.state.isModalVisible}
            	animationType={'fade'}
            	onRequestClose={this.closeModal}
            	onBackdropPress={this.closeModal}
                style={{margin: 0, flex: 1}}
            >
                <StatusBar />
                <View style={styles.menuView}>
                    <TouchableOpacity
                    	onPress={() => this._pickImage(0)}
                    >
                        <View style={styles.textContainer}>
                            <Text style={styles.text}> TAKE A PHOTO </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                    	onPress={() => this._pickImage(1)}
                    >
                        <View style={styles.textContainer}>
                            <Text style={styles.text}> SELECT FROM GALLERY </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider}/>

                    <TouchableOpacity onPress={this.closeModal}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.text, {marginBottom: 10}]}> CANCEL </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    divider: {
        borderTopColor: '#cacbcc',
        borderTopWidth: 1,
        width: SCREEN_WIDTH,
        marginTop: -10
    },
    menuView: {
    	backgroundColor: 'white',
        height: SCREEN_HEIGHT * 0.35,
        width: SCREEN_WIDTH,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SCREEN_HEIGHT * 0.0328125,
        bottom: 0,
        position: 'absolute',
    },
    text: {
        color: '#FDD302',
        fontSize: SCREEN_WIDTH * SCREEN_HEIGHT / 10000 * 0.8,
        fontFamily: 'Roboto'
    },
    textContainer: {
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => {
	const { user } = state;
	return { user }
};

const mapDispatchToProps = dispatch => (
	bindActionCreators({
    	addProfilePhoto,
	}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AddPhotoComponent);
