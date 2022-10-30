import React from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import BaseScreen from '../BaseScreen';
import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import KeyboardScrollView from '../../element/KeyboardScrollView';
import { Row, Table } from 'react-native-table-component';
import BaseElement from '../../element/BaseElement';

const tableData = [
  [0, 3, 4, 5, 6, 7, 7, 9, 0],
  [0, 3, -2, 5, 6, 7, 0, 9, 0],
  [0, -3, 4, 4, 6, 0, 7, 9, 0],
  [0, 3, 4, 3, 5, 7, 7, 9, 0],
  [0, 7, 4, 3, 6, 0, 7, 9, 0],
  [0, 3, -4, 5, 6, 7, 0, 9, 0],
  [0, 3, -4, 5, 6, 7, 0, 9, 0],
  [0, 3, -4, 5, 6, -7, 0, 9, 0],
  [0, 3, 4, 5, 6, 7, 0, 9, 0],
  [0, 3, 4, 5, 6, 7, 0, 9, 0],
  [0, 3, 4, 5, 6, 7, 0, 9, 0],
  [0, 3, 4, 5, 6, 7, 0, -9, 0],
  [0, 3, 4, 5, 6, 7, 0, 9, 0],
  [0, 3, 4, 5, 6, 7, 0, -9, 0],
  [0, 3, -4, 5, 6, 7, 0, -9, 0],
  [0, 3, 4, 5, 6, 7, 0, 9, 0],
  [0, 3, 4, 5, 6, 7, 0, 9, 0],
  [0, 3, 4, -5, 6, 7, 0, 9, 0],
  [0, 3, 4, -5, 6, 7, 0, 9, 0],
  [0, 3, 4, 5, 6, 7, 0, -9, 0],
  [0, 3, 4, 5, 6, 7, 0, 9, 0],
]

const width = widthDevice / 6

class HistoryScreen extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Head', 'Head2', 'Head3', 'Head4', 'Head5', 'Head6', 'Head7', 'Head8', 'Head9'],
      widthArr: [width, width, width, width, width, width, width, width, width]
    };
    this.displayName = 'HistoryScreen';
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
          hitSlop={16}>
          <SVGIcon.ticked width={32} height={32} />
        </Pressable>
      </View>
      <View
        style={styles.footerButtonContainer}>
        <Pressable
          hitSlop={16}>
          <SVGIcon.cancel width={32} height={32} />
        </Pressable>
      </View>
    </View>)
  }

  renderTable = () => {
    const { widthArr, tableHead } = this.state
    return (
      <ScrollView
        horizontal>
        <View>
          <Table borderStyle={styles.borderStyle}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={{ height: 30 }}
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
                tableData.map((rowData, index) => (
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
                ))
              }
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    )
  }

  renderContent() {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
