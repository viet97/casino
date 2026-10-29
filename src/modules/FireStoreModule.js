import {
    getFirestore,
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    Timestamp,
} from '@react-native-firebase/firestore';
import { getAuth, signInWithCustomToken } from '@react-native-firebase/auth';
import { orderBy } from 'lodash';
import { getUniqueIdSync } from 'react-native-device-info';

// Same value as getUniqueId() of react-native-device-info 7.x, keep it to not lose old games
const uid = getUniqueIdSync()
const gamesPath = `users/${uid}/games`

const FireStoreModule = {
    uid,
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
                await signInWithCustomToken(getAuth(), response.token)
            }
        } catch (e) {
            console.error("auth error:", e)
        }
    },
    addGame: async function (game, id) {
        const { id: _id, ...data } = game
        return setDoc(doc(getFirestore(), gamesPath, id), {
            ...data,
            created: Timestamp.now().toMillis(),
            updated: Timestamp.now().toMillis()
        })
    },
    updateGame: async function (game, id) {
        const { id: _id, ...data } = game
        return updateDoc(doc(getFirestore(), gamesPath, id), {
            ...data,
            updated: Timestamp.now().toMillis()
        })
    },
    deleteGame: async function (id) {
        return deleteDoc(doc(getFirestore(), gamesPath, id))
    },
    listenGamesChange: function (onChange) {
        return onSnapshot(collection(getFirestore(), gamesPath), querySnapshot => {
            if (!querySnapshot) return
            let listGames = []
            querySnapshot.forEach(documentSnapshot => {
                listGames.push({ ...documentSnapshot.data(), id: documentSnapshot.id })
            });
            listGames = orderBy(listGames, ["updated"], ['desc'])
            onChange && onChange(listGames)
        }, e => console.error("listen games error:", e));
    },
    listenGameChange: function (id, onChange) {
        return onSnapshot(doc(getFirestore(), gamesPath, id), documentSnapshot => {
            if (!documentSnapshot?.exists()) return
            onChange && onChange({ ...documentSnapshot.data(), id: documentSnapshot.id })
        }, e => console.error("listen game error:", e));
    }
}

export default FireStoreModule
