import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Layout from '../constants/Layout';

const SCREEN_HEIGHT = Layout.window.height;
const SCREEN_WIDTH = Layout.window.width;


export default class DateTimePickerTester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: this.props.word,
      startDate: null,
      startTime: null,
      startDayOfWeek: null,
      endDate: null,
      endTime: null,
      endTimeCat: null,
      endDayOfWeek: null,
      isDisabledTouch: false,
      dateError: false,
      endDatetime: null,

    }
  }

  static defaultProps = {
    word: 'no words'
  }

  state = {
    isDateTimePickerVisible: false,
  };

  getDateTimeState = () => {
    return this.state;
  };

  _showDateTimePicker = (mode) => {
    this.setState({
      isDisabledTouch: true,
    });

    // enable after 5 second
    setTimeout(() => {
      this.setState({
        isDisabledTouch: false,
      });
    }, 1000)

    if (mode === 'Starts') {
      this.setState({
        word: 'Starts',
        isDateTimePickerVisible: true
      })
    } else {
      this.setState({
        word: 'Ends',
        isDateTimePickerVisible: true
      })
    }
  };

  _hideDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: false
    });
  }

  _handleDatePicked = async (date) => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["MON", "TUES", "WED", "THUR", "FRI", "SAT", "SUN"];

    if (this.state.word === 'Starts') {
      console.log('Starts');
      if (date >= this.state.fullEndDate) {
        this.setState({
          dateError: true,
        }, () => this.props.handleBadDate(this.state.dateError));

      } else {
        this.setState({
          dateError: false,
        }, () => this.props.handleBadDate(this.state.dateError));
      }
      this.setState({
        startDatetime: date,
        startDate: (monthNames[date.getMonth()] + ' ' + date.getDate()),
        startDayOfWeek: dayNames[date.getDay()],
        startTime: this._formatAMPM(date),
        fullStartDate: date,
      });
    } else if (this.state.word === 'Ends') {
      console.log('Ends');
      console.log(date <= this.state.fullStartDate);
      if (date <= this.state.fullStartDate) {
        this.setState({
          dateError: true,
        }, () => this.props.handleBadDate(this.state.dateError));

      } else {
        this.setState({
          dateError: false,
        }, () => this.props.handleBadDate(this.state.dateError));
      }
      this.setState({
        endDatetime: date,
        endDate: (monthNames[date.getMonth()] + ' ' + date.getDate()),
        endDayOfWeek: dayNames[date.getDay()],
        endTime: this._formatAMPM(date),
        fullEndDate: date,
      });
    }

    this._hideDateTimePicker();
  };


  _formatAMPM = (date) => {

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  }


  render() {
    return (
      <View>

        <TouchableOpacity onPress={() => [this._showDateTimePicker('Starts')]}
          disabled={this.state.isDisabledTouch}
          style={{
            flexDirection: 'row',
            height: SCREEN_HEIGHT * (43 / 722),
            backgroundColor: 'white',
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
            borderColor: 'rgba(0,0,0, 0.1)',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Text style={{
            marginLeft: SCREEN_WIDTH * (15 / 360),
            fontSize: SCREEN_HEIGHT * (11 / 722),
            color: 'black'
          }} fontFamily='Roboto'>Starts</Text>

          <View style={{
            width: SCREEN_WIDTH * (167 / 360),
            height: SCREEN_HEIGHT * (14 / 722),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: SCREEN_WIDTH * (13 / 360)
          }}>
            <Text style={{ fontSize: SCREEN_HEIGHT * (11 / 722), color: 'black', }}
              fontFamily='Roboto'>{this.state.startDate}</Text>
            <Text style={{ fontSize: SCREEN_HEIGHT * (11 / 722), color: 'black', }}
              fontFamily='Roboto'>{this.state.startTime}</Text>
          </View>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={() => this._handleDatePicked()}
            onCancel={() => this._hideDateTimePicker()}
            mode={'datetime'}
            minimumDate={new Date()}
            is24Hour={false}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={this.state.isDisabledTouch || !this.state.startDate}
          onPress={() => [this._showDateTimePicker('Ends')]} style={{
            flexDirection: 'row',
            height: SCREEN_HEIGHT * (43 / 722),
            backgroundColor: 'white',
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
            borderColor: 'rgba(0,0,0, 0.1)',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Text style={{
            marginLeft: SCREEN_WIDTH * (15 / 360),
            fontSize: SCREEN_HEIGHT * (11 / 722),
            color: 'black'
          }} fontFamily='Roboto'>Ends</Text>

          <View style={{
            width: SCREEN_WIDTH * (167 / 360),
            height: SCREEN_HEIGHT * (14 / 722),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: SCREEN_WIDTH * (13 / 360)
          }}>
            <Text style={{ fontSize: SCREEN_HEIGHT * (11 / 722), color: 'black', }}
              fontFamily='Roboto'>{this.state.endDate}</Text>
            <Text style={{ fontSize: SCREEN_HEIGHT * (11 / 722), color: 'black', }}
              fontFamily='Roboto'>{this.state.endTime}</Text>
          </View>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            minimumDate={this.state.fullStartDate}
            mode={'datetime'}
            is24Hour={false}

          />
        </TouchableOpacity>
      </View>

    );
  }

}