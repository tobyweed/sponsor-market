import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updatePromoter } from '../../actions';
import AuthService from '../../utils/auth/AuthService';
import update from 'immutability-helper';

class EventRegistration extends Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.handleEventChange = this.handleEventChange.bind(this);
		this.handleAddEvent = this.handleAddEvent.bind(this);
		this.handleRemoveEvent = this.handleRemoveEvent.bind(this);

		this.Auth = new AuthService();
	}

	state = {
		errorMessage: '',
		events: [{ start_date: '', end_date: '' }]
	};

	render() {
		return (
			<div className="event-registration">
				<h3>Create a New Event</h3>
				<form onSubmit={this.handleFormSubmit}>
					<input
						className="form-item"
						placeholder="Enter Event Name"
						name="name"
						type="text"
						onChange={this.handleChange}
					/>
					{/*Add nested Events which can be added or subtracted from state*/}
					<br />
					Events:
					<ul>
						{this.state.events.map((event, i) => (
							<li key={i}>
								<input
									placeholder="Enter Event Start Date"
									name="start_date"
									type="datetime-local"
									onChange={this.handleEventChange(i)}
								/>
								<input
									placeholder="Enter Event End Date"
									name="end_date"
									type="datetime-local"
									onChange={this.handleEventChange(i)}
								/>
							</li>
						))}
						<li>
							Add or Remove an Event:
							<button type="button" onClick={this.handleAddEvent}>
								+
							</button>
							/
							<button type="button" onClick={this.handleRemoveEvent}>
								-
							</button>
						</li>
					</ul>
					<br />
					<input className="form-submit" value="Submit" type="submit" />
				</form>
				{this.state.errorMessage}
			</div>
		);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleEventChange = i => e => {
		let newEvents = update(this.state.events, {
			[i]: {
				[e.target.name]: { $set: e.target.value }
			}
		});
		this.setState({
			events: newEvents
		});
	};

	handleRemoveEvent(e) {
		let newEvents = update(this.state.events, {
			$splice: [[0, 1]]
		});
		this.setState({ events: newEvents });
	}

	handleAddEvent(e) {
		let newEvents = update(this.state.events, {
			$push: [{ start_date: '', end_date: '' }]
		});
		this.setState({ events: newEvents });
	}

	handleFormSubmit(e) {
		//Login on form submit
		e.preventDefault();

		axios
			.post('/create-event', {
				name: this.state.name,
				events: this.state.events
			})
			.then(res => {
				//if we get data in our response and that data is an array, then add that data to state
				if (res.data && res.data.constructor === Array) {
					this.props.dispatch(updatePromoter('event_infos', res.data));
					this.setState({
						errorMessage: 'Event ' + this.state.name + ' was created.'
					});
				} else {
					this.setState({ errorMessage: res.data.message });
				}
			})
			.catch(err => {
				console.log(err);
				this.setState({ errorMessage: 'Something went wrong.' });
			});
	}
}

function mapStateToProps(state) {
	return {
		promoterData: state.promoterData
	};
}

export default connect(mapStateToProps)(EventRegistration);
