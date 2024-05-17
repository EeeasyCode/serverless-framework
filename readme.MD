# aws lambda image server

## Environment

- AWS (region: ap-northeast-2, bucket: aws-image-storage)

  - lambda
  - api-gateway
  - s3

- serverless framework

- node.js 16.x

## run

1. npm install
2. npm install -g serverless
3. sls deploy

## lambda funtion

- uploadImage [method = post]

  - "multipart/form-data" 로 이미지를 받아올 수 있음.
  - endpoint : https://aws-address.com/dev/image

- resizeImage [method = get]

  - endpoint: https://aws-address.com/dev/image/{imageName}
  - 예시 : image/test.webp?w=100&h=100&e=jpg (100x100은 resize할 크기, 1.png는 버킷에 저장되어 있는 원본 파일의 이름)
  - pathparameter: 리사이징할 이미지 파일명
  - queryparameter: 리사이징할 크기 (r, w), 변경할 확장자명(e)

## Code Description

- 파일 업로드 취약점 이슈

  - 확장자명 화이트리스트 필터링을 통한 웹쉘 업로드 방지  
    `const supportImageTypes = ["JPG/JPEG", "BMP", "GIF", "PNG"];`

  - 이미지 서버 분리로 인한 web 서버 접근 제한

- 이미지 업로드시 webp로 변환 후 저장
  - 효율적인 저장을 위한 webp 확장자 명으로 변경 후 s3에 저장 (기존 이미지 대비 70% 정도 압축 가능)
  - sharp 라이브러리를 통한 리사이징 시 소요 시간 감소 (타 라이브러리 대비 200% 시간 단축 가능)
