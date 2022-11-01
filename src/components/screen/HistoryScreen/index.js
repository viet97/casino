import React from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import KeyboardScrollView from '../../element/KeyboardScrollView';
import { Row, Table } from 'react-native-table-component';
import BaseElement from '../../element/BaseElement';
import { trim } from 'lodash';

class HistoryScreen extends BaseElement {
  constructor(props) {
    super(props);
    this.width = (widthDevice - 2) / this.props.game.members.length
    if (this.width < 100) {
      this.width = 100
    }
    this.state = {
      widthArr: this.props.game.members.map(() => this.width)
    };
    this.displayName = 'HistoryScreen';
  }

  getTableHead = () => {
    return this.props?.game?.members.map((name, index) => {
      let sum = 0
      for (const match of this.props?.game?.matches) {
        sum += match[name]
      }
      return <View
        style={styles.tableHead}>
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
    })
  }

  getTableData = () => {
    return this.props.game.matches.map((match) => {
      return this.props.game.members.map(member => {
        if (Object.hasOwnProperty.call(match, member)) {
          return match[member]
        }
        return 0
      }).map(score => {
        let color = Colors.white
        if (score > 0) {
          color = Colors.green
        }
        if (score < 0) {
          color = "red"
        }
        return <CustomText
          style={{
            textAlign: "center",
            color
          }}
          size={10}>
          {score || "-"}
        </CustomText>
      })
    })
  }

  _componentDidMount() {
  }

  renderList = () => {
    return <KeyboardScrollView
      style={{
        flex: 1,
      }}>
      <FlatList
        bounces={false}
        data={[{}, {}, {}, {}, {}, {}]}
        style={styles.list}
        renderItem={this.renderItem}
      />
    </KeyboardScrollView>
  }

  renderFooter = () => {
    return (<View
      style={styles.footerContainer}>
      <View
        style={styles.footerButtonContainer}>
        <Pressable
          hitSlop={24}>
          <SVGIcon.ticked width={32} height={32} />
        </Pressable>
      </View>
      <View
        style={styles.footerButtonContainer}>
        <Pressable
          hitSlop={24}>
          <SVGIcon.cancel width={32} height={32} />
        </Pressable>
      </View>
    </View>)
  }

  renderTable = () => {
    const { widthArr } = this.state
    return (
      <ScrollView
        horizontal>
        <View>
          <Table borderStyle={styles.borderStyle}>
            <Row
              data={this.getTableHead()}
              widthArr={widthArr}
              style={{ height: 60 }}
              textStyle={{
                fontSize: 12,
                color: Colors.white,
                textAlign: "center"
              }} />
          </Table>
          <ScrollView
            bounces={false}
            style={styles.dataWrapper}>
            <Table borderStyle={styles.borderStyle}>
              {
                this.getTableData().map((rowData, index) => {
                  return (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={widthArr}
                      style={{
                        height: 28,
                        backgroundColor: index % 2 ? Colors.kode : Colors.TRANSPARENT,
                      }}
                      textStyle={{
                        textAlign: 'center',
                        color: rowData > 0 ? Colors.green : "red",
                        fontSize: 12
                      }}
                    />
                  )
                })
              }
            </Table>
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
  tableHead: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  borderStyle: { borderWidth: 1, borderColor: Colors.paleGrey },
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
