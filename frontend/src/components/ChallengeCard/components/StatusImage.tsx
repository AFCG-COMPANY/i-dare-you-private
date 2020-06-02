import { ChallengeResult, ChallengeStatus } from '../../../models/challenge';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface StatusImageProps {
    status: ChallengeStatus;
    result?: ChallengeResult;
}

export const StatusImage: React.FC<StatusImageProps> = (props) => {
    let image;

    if (props.status === ChallengeStatus.Finished) {
        if (props.result === ChallengeResult.Win) {
            image = require('../images/vs-win.png');
        } else if (props.result === ChallengeResult.Loss) {
            image = require('../images/vs-fail.png')
        } else {
            // TODO draw image
            image = require('../images/vs.png');
        }
    } else {
        image = require('../images/vs.png')
    }

    return (
        <Image
            style={styles.image}
            source={image}
        />
    )
};

export const styles = StyleSheet.create({
    image: {
        marginHorizontal: 16,
        alignSelf: 'center',
        width: 70,
        height: 70
    }
});
