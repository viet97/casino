import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import BaseElement from '../../element/BaseElement';
import { trim } from 'lodash';
import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';

class Item extends BaseElement {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: true
        };
    }

    renderEdit = () => {
        return <View
            style={styles.editRow}>
            <Pressable
                style={styles.delete}>
                <SVGIcon.skull width={24} height={24} />
                <CustomText
                    size={11}
                    style={{
                        lineHeight: 22,
                        marginLeft: 8
                    }}>
                    Xóa
                </CustomText>
            </Pressable>
            <Pressable
                style={styles.edit}>
                <SVGIcon.key width={24} height={24} />
                <CustomText
                    size={11}
                    style={{
                        lineHeight: 22,
                        marginLeft: 8
                    }}>
                    Sửa
                </CustomText>
            </Pressable>
            <Pressable
                style={styles.share}>
                <SVGIcon.beer width={24} height={24} />
                <CustomText
                    size={11}
                    style={{
                        lineHeight: 22,
                        marginLeft: 8
                    }}>
                    Share
                </CustomText>
            </Pressable>
        </View>
    }

    renderContent() {
        const { item, onClick } = this.props
        const { members, name } = item
        const membersNameString = members.map(name => trim(name)).join(", ")
        return (
            <Pressable
                onPress={onClick}
                style={styles.item}>
                <View
                    style={styles.itemContentContainer}>
                    <Image
                        style={styles.itemBg}
                        source={Images.assets.item_cover.source}
                    />
                    <CustomText
                        numberOfLines={1}
                        style={styles.itemName}>
                        {trim(name)}
                    </CustomText>
                    <View
                        style={styles.itemBottomRow}>
                        <View
                            style={styles.itemBottomRowContent}>
                            {this.state.isEdit ? this.renderEdit() : <CustomText
                                numberOfLines={2}
                                style={styles.itemMembers}
                                size={11}>
                                {membersNameString}
                            </CustomText>}
                        </View>
                        <Pressable
                            hitSlop={16}>
                            <SVGIcon.help width={24} height={24} />
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    itemBottomRowContent: {
        flexDirection: "row",
        height: 36,
        alignItems: 'center',
        flex: 1
    },
    editRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        height: '100%'
    },
    share: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    edit: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: "rgba(255, 255, 255, 0.5)"
    },
    delete: {
        flexDirection: "row",
        alignItems: 'center',
        paddingRight: 12,
        borderRightWidth: 1,
        borderRightColor: "rgba(255, 255, 255, 0.5)"
    },
    itemContentContainer: {
        flex: 1,
        paddingTop: 6,
        paddingHorizontal: 20,
        paddingBottom: 16,
        overflow: 'hidden'
    },
    itemMembers: {
        color: Colors.white,
        lineHeight: 16,
        marginRight: 20,
        marginTop: 4
    },
    itemBottomRow: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    itemName: {
        letterSpacing: 0.05,
        color: Colors.white,
        lineHeight: 29.75
    },
    itemBg: {
        ...StyleSheet.absoluteFillObject,
        position: "absolute",
        left: 0,
        right: 0,
        width: widthDevice - 48,
        height: 90,
        top: 0,
        backgroundColor: Colors.nero
    },
    item: {
        borderWidth: 3,
        borderColor: Colors.skema,
        marginBottom: 16,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowColor: Colors.black,
        shadowRadius: 20,
        shadowOpacity: 0.5,
        elevation: 5,
    },
});

export default Item
