import React from 'react';
import RootSiblings from 'react-native-root-siblings';

import {
  StyleSheet, 
} from 'react-native';


const styles = StyleSheet.create({});
class DialogGlobal {
  static getInstance() {
    if (!this._instance) {
      this._instance = new DialogGlobal();
    }
    return this._instance;
  }

  static clear() {
    if (this._instance) {
      this._instance.destroy();
      delete this._instance;
    }
  }

  constructor() {
    this.displayName = 'DialogGlobal';
    this.dialog = null;
    this.showed = false;
  }

  showDialog = (content, duration) => {
    this.destroyLastDialog();
    if (duration) {
      this.displayTimeout = setTimeout(
        () => this.destroyLastDialog(),
        duration
      );
    }
    this.dialog = new RootSiblings(content);
  };

  isShowed = () => {
    return this.dialog;
  };

  destroyLastDialog = () => {
    if (this.displayTimeout) {
      clearTimeout(this.displayTimeout);
      this.displayTimeout = null;
    }
    if (this.dialog) {
      this.dialog.destroy();
      this.dialog = null;
    }
  };

  // showOrderBottomAction = ({
  //   onConfirmOrder,
  //   onSubInvoices,
  //   onPackingSlips,
  //   hasConfirmOrder = true,
  //   hasDownloadSubInvoice = true,
  //   hasDownloadPackingSlips = true,
  // }) => {
  //   this.showDialog(
  //     <View
  //       style={{
  //         height: 88,
  //         width: '100%',
  //         backgroundColor: Colors.void,
  //         position: 'absolute',
  //         bottom: 0,
  //         left: 0,
  //         flexDirection: "row",
  //         alignItems: 'center',
  //         justifyContent: 'center'
  //       }}>
  //       {hasConfirmOrder ? <Pressable
  //         onPress={onConfirmOrder}
  //         style={{
  //           alignItems: 'center',
  //           marginHorizontal: 12
  //         }}>
  //         <SVGIcon.confirm_order_bottom />
  //         <Text
  //           size={11}
  //           style={{
  //             color: Colors.white,
  //             marginTop: 3
  //           }}>
  //           Confirm POs
  //         </Text>
  //       </Pressable> : null}
  //       {hasDownloadSubInvoice ? <Pressable
  //         onPress={onSubInvoices}
  //         style={{
  //           alignItems: 'center',
  //           marginHorizontal: 12
  //         }}>
  //         <SVGIcon.download_bottom />
  //         <Text
  //           size={11}
  //           style={{
  //             color: Colors.white,
  //             marginTop: 3,
  //           }}>
  //           Sub-invoices
  //         </Text>
  //       </Pressable> : null}
  //       {
  //         hasDownloadPackingSlips ? <Pressable
  //           onPress={onPackingSlips}
  //           style={{
  //             alignItems: 'center',
  //             marginHorizontal: 12
  //           }}>
  //           <SVGIcon.download_bottom />
  //           <Text
  //             size={11}
  //             style={{
  //               color: Colors.white,
  //               marginTop: 3,
  //             }}>
  //             Packing Slips
  //           </Text>
  //         </Pressable> : null
  //       }
  //     </View >
  //   )
  // }

}

export default DialogGlobal;
