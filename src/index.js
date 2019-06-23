import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
let firebaseConfig = {
  apiKey: "AIzaSyDf-1PPEQ7088pi5_Dyi04M1920PRV9qdI",
  authDomain: "twonize.firebaseapp.com",
  databaseURL: "https://twonize.firebaseio.com",
  projectId: "project-4620180246734234159",
  storageBucket: "project-4620180246734234159.appspot.com",
  messagingSenderId: "1091715863745",
  appId: "1:1091715863745:web:c14b034acfa2a250"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


render(<App />, document.getElementById('root'));

serviceWorker.unregister();
