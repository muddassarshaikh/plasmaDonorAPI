const router = require('express').Router();
const api = require('./controller');
const auth = require('../../../../common/authentication');

// Middle layer for User API
router.post('/registration', auth.decryptRequest, api.registration);
router.post('/login', auth.decryptRequest, api.login);
router.get('/profile', auth.validateToken, api.getProfile);
router.put(
  '/profile',
  auth.validateToken,
  auth.decryptRequest,
  api.updateProfile
);

router.post('/requester', auth.decryptRequest, api.addRequester);
router.get('/requester', api.getRequester);
router.put('/requester/:id', api.updateRequester);

module.exports = router;
