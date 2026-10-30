# Ghi chú nâng cấp RN 0.88 + gắn quảng cáo AdMob

> File này ghi lại tiến trình và context để làm tiếp sau này.
> Branch: `upgrade-rn-ads` (tách từ `main` @ `4e97e294`). Cập nhật lần cuối: 2026-10-29 16:40.
> **Chưa commit**: mọi thay đổi đang được `git add` trên branch. Có thể commit khi user đồng ý.

## Mục tiêu
1. App "Sổ Sinh Tử" đã lên store bằng RN 0.64.2 (commit cuối 02/2023). Bản này quá cũ để build và gắn ads, nên phải nâng cấp.
2. Gắn quảng cáo Google AdMob (`react-native-google-mobile-ads`).

## Trạng thái

| Hạng mục | Trạng thái |
|---|---|
| Tạo lại `android/`, `ios/` từ template RN **0.88.1** (React 19.3) | ✅ Xong |
| Chuyển code JS sang thư viện mới | ✅ Xong |
| `react-native bundle` cho android + ios | ✅ Chạy OK |
| ESLint (`--quiet`) | ✅ Sạch |
| Gắn banner và interstitial (đang dùng **test ID**) | ✅ Xong trong code |
| **Build native Android** (`./gradlew assembleDebug`) | ✅ Thành công (đã cài SDK `platforms;android-37.0`, build-tools 37, NDK 27.1) |
| **Build iOS** (`pod install`, Xcode) | ✅ Xcode 27.1, `pod install` OK, build Debug lên simulator "iPhone Duo" (iOS 27.1) thành công. App mở được, vào tới Home, font pixel hiển thị đúng, có hỏi quyền thông báo. Đã test trên simulator (30/10): Create, lưu Firestore, danh sách Home, thêm ván (Chiến), Lịch sử + banner, Tổng + banner, interstitial video khi vào trận. UMP/ATT explainer hiện lần đầu |
| Chạy thử Android trên máy ảo `Nexus_5X_API_33` | ✅ Đã test: Home, Tạo trận, Chiến (↑↓, zero-sum, lưu), Lịch sử, Tổng kết. Banner test và interstitial video test đều hiện OK |
| Tạo tài khoản AdMob, thay ID thật | ❌ Chưa (user chưa có tài khoản) |
| Rewarded ad (xem video để tắt ads) | ⏸ Chưa làm, chờ user quyết |

## Lịch sử thay đổi theo yêu cầu của user
- Bỏ banner ở Home.
- Interstitial: ban đầu hiện khi thoát trận, sau đó chuyển sang hiện khi **vào** trận, dạng video, giãn cách 3 phút.

## Môi trường
- Node **24** (`.nvmrc`), cài qua nvm: `nvm use 24`. RN 0.88 yêu cầu Node ≥ 22.13.
- JDK 17 (`/usr/libexec/java_home -v 17`).
- Android: compileSdk 37, targetSdk 36, minSdk 24, NDK 27.1.12297006.
  ```sh
  export ANDROID_HOME=~/Library/Android/sdk
  $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
  $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platforms;android-37.0" "build-tools;37.0.0" "ndk;27.1.12297006"
  ```
- iOS: cần Xcode bản mới, rồi chạy `bundle install && cd ios && bundle exec pod install`.
- Cài package: `npm install` (đã bỏ yarn.lock, dùng `package-lock.json`).

### Lỗi build Android đã gặp và cách sửa
- RN Firebase 27 mặc định dùng Firebase BoM 35.x, kéo theo `firebase-auth 25.0.0` được biên dịch bằng Kotlin 2.4. RN 0.88 dùng Kotlin 2.2 nên báo lỗi *"incompatible version of Kotlin"*.
  - **Không** nâng Kotlin lên 2.4: làm vậy sẽ hỏng KSP của AsyncStorage.
  - Cách đã dùng: ghim BoM **34.19.0** trong `android/build.gradle` (`project.ext.react-native.versions.firebase.bom`). Khi nâng RN hoặc Kotlin sau này thì có thể bỏ dòng ghim này.
- Chạy thử: `npx react-native start`, cài `app/build/outputs/apk/debug/app-debug.apk`, rồi `adb reverse tcp:8081 tcp:8081`. Build nhanh cho máy ảo: `./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a`.

