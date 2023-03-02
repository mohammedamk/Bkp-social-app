import React from 'react';
import { View, Image, TouchableOpacity, Animated, Easing, ImageBackground } from 'react-native';
import Pulse from './Pulse';
import PropTypes from "prop-types";


export default class LocationPulseLoader extends React.Component {
	constructor(props) {
		super(props);
	
		this.state = {
			circles: [],
			counter:1
		};

		this.setInterval = null;
		this.anim = new Animated.Value(1);
	}

	componentDidMount() {
		this.setCircleInterval();
	}

	setCircleInterval() {
		this.addCircle();
	}

	addCircle() {
		this.setState({ circles: [...this.state.circles, this.state.counter], counter: this.state.counter + 1 });
	}

	render() {
		const { size, avatar, avatarBackgroundColor, interval } = this.props;

		return (
			<ImageBackground style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
			source={require('../../assets/Pngs/bg.imageset/bg.png')}
			>
				{this.state.circles.map((circle) => (
					<Pulse
						key={circle}
						{...this.props}
					/>
				))}
					<Image
						source={avatar}
						style={{
							width: size,
							height: size,
							borderRadius: size/2
						}}
					/>
			</ImageBackground>
		);
	}	
}

LocationPulseLoader.propTypes = {
  interval: PropTypes.number,
  size: PropTypes.number,
  pulseMaxSize: PropTypes.number,
  avatarBackgroundColor: PropTypes.string,
  pressInValue: PropTypes.number,
  pressDuration: PropTypes.number,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  getStyle: PropTypes.func,
};

LocationPulseLoader.defaultProps = {
  interval: 2000,
  size: 100,
  pulseMaxSize: 250,
  avatarBackgroundColor: 'white',
  pressInValue: 0.8,
  pressDuration: 150,
  pressInEasing: Easing.in,
  pressOutEasing: Easing.in,
  borderColor: '#D8335B',
  backgroundColor: '#ED225B55',
  getStyle: undefined,
};

