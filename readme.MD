# aws lambda file server

## Environment

- AWS (region: ap-northeast-2, bucket: aws-file-storage-dev)

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

- uploadFile [method = post]

  - "multipart/form-data" 로 이미지를 받아올 수 있음.
  - endpoint : https://aws-address.com/dev/file
  - queryParamters 로 folder를 받아, s3에 넘겨받은 folder 디렉터리 생성

- downloadZip [method = post]
  - "body"로 항목들의 목록, 폴더명을 받으면  
    그 폴더안에 있는 항목들을 zip으로 압축해서 다운받을 수 있게 하는 signed url 생성

## Code Description

- 파일 업로드 취약점 이슈

  - 확장자명 화이트리스트 필터링을 통한 웹쉘 업로드 방지  
     `const supportFileTypes = ["txt", "hwp", "ppt", "pptx", "xlsx", "docx", "pdf", "png", "jpg", "gif", "jpeg", "bmp"];`

  - 파일 서버 분리로 인한 web 서버 접근 제한

- 파일 1개당 최대 10MB 로 제한
- 업로드 갯수는 최대 10개까지로 제한