## Định danh app (giữ nguyên để update được bản trên store)
- Android `applicationId`: `com.vietdq.casino` (namespace/package Java/Kotlin: `com.casino`).
  - `versionCode 2`, `versionName 1.1.0`. **Cần kiểm tra trên Play Console**: versionCode phải lớn hơn bản đang có.
  - Ký app: upload key nằm ở `android/app/upload-key`. Khai báo trong `~/.gradle/gradle.properties`:
    ```
    CASINO_UPLOAD_STORE_FILE=upload-key
    CASINO_UPLOAD_STORE_PASSWORD=...
    CASINO_UPLOAD_KEY_ALIAS=...
    CASINO_UPLOAD_KEY_PASSWORD=...
    ```
    Nếu không khai báo, bản release sẽ ký bằng debug key, giống config cũ. Cũng có thể ký bằng Android Studio.
- iOS bundle id: `co.vietdq.casino`, team `ZB9LJC92B6`, `MARKETING_VERSION 1.1.0`, build `4`. Tên hiển thị giữ nguyên là "Ghi điểm đánh bài - Tết 2023".
- Firebase config được chép lại từ bản cũ: `android/app/google-services.json`, `ios/casino/GoogleService-Info.plist`. iOS gọi `FirebaseApp.configure()` trong `AppDelegate.swift`, Podfile dùng `use_frameworks! :linkage => :dynamic`, vì Firebase iOS SDK 13+ chỉ phát hành qua SPM và RNFirebase báo lỗi nếu dùng SPM với static. Có thêm `pre_install` ép riêng pod `RNGoogleMobileAds` build static, vì `GoogleUserMessagingPlatform` là binary static. Không đặt `$RNFirebaseAsStaticFramework` nữa. Trong `post_install`, nâng `IPHONEOS_DEPLOYMENT_TARGET` của mọi pod lên `min_ios_version_supported` (15.1), vì Xcode 27 chỉ hỗ trợ từ 15.0 trở lên. Build simulator: `xcodebuild -workspace casino.xcworkspace -scheme casino -configuration Debug -destination 'id=<sim>' -derivedDataPath build`. Thư mục `ios/build` đã nằm trong .gitignore. Chạy pod bằng `source ~/.nvm/nvm.sh && nvm use 24 && cd ios && bundle exec pod install`.

## Dữ liệu người dùng (quan trọng)
- Firestore path: `users/{uid}/games/{gameId}`, trong đó `uid` = `getUniqueId` của `react-native-device-info`.
- Đã so sánh source của bản 7.1.0 và 15.0.2: iOS cùng đọc từ một khóa Keychain `DeviceUID`, Android cùng dùng `ANDROID_ID`. **ID không đổi, người dùng giữ được dữ liệu.** Code mới dùng `getUniqueIdSync()` vì `getUniqueId()` giờ trả về Promise.
- AsyncStorage v3: default export là "legacy storage", đọc được dữ liệu cũ (các key `LIST_NAME`, `CREATED_GAME`, `WENT_TO_DETAIL`).

## Thay đổi thư viện
- **Bỏ:** `@react-navigation/stack|drawer|bottom-tabs|material-bottom-tabs`, `react-native-reanimated`, `gesture-handler`, `@react-native-community/art|masked-view|viewpager|netinfo`, `react-native-orientation-locker` (khóa dọc bằng native config), `react-native-static-safe-area-insets` (dùng `initialWindowMetrics` của safe-area-context), `react-native-table-component` (tự dựng bằng View), `react-native-tags-input` (đã chép bản vá vào `src/components/common/TagInput`), `react-native-indicators`, `fast-image`, `image-zoom-viewer`, `exit-app`, `restart`, `qrcode-scanner`, `appcenter`, `axios`, `numeral`, `patch-package`, `prop-types`.
- **Navigation:** `@react-navigation/native-stack` v7.
- **Firebase v27:** chuyển sang API modular (`getFirestore`, `doc`, `onSnapshot`, ...).
- **Mới thêm:** `react-native-google-mobile-ads` v17.
- Đã xóa các component không dùng: `common/Image`, `common/ScrollableTabView`, `common/TabBar`, `modules/NetworkStateModule`, `modules/OrientationModule`.

