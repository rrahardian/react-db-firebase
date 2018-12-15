import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAle1j6THrNaUnZ_2mR02OWHGY9Yv7LFTg",
    authDomain: "react-deploy-272bd.firebaseapp.com",
    databaseURL: "https://react-deploy-272bd.firebaseio.com",
    projectId: "react-deploy-272bd",
    storageBucket: "react-deploy-272bd.appspot.com",
    messagingSenderId: "987027622299"
};
const fire = firebase.initializeApp(config);

export default fire

export const auth = firebase.auth
export const provider = new firebase.auth.GoogleAuthProvider()
export const providerFB = new firebase.auth.FacebookAuthProvider()