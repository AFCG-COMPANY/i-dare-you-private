import { ChallengeResult } from './challenge'
import admin from './config';
import axios from 'axios';


/*

*/
export const updateStatuses = async (doc: any) => {
    console.log(doc.id)

    const data = doc.data()
    const now = new Date().getTime()
    const endVotingDate = new Date().setDate(new Date(data.endDate).getDate() + 3)

    let newChallengeStatus = data.status
    let newChallengeResult = null

    if (data.status === 'Created') {
        if (now > data.endDate || data.creatorEndChallenge) {
            // voting
            newChallengeStatus = 'Voting'
        } else if (data._opponents.length > 0) {
            // in progress
            newChallengeStatus = 'In Progress'
        }

    } else if (data.status === 'In Progress') {
        if (now > data.endDate || data.creatorEndChallenge) {
            // voting
            newChallengeStatus = 'Voting'
        }
    } else { // Voting
        if (now > endVotingDate) {
            // finished
            newChallengeStatus = 'Finished'
        }
    }

    let batch = admin.firestore().batch();

    if (newChallengeStatus === 'Finished') {
        newChallengeResult = getChallengeResult(data)
        let challenge = admin.firestore().collection("challenges").doc(doc.id);
        batch.update(challenge, { status: newChallengeStatus, result: newChallengeResult });

        let user = admin.firestore().collection("users").doc(data.createdBy)
        const increment = admin.firestore.FieldValue.increment(1);
        if (newChallengeResult === ChallengeResult.Win){
            batch.update(user, { wins: increment })
        } else if (newChallengeResult === ChallengeResult.Loss) {
            batch.update(user, { losses: increment })
        } else {
            batch.update(user, { draws: increment })
        }
    } else if (newChallengeStatus !== data.status) {
        let challenge = admin.firestore().collection("challenges").doc(doc.id);
        batch.update(challenge, { status: newChallengeStatus });
    }

    await batch.commit();
}

export const getChallengeResult = (challenge: any) => {
    console.log(challenge)
    if (challenge.creatorVote === true && getOpponentsStatus(challenge.opponents, true)) {
        return ChallengeResult.Win
    } else if (challenge.creatorVote === false && getOpponentsStatus(challenge.opponents, false)) {
        return ChallengeResult.Loss
    }
    return ChallengeResult.Draw
}

const getOpponentsStatus = (opponents: any, checkStatus: boolean) => {
    for (const opponent in opponents) {
        if (opponents[opponent].vote !== checkStatus) {
            return false
        }
    }
    return true
}

export const sendPushes = () => {
    let data = JSON.stringify({"to":"ExponentPushToken[Ay5F-dIG6uyiItJPIDT0P0]","title":"hello","body":"world"});

    let config : any = {
      method: 'post',
      url: 'https://exp.host/--/api/v2/push/send',
      headers: {
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}