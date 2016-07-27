import { connect } from 'react-redux';
import SignupForm from './Component';
import { update, signup } from './Actions';

import ajaxMethods from '../serverIO/ajaxMethods';
import dataHandling from '../serverIO/dataHandling';

import { create } from '../Popins/Actions';

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        update: (attrName, attrValue) => {
            dispatch(update(attrName, attrValue));
        },
        signup: (user) => {
            dataHandling.createUser(ajaxMethods.POSTer, user, function(err, user) {
                if (err) return dispatch(create('alert', err.message));
                dispatch(signup(user));
            });
        }
    };
};

const SignupFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupForm);

export default SignupFormContainer;