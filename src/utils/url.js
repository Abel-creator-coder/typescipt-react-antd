const isProduction = process.env.NODE_ENV === 'production';

const url = isProduction ? '' : '';

const apiUrl = '/api';  


export {
  apiUrl,
  url
};
