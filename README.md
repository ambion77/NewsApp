## react native 설치
npx @react-native-community/cli init NewsApp
## 환경변수 설정

1. JAVA_HOME이라는 새 변수를 추가하고, 값으로 Java 설치 경로를 입력합니다.
2. Path 변수에 %JAVA_HOME%\bin
3. Android SDK가 설치된 경로를 확인합니다. 일반적으로 C:\Users\<사용자이름>\AppData\Local\Android\Sdk에 위치합니다.
4. 시스템 환경 변수 설정으로 이동합니다.
5. ANDROID_HOME이라는 새 변수를 추가하고, 값으로 Android SDK 설치 경로를 입력합니다.
6. Path 변수에 %ANDROID_HOME%\platform-tools와 %ANDROID_HOME%\tools
7. local.properties 파일 수정(프로젝트 루트에 있음)
sdk.dir=C:\\Users\\사용자이름\\AppData\\Local\\Android\\Sdk
## 설치 패키지(생성된 프로젝트 폴더이동후)
npm install axios
npm install react-native-webview
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view

## 소스생성
App.tsx
HomeScreen.tsx

## 실행
npx react-native run-android
## 배포(./android 폴더 이동후)
  ./gradlew assembleRelease 

*gradle 캐시정리*
./gradlew clean

## APK 확인
D:\code_test\test20250312\NewsApp\android\app\build\outputs\apk\release
