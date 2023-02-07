import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import BaseElement from '../../element/BaseElement';
import { isNumber, trim } from 'lodash';
import Input from '../../common/Input';
import { IS_ANDROID } from '../../../utils/DeviceUtil';
import Tooltip from '../../element/Tooltip';

class Item extends BaseElement {
    constructor(props) {
        super(props);
        this.state = {
            value: "0"
        };
    }

    onIncrease = () => {
        const { value } = this.state
        if (isNumber(Number(value))) {
            this.setStateSafe({ value: `${Number(value) + 1}` })
            this.props.onChangeValue(Number(value) + 1)
            return
        }
        this.setStateSafe({ value: "1" })
        this.props.onChangeValue(1)
    }

    onDecrease = () => {
        const { value } = this.state
        if (isNumber(Number(value))) {
            this.setStateSafe({ value: `${Number(value) - 1}` })
            this.props.onChangeValue(Number(value) - 1)
            return
        }
        this.setStateSafe({ value: "-1" })
        this.props.onChangeValue(-1)
    }

    clearData = () => {
        this.setStateSafe({ value: "0" })
        this.props.onChangeValue(0)
    }

    setZeroSum = () => {
        const otherValue = this.props.getOtherValue(this.props.item)
        this.setStateSafe({ value: `${otherValue}` })
        this.props.onChangeValue(otherValue)
    }

    renderContent = () => {
        const { item, index, showHint, onCloseHint } = this.props
        return (
            <View
                style={styles.container}>
                <Tooltip
                    content="Cộng điểm thừa còn lại để tổng = 0"
                    visible={this.state.showSetZeroHint}
                    onClose={() => {
                        this.setStateSafe({ showSetZeroHint: false })
                        setTimeout(() => {
                            onCloseHint && onCloseHint()
                        }, 500)
                    }}
                >
                    <Pressable
                        onPress={this.setZeroSum}>
                        <SVGIcon.zerosum width={28} height={28} />
                    </Pressable>
                </Tooltip>
                <CustomText
                    numberOfLines={1}
                    style={styles.playerName}>{trim(item)}</CustomText>
                <Tooltip
                    content="Nhập điểm tại đây"
                    visible={showHint && index === 0}
                    onClose={() => {
                        setTimeout(() => {
                            this.setState({ showSetZeroHint: true })
                        }, 500)
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center'
                        }}>
                        <Pressable
                            onPress={this.onIncrease}>
                            <SVGIcon.up width={24} height={24} />
                        </Pressable>
                        <Input
                            selectTextOnFocus
                            // onBlur={e => {
                            //     if (isNaN(Number(e.nativeEvent.text)) || !Number(e.nativeEvent.text)) {
                            //         this.setStateSafe({ value: "0" })
                            //         this.props.onChangeValue(0)
                            //     }
                            // }}
                            onEndEditing={e => {
                                if (isNaN(Number(e.nativeEvent.text)) || !Number(e.nativeEvent.text)) {
                                    this.setStateSafe({ value: "0" })
                                    this.props.onChangeValue(0)
                                }
                            }}
                            onChangeText={value => {
                                this.setStateSafe({ value })
                                this.props.onChangeValue(Number(value))
                            }}
                            value={this.state.value}
                            style={styles.input}
                            keyboardType={IS_ANDROID ? "default" : "numbers-and-punctuation"}
                        />
                        <Pressable
                            onPress={this.onDecrease}>
                            <SVGIcon.down width={24} height={24} />
                        </Pressable>
                    </View>
                </Tooltip>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    input: {
        width: 80,
        height: 48,
        textAlign: 'center',
        fontSize: 18,
        color: Colors.white,
        padding: 0,
    },
    playerName: {
        marginLeft: 16,
        color: Colors.white,
        flex: 1
    },
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        borderTopColor: Colors.approxAqua,
        borderTopWidth: 2
    },

});

export default Item
