enum Routes {
  GET_HEALTH_CHECK = '',
  GET_ENDPOINTS = 'endpoints',

  GET_PUBLIC_VALIDATE_CERTIFICATE = 'public/validate/certificates/:id',

  GET_SIGNATURES = 'master/signatures',
  GET_SIGNATURE = 'master/signatures/:id',
  GET_SIGNATURE_FILE = 'master/signatures/file/:id',
  POST_SIGNATURES = 'master/signatures',
  PUT_SIGNATURES = 'master/signatures',
  DELETE_SIGNATURE = 'master/signatures/:id',

  GET_TEMPLATES = 'master/templates',
  GET_TEMPLATE = 'master/templates/:id',
  GET_TEMPLATE_THUMBNAIL = 'master/templates/thumbnail/:id',
  POST_TEMPLATES = 'master/templates',
  PUT_TEMPLATES = 'master/templates',
  DELETE_TEMPLATE = 'master/templates/:id',

  GET_ASSETS = 'master/assets',
  GET_ASSET = 'master/assets/:id',
  GET_ASSET_FILE = 'master/assets/file/:id',
  POST_ASSETS = 'master/assets',
  PUT_ASSETS = 'master/assets',
  DELETE_ASSET = 'master/assets/:id',

  GET_CERTIFICATES = 'certificates',
  GET_CERTIFICATE = 'certificates/:id',
  POST_CERTIFICATES = 'certificates',
  PUT_CERTIFICATES = 'certificates',
  DELETE_CERTIFICATE = 'certificates/:id',
}

export default Routes;
