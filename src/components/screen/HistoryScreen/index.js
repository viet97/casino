import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import BaseElement from '../../element/BaseElement';
import { trim } from 'lodash';

class HistoryScreen extends BaseElement {
  constructor(props) {
    super(props);
    this.displayName = 'HistoryScreen';
  }

  getCellWidth = () => {
    const width = (widthDevice - 2) / (this.props.game?.members?.length || 1)
    if (width < (widthDevice - 2) / 5) {
      return (widthDevice - 2) / 5 - 4
    }
    return width
  }

  renderTableHead = (cellWidth) => {
    const { members, matches } = this.props.game
    return (
      <View style={[styles.row, styles.headRow]}>
        {members.map(name => {
          let sum = 0
          for (const match of matches || []) {
            sum += (match[name] || 0)
          }
          return (
            <View
              key={name}
              style={[styles.cell, styles.tableHead, { width: cellWidth }]}>
              <CustomText
                numberOfLines={1}
                size={10}>
                {trim(name)}
              </CustomText>
              <CustomText
                size={12}>
                {sum}
              </CustomText>
            </View>
          )
        })}
      </View>
    )
  }

  renderTableRow = (match, index, cellWidth) => {
    return (
      <View
        key={index}
        style={[styles.row, {
          height: 28,
          backgroundColor: index % 2 ? Colors.kode : Colors.TRANSPARENT,
        }]}>
        {this.props.game.members.map(member => {
          const score = match[member] || 0
          let color = Colors.white
          if (score > 0) {
            color = Colors.green
          }
          if (score < 0) {
            color = "red"
          }
          return (
            <View
              key={member}
              style={[styles.cell, { width: cellWidth }]}>
              <CustomText
                style={{
                  textAlign: "center",
                  color
                }}
                size={10}>
                {score || "-"}
              </CustomText>
            </View>
          )
        })}
      </View>
    )
  }

  renderTable = () => {
    const cellWidth = this.getCellWidth()
    return (
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        horizontal>
        <View>
          {this.renderTableHead(cellWidth)}
          <ScrollView
            style={{ flex: 1 }}
            bounces={false}>
            {(this.props.game.matches || []).map((match, index) => this.renderTableRow(match, index, cellWidth))}
          </ScrollView>
        </View>
      </ScrollView>
    )
  }

  renderContent() {
    return (
      <View style={styles.container} >
        <View>
          <Image
            source={Images.assets.history_cover.source}
            style={styles.cover}
          />
        </View>
        <View
          style={styles.title}>
          <CustomText
            style={styles.subTitle}>
            chiều chiều ra đứng bờ đê,{`\n`}
            ngóng về hà nội đề về bao nhiêu...
          </CustomText>
        </View>
        {this.renderTable()}
      </View >
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  headRow: {
    height: 60,
  },
  cell: {
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: Colors.paleGrey,
  },
  tableHead: {
    alignItems: 'center'
  },
  subTitle: {
    color: Colors.white,
    textAlign: "center",
    lineHeight: 21
  },
  title: {
    alignItems: 'center',
    paddingVertical: 16
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

export default HistoryScreen
