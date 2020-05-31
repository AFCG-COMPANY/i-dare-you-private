import { ChallengeResult, ChallengeStatus } from '../../../models/challenge';
import React from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';

interface StatusImageProps {
    status: ChallengeStatus;
    result?: ChallengeResult;
}

export const StatusImage: React.FC<StatusImageProps> = (props) => {
    const versusImage = require('../images/vs.png');

    if (props.status === ChallengeStatus.Finished) {
        let resultImage;
        if (props.result === ChallengeResult.Win) {
            resultImage = require('../images/win.png');
        } else if (props.result === ChallengeResult.Loss) {
            // TODO loss image
        } else {
            // TODO draw image
        }

        return (
            <ImageBackground
                style={styles.versus}
                source={versusImage}
            >
                <Image
                    style={styles.resultImage}
                    source={resultImage}
                />
            </ImageBackground>
        );
    } else {
        return (
            <Image
                style={styles.versus}
                source={versusImage}
            />
        )
    }
};

export const styles = StyleSheet.create({
    versus: {
        marginHorizontal: 16,
        alignSelf: 'center',
        width: 70,
        height: 70
    },
    resultImage: {
        flex: 1,
        resizeMode: 'contain',
        transform: [{ rotate: '45deg' }]
    }
});
