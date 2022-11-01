import firestore from '@react-native-firebase/firestore';
import { orderBy } from 'lodash';
import deviceInfoModule from 'react-native-device-info';


const FireStoreModule = {
    uid: deviceInfoModule.getUniqueId(),
    addGame: async function (game) {
        const response = await firestore()
            .collection('Games')
            .doc(game.id)
            .set({
                ...game,
                deviceId: this.uid,
                createAt: firestore.Timestamp.now().toMillis(),
                updateAt: firestore.Timestamp.now().toMillis()
            })
        return response
    },
    updateGame: async (game) => {
        const response = await firestore()
            .collection('Games')
            .doc(game.id)
            .update({
                ...game,
                updateAt: firestore.Timestamp.now().toMillis()
            })
        return response
    },
    listenGamesChange: async function (onChange) {
        return firestore()
            .collection('Games')
            .where("deviceId", "==", this.uid)
            .onSnapshot(querySnapshot => {
                let listGames = []
                querySnapshot.forEach(documentSnapshot => {
                    console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    listGames.push(documentSnapshot.data())
                });
                listGames = orderBy(listGames, ["updateAt"], ['desc'])
                onChange && onChange(listGames)
            });
    },
    listenGameChange: async function (game, onChange) {
        return firestore()
            .collection('Games')
            .doc(game.id)
            .onSnapshot(querySnapshot => {
                console.log("querySnapShot", querySnapshot)
                onChange && onChange(querySnapshot.data())
            });
    }
}

export default FireStoreModule