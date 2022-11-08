import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import BaseElement from '../../element/BaseElement';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import { orderBy, size, trim } from 'lodash';

class SummaryScreen extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.displayName = 'SummaryScreen';
    this.listAva = [
      SVGIcon.top1,
      SVGIcon.top2,
      SVGIcon.top3,
      SVGIcon.top4,
      SVGIcon.top5,
      SVGIcon.top6,
      SVGIcon.top7,
    ]
    this.listLabel = [
      SVGIcon.top1_label,
      SVGIcon.top2_label,
      SVGIcon.top3_label,
      SVGIcon.top4_label,
    ]
  }

  getListScore = () => {
    const { game } = this.props
    return orderBy(game?.members.map((name, index) => {
      let sum = 0
      for (const match of this.props?.game?.matches) {
        sum += (match[name] || 0)
      }
      return { name, sum }
    }), ['sum'], ['desc'])
  }

  getTop3Score = () => {
    const { game } = this.props
    let listScore = orderBy(game?.members.map((name, index) => {
      let sum = 0
      for (const match of this.props?.game?.matches) {
        sum += (match[name] || 0)
      }
      return { name, sum }
    }), ['sum'], ['desc'])
    if (size(listScore) > 3) listScore = listScore.slice(0, 3)
    if (size(listScore) < 3) listScore.push({ name: "-", sum: "-" })
    const finalList = [listScore[2], listScore[0], listScore[1]]

    return finalList
  }

  _componentDidMount() {
  }

  renderList = () => {
    return <View
      style={{
        flex: 1
      }}>
      <ScrollView
        contentContainerStyle={{
          marginTop: 12
        }}
        style={{
          flex: 1
        }}>
        {this.getListScore().map((item, index) => {
          let color = "#888888"
          if (item.sum > 0) {
            color = Colors.green
          }
          if (item.sum < 0) {
            color = "red"
          }

          const Icon = index >= this.listAva.length ? this.listAva[this.listAva.length - 1] : this.listAva[index]
          const IconLabel = index >= this.listLabel.length ? this.listLabel[this.listLabel.length - 1] : this.listLabel[index]
          return (
            <View
              style={styles.listItem}>
              <View>
                <IconLabel />
                <CustomText
                  size={10}
                  style={styles.itemLabel}>
                  {index + 1}
                </CustomText>
              </View>
              <Icon
                style={{
                  marginLeft: 16
                }} />
              <CustomText
                numberOfLines={1}
                style={styles.itemName}>
                {trim(item.name)}
              </CustomText>
              <CustomText
                style={{
                  lineHeight: 30,
                  color
                }}
                size={22}>
                {item.sum > 0 ? "+" : ""}{item.sum}
              </CustomText>
            </View>
          )
        })}
      </ScrollView>
    </View>
  }


  renderTop = () => {
    return <View
      style={styles.topContainer}>
      {this.getTop3Score().map((it, index) => {
        let color = "#888888"
        if (it.sum > 0) {
          color = Colors.green
        }
        if (it.sum < 0) {
          color = "red"
        }
        return <View
          style={styles.topItem}>
          <View
            style={styles.topItemContent}>
            <CustomText
              numberOfLines={1}
              style={{
                marginHorizontal: 4
              }}
              size={12}>
              {trim(it.name)}
            </CustomText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Image
                source={index ? (
                  index === 1 ? Images.assets.top1.source : Images.assets.top2.source
                ) : Images.assets.top3.source}
                style={{
                  width: 36,
                  height: 36
                }} />
              <CustomText
                style={{
                  marginLeft: 6,
                }}
                size={10}>
                TOP {
                  index ? (
                    index === 1 ? "1" : "2"
                  ) : "3"
                }
              </CustomText>
            </View>
            <CustomText
              style={{
                lineHeight: 34,
                color
              }}
              size={22}>
              {it.sum > 0 ? "+" : ""}{it.sum}
            </CustomText>
          </View>
          {index < 2 ? <View
            style={styles.topItemBorder} /> : null}
        </View>
      })}
    </View>
  }

  renderContent() {
    return (
      <View style={styles.container} >
        <View>
          <Image
            source={Images.assets.summary.source}
            style={styles.cover}
          />
        </View>
        {this.renderTop()}
        {this.renderList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemName: {
    marginLeft: 8,
    lineHeight: 24,
    flex: 1,
    marginRight: 16
  },
  itemLabel: {
    position: "absolute",
    width: 24,
    height: 24,
    textAlign: 'center'
  },
  listItem: {
    flexDirection: "row",
    marginHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#7CF8FF"
  },
  topItemBorder: {
    marginVertical: 16,
    width: 0,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: "#15134D"
  },
  topItemContent: {
    flex: 1,
    alignItems: "center"
  },
  topItem: {
    flexDirection: "row",
    paddingVertical: 8,
    flex: 1
  },
  topContainer: {
    flexDirection: "row",
    width: widthDevice - 48,
    borderColor: "#7CF8FF",
    borderWidth: 2,
    alignSelf: "center",
    marginTop: -32,
    backgroundColor: "#02031D",
  },
  cover: {
    resizeMode: "contain",
    width: widthDevice,
    height: widthDevice * 0.5625,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundScreen
  },
});

export default SummaryScreen
