import React, { Component } from 'react';
import AuthService from './AuthService';

/*
* This class is a Higher Order Component which is applied
* to other components if you want them to have auth capabilities
*
* TLDR use this if you want to make a view permissioned
*/

export default function withAuth(AuthComponent) {
	return class AuthWrapped extends Component {
		constructor() {
			super();
			this.state = {
				user: null
			};
			this.Auth = new AuthService();
		}

		componentWillMount() {
			this.Auth.tryAccess();
			try {
				const profile = this.Auth.getProfile();
				this.setState({
					user: profile
				});
			} catch (err) {
				this.Auth.logout();
				this.props.history.replace('/login');
			}
		}

		render() {
			return (
				<AuthComponent history={this.props.history} user={this.state.user} />
			);
		}
	};
}