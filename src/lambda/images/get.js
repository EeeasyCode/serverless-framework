const { handleHttpRequest } = require('slsberry');

const apiSpec = {
  category: 'images',
  desc: '지정한 이미지를 가져온다.',
  event: [
    {
      type: 'REST',
      method: 'Get',
    },
  ],
  parameters: {
    domainName: { req: true, type: 'string', desc: '가져올 이미지의 도메인 이름' },
  },
  errors: {
    unexpected_error: { status_code: 500, reason: '예상치 못한 오류' },
    invaild_domain_name: { status_code: 400, reason: '올바르지 않은 도메인 이름' },
  },
  responses: {
    description: '',
    content: 'application/json',
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', desc: '이미지 URL' },
      },
    },
  },
};

exports.apiSpec = apiSpec;

async function handler(inputObject, event) {
  try {
    const { domainName } = inputObject;

    if (!domainName) {
      return { predefinedError: apiSpec.errors.invaild_domain_name };
    }

    if (domainName === 'design compass') {
      return { status: 200, response: { image: `https://hedwig-domain-image-dev.s3.ap-northeast-2.amazonaws.com/${domainName}.webp` } };
    }

    return { status: 200, response: { image: `https://hedwig-domain-image-dev.s3.ap-northeast-2.amazonaws.com/${domainName}.png` } };
  } catch (e) {
    console.error(e);
    return { predefinedError: apiSpec.errors.unexpected_error };
  }
}

exports.handler = async (event, context) => {
  return await handleHttpRequest(event, context, apiSpec, handler);
};
