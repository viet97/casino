import firestore from '@react-native-firebase/firestore';
import deviceInfoModule from 'react-native-device-info';


const FireStoreModule = {
    uid: deviceInfoModule.getUniqueId(),
    addGame: async function (game) {
        const response = await firestore()
            .collection('Games')
            .doc(game.id)
            .set({
                ...game,
                deviceId: this.uid
            })
        return response
    },
    updateGame: async (game) => {
        const response = await firestore()
            .collection('Games')
            .doc(game.id)
            .update(game)
        return response
    },
    listenGamesChange: async function (onChange) {
        return firestore()
            .collection('Games')
            .where("deviceId", "==", this.uid)
            .onSnapshot(querySnapshot => {
                const listGames = []
                querySnapshot.forEach(documentSnapshot => {
                    console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    listGames.push(documentSnapshot.data())
                    onChange && onChange(listGames)
                });
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