import React, { Component } from 'react';
import axios from 'axios';

import Promoter from '../ChildComponents/Account/Promoter';
import PromoterRegistration from '../ChildComponents/Account/PromoterRegistration';
import PromoterAddUser from '../ChildComponents/Account/PromoterAddUser';

import withAuth from '../../utils/auth/withAuth';
import AuthService from '../../utils/auth/AuthService';

class Account extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	state = {
		userData: ''
	};

	//Get user info
	componentDidMount() {
		//If we are not logged in, redirect us to login
		if (!this.Auth.loggedIn()) {
			this.props.history.replace('/login');
		}

		axios.get('/user/' + this.props.user.identity).then(res => {
			this.setState({ userData: res.data });
		});
	}

	render() {
		const user = this.props.user;

		const promoterSection = this.state.userData.promoter_name ? (
			<div>
				<Promoter />
				<PromoterAddUser />
			</div>
		) : (
			<PromoterRegistration />
		);

		if (user) {
			return (
				<div className="account-page">
					<h1>Account</h1>
					<h3>Details</h3>
					<ul>
						{/* Currently just rendering a list of user info. Basically that's all there is to it
            to the account page, plus styling, editing, and promoter account creation */}
						<li>Username: {this.state.userData.username}</li>
						<li>First Name: {this.state.userData.firstName}</li>
						<li>Last Name: {this.state.userData.lastName}</li>
						<li>Email: {this.state.userData.email}</li>
						<li>Phone #: {this.state.userData.phoneNumber}</li>
						<li>Organization: {this.state.userData.organization}</li>
					</ul>
					<div>{promoterSection}</div>
					<div>
						<h3>Logout</h3>
						<button
							type="button"
							className="form-submit"
							onClick={this.handleLogout.bind(this)}
						>
							Logout
						</button>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}

	handleLogout() {
		this.Auth.logout();
		this.props.history.replace('/login');
	}
}

export default withAuth(Account);