# chat

실시간 채팅을 구현해보자
![image](https://user-images.githubusercontent.com/44242823/172784048-380ec054-b18e-484c-87c6-2a97fda16d52.png)

## 도구

- 클라이언트: React
- 서버: Koa
- RTC: Socket.io
- 번들러: esbuild

## 빌드 및 실행

1. yarn install
2. yarn build
   > 변화가 저장될 때마다 반복적으로 빌드
   > 끝내려면 ctrl + c
3. yarn serve
   > src/server/index.ts의 변화에 따라 반복적으로 재시작됨 > 끝내려면 ctrl + c

## 할 일

- nickname 사용자가 설정하게 하기
- 클라이언트 접속이 끝났을 때 서버의 userList에서 제거하기
- concurrently로 빌드랑 서브 병렬적으로 실행하기
