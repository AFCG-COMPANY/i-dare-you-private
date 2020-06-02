import { ChallengeResult, ChallengeStatus } from '../../../models/challenge';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface ResultImageProps {
    status: ChallengeStatus;
    result?: ChallengeResult;
}

export const ResultImage: React.FC<ResultImageProps> = (props) => {
    let image;

    if (props.status === ChallengeStatus.Finished) {
        switch (props.result) {
            case ChallengeResult.Win:
                image = require('../images/vs-win.png');
                break;

            case ChallengeResult.Draw:
                // TODO draw image
                image = require('../images/vs.png');
                break;

            case ChallengeResult.Loss:
                image = require('../images/vs-fail.png');
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
