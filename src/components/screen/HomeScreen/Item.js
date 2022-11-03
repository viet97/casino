import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import BaseElement from '../../element/BaseElement';
import { trim } from 'lodash';
import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import Modal from 'react-native-modal';
import FireStoreModule from '../../../modules/FireStoreModule';
import NavigationService from '../../../navigation/NavigationService';
import { ROUTER_NAME } from '../../../navigation/NavigationConst';

class Item extends BaseElement {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isDeleteVisible: false
        };
    }

    renderEdit = () => {
        const { item } = this.props
        return <View
            style={styles.editRow}>
            <Pressable
                style={styles.delete}>
                <SVGIcon.skull width={24} height={24} />
                <CustomText
                    onPress={() => this.setStateSafe({ isDeleteVisible: true })}
                    size={11}
                    style={{
                        lineHeight: 22,
                        marginLeft: 8
                    }}>
                    Xóa
                </CustomText>
            </Pressable>
            <Pressable
                onPress={() => NavigationService.getInstance().navigate({
                    routerName: ROUTER_NAME.CREATE_GAME.name,
                    params: {
                        game: item,
                        onUpdateSucess: () => {
                            this.setStateSafe({ isEdit: false })
                        }
                    }
                })}
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
        const { members, name, id } = item
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
                            onPress={() => this.setStateSafe({ isEdit: !this.state.isEdit })}
                            hitSlop={16}>
                            <SVGIcon.help width={24} height={24} />
                        </Pressable>
                    </View>
                </View>
                <Modal
                    avoidKeyboard
                    useNativeDriver
                    onBackdropPress={() => this.setStateSafe({ isDeleteVisible: false })}
                    onBackButtonPress={() => this.setStateSafe({ isDeleteVisible: false })}
                    style={[
                        {
                            flex: 1,
                            margin: 0,
                            width: widthDevice,
                            alignSelf: 'center',
                            width: 300
                        },
                    ]}
                    backdropOpacity={0}
                    isVisible={this.state.isDeleteVisible}
                >
                    <View
                        style={styles.modalContent}>
                        <CustomText
                            size={12}
                            style={{
                                lineHeight: 25,
                                letterSpacing: 0.1
                            }}>
                            XÓA TRẬN ĐẤU
                        </CustomText>
                        <CustomText
                            size={10}
                            style={{
                                lineHeight: 21,
                                textAlign: 'center',
                            }}>
                            Bạn có chắc chắn xóa trận đấu
                        </CustomText>
                        <View
                            style={styles.textRow2}>
                            <CustomText
                                style={{
                                    lineHeight: 21,
                                }}
                                size={10}>
                                [
                            </CustomText>
                            <CustomText
                                numberOfLines={1}
                                style={{
                                    maxWidth: 250,
                                    lineHeight: 21,
                                }}
                                size={10}>
                                {name}
                            </CustomText>
                            <CustomText
                                style={{
                                    lineHeight: 21,
                                }}
                                size={10}>
                                ]?
                            </CustomText>
                        </View>
                        <CustomText
                            size={10}
                            style={{
                                lineHeight: 21,
                                textAlign: 'center',
                            }}>
                            Trận đấu sẽ không thể khôi phục.
                        </CustomText>

                        <View
                            style={styles.bottomSection}>
                            <Pressable
                                onPress={() => this.setStateSafe({ isDeleteVisible: false })}
                                style={styles.bottomROw}>
                                <SVGIcon.deleteIcon width={24} height={24} />
                                <CustomText
                                    style={{
                                        marginLeft: 8,
                                    }}
                                    size={11}>
                                    Không
                                </CustomText>
                            </Pressable>
                            <View
                                style={styles.border} />
                            <Pressable
                                onPress={() => FireStoreModule.deleteGame(id)}
                                style={styles.bottomROw}>
                                <SVGIcon.ticked width={24} height={24} />
                                <CustomText
                                    style={{
                                        marginLeft: 8
                                    }}
                                    size={11}>
                                    Xác nhận
                                </CustomText>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    border: {
        height: 24,
        marginVertical: 12,
        width: 1,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    bottomROw: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: '100%'
    },
    bottomSection: {
        flexDirection: "row",
        height: 49,
        alignItems: "center",
        marginTop: 8
    },
    textRow2: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        backgroundColor: "#1A152A",
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 12,
        borderColor: "#02FFFF",
        borderWidth: 2,
        alignItems: 'center'
    },
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
