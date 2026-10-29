# Ghi chú nâng cấp RN 0.88 + gắn quảng cáo AdMob

> File này ghi lại tiến trình và context để làm tiếp sau này.
> Branch: `upgrade-rn-ads` (tách từ `main` @ `4e97e294`). Cập nhật lần cuối: 2026-10-29.

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
| **Build native Android** (`./gradlew assembleDebug`) | ❌ Chưa chạy: máy thiếu SDK `platforms;android-37`, `build-tools;37.0.0`, `ndk;27.1.12297006`. Cần tự chấp nhận license, xem bên dưới |
| **Build iOS** (`pod install`, Xcode) | ❌ Chưa chạy: máy chưa cài Xcode (chỉ có Command Line Tools) |
| Chạy thử trên thiết bị | ❌ Chưa |
| Tạo tài khoản AdMob, thay ID thật | ❌ Chưa (user chưa có tài khoản) |
| Rewarded ad (xem video để tắt ads) | ⏸ Chưa làm, chờ user quyết |

## Môi trường
- Node **24** (`.nvmrc`), cài qua nvm: `nvm use 24`. RN 0.88 yêu cầu Node ≥ 22.13.
- JDK 17 (`/usr/libexec/java_home -v 17`).
- Android: compileSdk 37, targetSdk 36, minSdk 24, NDK 27.1.12297006.
  ```sh
  export ANDROID_HOME=~/Library/Android/sdk
  $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
  $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platforms;android-37" "build-tools;37.0.0" "ndk;27.1.12297006"
  ```
- iOS: cần Xcode bản mới, rồi chạy `bundle install && cd ios && bundle exec pod install`.
- Cài package: `npm install` (đã bỏ yarn.lock, dùng `package-lock.json`).

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
- Firebase config được chép lại từ bản cũ: `android/app/google-services.json`, `ios/casino/GoogleService-Info.plist`. iOS gọi `FirebaseApp.configure()` trong `AppDelegate.swift`, Podfile dùng `use_frameworks! :linkage => :static`.

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
- **Banner** (`ANCHORED_ADAPTIVE_BANNER`):
  - Home: dưới nút "Tạo trận mới", cách 16px.
  - Detail: tab Lịch sử và Tổng kết, ngay trên thanh tab. **Không** đặt ở tab Chiến để tránh bấm nhầm khi nhập điểm.
- **Interstitial:** hiện khi thoát Detail về Home. Giới hạn tối đa 1 lần mỗi **3 phút** và lần đầu tiên chỉ hiện sau 3 phút kể từ lúc mở app (`INTERSTITIAL_INTERVAL`).
- **ID:**
  - App ID nằm trong `app.json` → `react-native-google-mobile-ads` (đang là App ID **test** của Google).
  - Ad unit ID nằm trong `AD_UNIT_IDS` ở `AdsModule.js`. Để trống thì dùng test ID. Ở `__DEV__` luôn dùng test ID.

### Việc cần làm khi có tài khoản AdMob
1. Tạo app trên AdMob cho Android và iOS. Thay `android_app_id` và `ios_app_id` trong `app.json`, rồi chạy lại `pod install` và rebuild.
2. Tạo ad unit Banner và Interstitial. Điền vào `AD_UNIT_IDS`.
3. Trong AdMob, vào Privacy & messaging: tạo thông báo GDPR, và IDFA explainer cho iOS (ATT). Chuỗi `NSUserTrackingUsageDescription` lấy từ `user_tracking_usage_description` trong `app.json`.
4. Đặt file `app-ads.txt` trên website của developer (khai báo trong store listing).
5. Lưu ý chính sách: AdMob có thể xếp app vào nhóm cờ bạc vì các chữ "casino", "sát phạt", "đề về bao nhiêu". Nên cân nhắc đổi lại các chữ này.
6. Khai báo trong Play Console (Data safety: Advertising ID) và App Store (App Privacy).

## Việc còn lại / cần kiểm tra
- [ ] Build Android, chạy trên máy thật, kiểm tra: GIF ảnh bìa (đã thêm `fresco:animated-gif:3.7.0`), font, edge-to-edge (Android 15+ bắt buộc; đã cộng `insets.bottom` ở Home, Create và tab bar của Detail).
- [ ] Cài Xcode, `pod install`, build iOS và kiểm tra tương tự.
- [ ] iOS chưa từng bật capability Push Notifications (cả bản cũ). Nếu muốn có push trên iOS thì bật capability, thêm APNs key vào Firebase.
- [ ] Đã bỏ patch cũ của RN `KeyboardAvoidingView` (`keyboardFrame.screenY === 0`). Cần kiểm tra bàn phím ở màn Create và Chiến.
- [ ] Rewarded ad (tùy chọn).
- [ ] Commit và merge branch `upgrade-rn-ads` (chưa commit).
