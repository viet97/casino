import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import BaseElement from '../../element/BaseElement';
import { isNumber } from 'lodash';

class Item extends BaseElement {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    onIncrease = () => {
        const { value } = this.state
        if (isNumber(Number(value))) {
            this.setStateSafe({ value: `${Number(value) + 1}` })
            return
        }
        this.setStateSafe({ value: "1" })
    }

    onDecrease = () => {
        const { value } = this.state
        if (isNumber(Number(value))) {
            this.setStateSafe({ value: `${Number(value) - 1}` })
            return
        }
        this.setStateSafe({ value: "-1" })
    }

    renderContent = () => {
        const { item, index } = this.props
        return (
            <View
                style={styles.container}>
                <Pressable>
                    <SVGIcon.zerosum width={28} height={28} />
                </Pressable>
                <CustomText
                    style={styles.playerName}>Việt</CustomText>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center'
                    }}>
                    <Pressable
                        onPress={this.onIncrease}>
                        <SVGIcon.up width={24} height={24} />
                    </Pressable>
                    <TextInput
                        onChangeText={value => this.setStateSafe({ value })}
                        value={this.state.value}
                        keyboardType='number-pad'
                        style={styles.input}
                    />
                    <Pressable
                        onPress={this.onDecrease}>
                        <SVGIcon.down width={24} height={24} />
                    </Pressable>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    input: {
        width: 80,
        height: 24,
        textAlign: 'center',
        fontSize: 18,
        color: Colors.white
    },
    playerName: {
        marginLeft: 16,
        color: Colors.white,
        flex: 1
    },
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        borderTopColor: Colors.approxAqua,
        borderTopWidth: 2
    },

});

export default Item
