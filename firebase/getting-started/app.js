/***************************************************
 * Please note that I’m sharing the credential here.
 * Feel free to use it while you’re learning.
 * After that, use your own credential.
 * Doing so, others can have the same advantage and
 * learn as quick as you learned too.
 * Thanks in advance!!!
***************************************************/

const FIREBASE_PROPERTY = 'getting_started'

// Initialize Firebase
// https://firebase.google.com/docs/database/web/start
// const config = {
//   apiKey: "AIzaSyAp-CLeimcXe59hvyNqpL66R0TQUyyoNjo",
//   authDomain: "talk2016-9079a.firebaseapp.com",
//   databaseURL: "https://talk2016-9079a.firebaseio.com",
//   storageBucket: "talk2016-9079a.appspot.com",
// }
const config = {
  apiKey: "AIzaSyCnECW0owjO8rEcBtlEnCYW3PhEYh8XgMQ",
  authDomain: "personal-stuff-ebe00.firebaseapp.com",
  databaseURL: "https://personal-stuff-ebe00.firebaseio.com",
  storageBucket: "personal-stuff-ebe00.appspot.com",
  messagingSenderId: "99626008668"
}
firebase.initializeApp(config)
const database = firebase.database()


const emailProvider = new firebase.auth.EmailAuthProvider()
// firebase.auth().signInWithPopup(emailProvider)
firebase.auth().signInWithRedirect(emailProvider)
credential = firebase.auth.EmailAuthProvider.credential('igor@evanildolima.com.br', 'im123654')
firebase.auth().signInWithCredential(credential)


// fetch data we alreaday have saved
// and keep watching the data change
// // https://firebase.google.com/docs/database/web/retrieve-data
// database.ref(FIREBASE_PROPERTY).on('value', (snapshot) => {
//   const value = snapshot.val()
//   if (value) {
//     console.log(value)
//   }
// })

// // save any object
// // https://firebase.google.com/docs/database/web/save-data
// database.ref(FIREBASE_PROPERTY).set({
//   test: 12
// })

// // update any object
// // https://firebase.google.com/docs/database/web/save-data
// database.ref(FIREBASE_PROPERTY).update({
//   hello: 'hello, firebase!!!'
// })