## Bug cũ đã sửa trong quá trình nâng cấp
- `App.js` dùng `View` mà không import.
- Home và Detail đặt tên hàm `_componentUnMount`, nhưng lớp base gọi `_componentWillUnmount`, nên listener Firestore không bao giờ được hủy. Ở Detail còn thiếu `await`, nên unsubscribe là một Promise.
- FightScreen không nhận người chơi mới khi sửa trận (`this.match` chỉ khởi tạo một lần).
- HistoryScreen so sánh mảng bằng `>`. Nay độ rộng cột được tính lại mỗi lần render.
- CreateScreen gọi `JSON.parse('')` khi chưa có `LIST_NAME`. Thêm nhanh người chơi từ gợi ý giờ cũng kiểm tra giới hạn 12 người.
- Nút **Share** trên item ở Home trước không làm gì. Nay chia sẻ bảng tổng điểm dạng text.
- Xóa trận xong thì đóng modal xác nhận.
- `KeyboardScrollView` khi unmount gỡ listener `didHide` hai lần mà quên `didShow`.
- Trận bị xóa trong lúc đang mở Detail không còn làm crash app.
- Font "FVF Fernando 08" trên Android: file phải tên là `FVF Fernando 08.ttf` thì RN mới tìm thấy. Bản cũ để tên `fernando.ttf` nên nhiều khả năng **Android trước giờ không hiển thị font pixel**.

## Quảng cáo
- **Code:** `src/modules/AdsModule.js` (khởi tạo, consent, interstitial) và `src/components/element/Banner`.
- **Khởi tạo:** trong `SplashScreen` sau khi xin quyền thông báo. Bước consent (UMP, GDPR) chạy trước `mobileAds().initialize()`.
- **Banner** (`ANCHORED_ADAPTIVE_BANNER`): chỉ ở tab Lịch sử và Tổng kết của Detail, ngay trên thanh tab. **Không** đặt ở tab Chiến để tránh bấm nhầm khi nhập điểm. **Không** đặt ở Home: user đã yêu cầu bỏ (29/10/2026). Nếu tải lỗi (mất mạng, không có quảng cáo) thì banner ẩn đi và thử lại sau 30 giây.
- **Interstitial (video):** theo yêu cầu của user, hiện **mỗi lần vào một trận** (`DetailScreen._componentDidMount`), kể cả ngay sau khi tạo trận. Có giãn cách theo yêu cầu của user: **tối đa 1 lần mỗi 3 phút** (`INTERSTITIAL_INTERVAL`). Lần vào trận đầu tiên sau khi mở app vẫn hiện. Nếu quảng cáo chưa tải xong (mở trận liên tục quá nhanh) thì bỏ qua lần đó. Đang dùng `TestIds.INTERSTITIAL_VIDEO`. Ad unit thật: loại Interstitial, cho phép video.
  - Muốn đổi khoảng giãn cách thì sửa `INTERSTITIAL_INTERVAL` trong `AdsModule.js`.
- **ID:**
  - App ID nằm trong `app.json` → `react-native-google-mobile-ads` (đang là App ID **test** của Google).
  - Ad unit ID nằm trong `AD_UNIT_IDS` ở `AdsModule.js`. Để trống thì dùng test ID. Ở `__DEV__` luôn dùng test ID.

### Việc cần làm khi có tài khoản AdMob
1. Tạo app trên AdMob cho Android và iOS. Thay `android_app_id` và `ios_app_id` trong `app.json`, rồi chạy lại `pod install` và rebuild.
2. Tạo ad unit Banner và Interstitial (bật video). Điền vào `AD_UNIT_IDS`.
3. Trong AdMob, vào Privacy & messaging: tạo thông báo GDPR, và IDFA explainer cho iOS (ATT). Chuỗi `NSUserTrackingUsageDescription` lấy từ `user_tracking_usage_description` trong `app.json`.
4. Đặt file `app-ads.txt` trên website của developer (khai báo trong store listing).
5. Lưu ý chính sách: AdMob có thể xếp app vào nhóm cờ bạc vì các chữ "casino", "sát phạt", "đề về bao nhiêu". Nên cân nhắc đổi lại các chữ này.
6. Khai báo trong Play Console (Data safety: Advertising ID) và App Store (App Privacy).

