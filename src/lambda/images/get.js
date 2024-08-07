const { handleHttpRequest } = require('slsberry');

const doaminList = [
  '111',
  '디콰',
  '요즘IT',
  '팁스터',
  '팩플',
  '핀터레스트',
  'carret',
  'desingn compass',
  'dig',
  'eo',
  'linkedin',
  'newneek',
  'miracle letter',
  'roa',
  'rocket punch',
  'surfit',
  'wanted',
];

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
    unsupported_doain_name: { status_code: 404, reason: '존재하지 않는 도메인 이름' },
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

    if (!doaminList.includes(domainName)) {
      return { predefinedError: apiSpec.errors.unsupported_doain_name };
    }

    const encodedDomainName = encodeURIComponent(domainName.normalize('NFD')).replace(/%20/g, '+');

    if (domainName === 'design compass') {
      return {
        status: 200,
        response: { image: `https://hedwig-domain-image-dev.s3.ap-northeast-2.amazonaws.com/${encodedDomainName}.webp` },
      };
    }

    if (domainName === 'miracle letter') {
      return {
        status: 200,
        response: { image: `https://hedwig-domain-image-dev.s3.ap-northeast-2.amazonaws.com/${encodedDomainName}.jpg` },
      };
    }

    if (domainName === 'roa') {
      return {
        status: 200,
        response: { image: `https://hedwig-domain-image-dev.s3.ap-northeast-2.amazonaws.com/${encodedDomainName}.jpeg` },
      };
    }
    return { status: 200, response: { image: `https://hedwig-domain-image-dev.s3.ap-northeast-2.amazonaws.com/${encodedDomainName}.png` } };
  } catch (e) {
    console.error(e);
    return { predefinedError: apiSpec.errors.unexpected_error };
  }
}

exports.handler = async (event, context) => {
  return await handleHttpRequest(event, context, apiSpec, handler);
};
