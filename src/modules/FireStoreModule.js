import firestore from '@react-native-firebase/firestore';
import { orderBy } from 'lodash';
import deviceInfoModule from 'react-native-device-info';
import auth from '@react-native-firebase/auth';

const FireStoreModule = {
    uid: deviceInfoModule.getUniqueId(),
    auth: async function () {
        try {
            const response = await fetch("https://us-central1-casino-ledger.cloudfunctions.net/apis/login", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid: this.uid })
            }).then(response => response.json())

            if (response?.token) {
                auth().signInWithCustomToken(response.token)
            }
        } catch (e) {
            console.error("auth error:", e)
        }
    },
    addGame: async function (game) {
        const response = await firestore()
            .collection(`users/${this.uid}/games`)
            .doc(game.id)
            .set({
                ...game,
                created: firestore.Timestamp.now().toMillis(),
                updated: firestore.Timestamp.now().toMillis()
            })
        return response
    },
    updateGame: async function (game) {
        const response = await firestore()
            .collection(`users/${this.uid}/games`)
            .doc(game.id)
            .update({
                ...game,
                updated: firestore.Timestamp.now().toMillis()
            })
        return response
    },
    listenGamesChange: async function (onChange) {
        return firestore()
            .collection(`users/${this.uid}/games`)
            .onSnapshot(querySnapshot => {
                if (!querySnapshot) return
                let listGames = []
                querySnapshot.forEach(documentSnapshot => {
                    console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    listGames.push(documentSnapshot.data())
                });
                listGames = orderBy(listGames, ["updated"], ['desc'])
                onChange && onChange(listGames)
            });
    },
    listenGameChange: async function (game, onChange) {
        return firestore()
            .collection(`users/${this.uid}/games`)
            .doc(game.id)
            .onSnapshot(querySnapshot => {
                if (!querySnapshot) return
                onChange && onChange(querySnapshot.data())
            });
    }
}

export default FireStoreModule