## Việc còn lại / cần kiểm tra
- [ ] Chạy trên máy Android thật, kiểm tra: GIF ảnh bìa (đã thêm `fresco:animated-gif:3.7.0`), font, edge-to-edge (Android 15+ bắt buộc; đã cộng `insets.bottom` ở Home, Create và tab bar của Detail).
- [x] Cài Xcode, `pod install`, build iOS.
- [x] Test các màn và quảng cáo trên iOS simulator. Simulator không tự bấm được nên dùng script JS tạm để điều hướng, kết hợp `simctl io screenshot` và `log stream --level info`. Script đã xóa.
- [x] Sửa lỗi tràn ngang trên máy có safe area trái/phải. Trên "iPhone Duo" thanh trạng thái nằm bên phải; `App.js` dùng SafeAreaView edges left/right nên nội dung bị thu hẹp, trong khi `widthDevice` vẫn bằng toàn màn hình, làm tab TỔNG KẾT bị cắt. Đã đổi thành `widthDevice = widthWindow - insets.left - insets.right` trong `DeviceUtil.js`. Đã test lại OK trên iPhone Duo (iOS 27.1) và iPhone 15 Pro (iOS 17.4).
- [ ] Xcode 27 không còn Simulator.app, thay bằng `Xcode.app/Contents/Applications/DeviceHub.app`.
- [ ] iOS chưa từng bật capability Push Notifications (cả bản cũ). Nếu muốn có push trên iOS thì bật capability, thêm APNs key vào Firebase.
- [ ] Đã bỏ patch cũ của RN `KeyboardAvoidingView` (`keyboardFrame.screenY === 0`). Cần kiểm tra bàn phím ở màn Create và Chiến.
- [ ] Rewarded ad (tùy chọn).
- [ ] Trận test "29/10/2026 16:26" (TestA, TestB) đã được tạo trên Firestore dưới uid của máy ảo. **Cần xóa** sau khi test xong.
- [ ] Còn cảnh báo "VirtualizedLists should never be nested" ở FightScreen (FlatList nằm trong ScrollView, có từ bản cũ, chưa gây lỗi).
- [ ] **Đang dở:** xác nhận giãn cách 3 phút của interstitial. Đã thấy quảng cáo hiện khi mở trận (16:34:40, 16:34:55, khoảng 16:37). Nhưng lúc 16:40:28, tức hơn 3 phút sau lần hiện khoảng 16:37, mở trận lại **không** thấy `AdActivity`. Chưa rõ do quảng cáo chưa tải lại xong sau khi đóng, hay do logic. Cách test tiếp: thêm `console.log` trong `AdsModule.showInterstitial` (in `isInterstitialLoaded` và thời gian từ lần hiện trước), rồi xem `adb logcat | grep ReactNativeJS`.
  - Lưu ý khi test bằng adb: app debug khởi động chậm khi Metro phải đóng gói lại. Chờ log `Running "casino"` rồi mới bấm. Đừng bấm Back thừa, vì sẽ thoát app.
- [ ] Commit và merge branch `upgrade-rn-ads` (chưa commit).

### Phiên 30/10 (tiếp)
- **Sửa lỗi interstitial không hiện:** gọi `show()` ngay lúc màn Detail đang trượt vào thì Android báo `Timeout for show call succeed`, quảng cáo không hiện. Bản cũ vẫn tính là "đã hiện" nên bắt chờ 3 phút; đây là nguyên nhân lỗi hôm 29/10 vào lại sau hơn 3 phút mà không thấy quảng cáo.
  - `DetailScreen` giờ chờ sự kiện `transitionEnd` của navigation rồi mới gọi `AdsModule.showInterstitial()`.
  - `AdsModule` chỉ cập nhật `lastInterstitialShown` khi nhận event `OPENED`. Nếu show lỗi (event ERROR khi `isShowingInterstitial`) thì tự `load()` lại.
  - Đã test trên Android: AdActivity hiện quảng cáo video.
