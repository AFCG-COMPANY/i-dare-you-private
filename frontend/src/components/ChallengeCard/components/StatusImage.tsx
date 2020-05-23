import { ChallengeResult, ChallengeStatus } from '../../../models/challenge';
import React from 'react';
import { WinIcon } from '../images/win';
import { LossIcon } from '../images/loss';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import { VersusIcon } from '../images/versus';

interface StatusImageProps {
    status: ChallengeStatus;
    result?: ChallengeResult;
}

export const StatusImage: React.FC<StatusImageProps> = (props) => {
    if (props.status === ChallengeStatus.Finished) {
        const uri = props.result === ChallengeResult.Win ? WinIcon : LossIcon;

        return (
            <ImageBackground
                style={styles.versus}
                source={{ uri: VersusIcon }}
            >
                <Image
                    style={styles.resultImage}
                    source={{ uri }}
                />
            </ImageBackground>
        );
    } else {
        return (
            <Image
                style={styles.versus}
                source={{ uri: VersusIcon }}
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