- **Đã test lại Android** (Nexus_5X_API_33): Home, Tạo trận, Chiến (thêm ván), Lịch sử + banner, Tổng kết + banner, quảng cáo video. Test thêm trận dài (8 người, 25 ván): Lịch sử cuộn được tới ván cuối, Tổng kết cuộn được hạng 1 đến 8. Banner nằm trong layout (giữa nội dung và tab bar), không đè lên nội dung.
- Đã xóa trận test cũ "29/10/2026 16:26" trên Android.
- **app-ads.txt:** pub id `pub-9474897494973817`. Đã tạo `website/` (index.html, app-ads.txt), `firebase.json` (hosting public=website) và `.firebaserc` (project `casino-ledger`). ✅ **Đã deploy 30/10**, `https://casino-ledger.web.app/app-ads.txt` trả HTTP 200. Lệnh deploy lại (cần Node 24): `npx firebase-tools deploy --only hosting --project casino-ledger`. Việc tiếp theo của user: điền `https://casino-ledger.web.app` vào mục Website trên Play Console và Marketing URL trên App Store Connect.
- Máy ảo Android cold boot có lúc bị treo package service ("Can't find service: package"). Cách xử lý: `adb emu kill` rồi chạy lại với `-no-snapshot-load`.
- **AdMob iOS App ID thật:** `ca-app-pub-9474897494973817~2426405596`, đã đặt vào `app.json` (`ios_app_id`). Android vẫn dùng App ID test. Ad unit iOS thật đã điền vào `AD_UNIT_IDS.ios` trong `AdsModule.js`: banner `ca-app-pub-9474897494973817/1022960055`, interstitial (ảnh + video) `ca-app-pub-9474897494973817/8266737242`. Bản dev (`__DEV__`) vẫn luôn dùng quảng cáo test. Android chưa có.
- **Build iOS Release cho simulator: OK.** Info.plist đã có `GADApplicationIdentifier` thật, `SKAdNetworkItems` (`cstr6suwn9.skadnetwork`, khai báo qua `sk_ad_network_items` trong app.json), `NSUserTrackingUsageDescription`, version 1.1.0 (build 4). App Release mở bình thường. TODO: có thể thêm đủ danh sách SKAdNetwork mà Google khuyến nghị.
- Lưu ý khi test bằng script JS tạm: Metro gửi bundle cho **mọi** máy đang kết nối, nên script cũng chạy trên máy kia. Lần trước iOS lỡ tạo trận "Android Test" và đã được dọn. uid Android emulator: `11fad933e0a47e37`, uid iOS sim Duo: `9C746601-...`. Hai uid khác nhau, đúng như mong đợi.
- **iOS version đã nâng lên 1.2.0 (build 5)** (`MARKETING_VERSION`/`CURRENT_PROJECT_VERSION` trong project.pbxproj) để nộp App Store. Android vẫn 1.1.0 (versionCode 2), sẽ nâng khi làm Android.
- **30/10: đã upload iOS 1.2.0 (build 5) lên App Store Connect** (Upload succeeded).
  - Cần đồng ý Program License Agreement mới trên developer.apple.com thì mới tạo được profile.
  - `TARGETED_DEVICE_FAMILY` đặt về `1` (chỉ iPhone, giống bản cũ). Template RN mặc định `1,2` thì bị đòi icon iPad 152/167.
  - Lệnh archive + upload: `xcodebuild archive ... -allowProvisioningUpdates`, rồi `xcodebuild -exportArchive` với ExportOptions (`method app-store-connect`, `destination upload`, team ZB9LJC92B6). Chỉ có cảnh báo thiếu dSYM của React/Hermes, không chặn upload.
  - AdMob: đã tạo IDFA explainer; GDPR message đang tạo (khuyên hiện nút "Không đồng ý").
  - User còn phải làm trên App Store Connect: tạo version 1.2.0, chọn build 5, cập nhật App Privacy (quảng cáo bên thứ ba: Device ID, Usage Data, Diagnostics), Marketing URL `https://casino-ledger.web.app`, rồi gửi duyệt.
- **Build 5 bị Apple báo lỗi 90683** (thiếu NSPhotoLibraryUsageDescription; thư viện share có tham chiếu API ảnh). Đã thêm `NSPhotoLibraryUsageDescription` và `NSPhotoLibraryAddUsageDescription` (tiếng Việt) vào Info.plist, nâng lên **build 6** và upload thành công 30/10. Trên ASC chọn build 1.2.0 (6).

