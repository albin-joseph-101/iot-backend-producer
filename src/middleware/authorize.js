import { verifyAPIToken, verifyToken } from '../utils/apiKeyProvider';
import errorResponse from '../utils/errorResponse';
import { HTTP_ERROR_CODE } from '../utils/constants';

const Errors = {
  default: {
    type: HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong',
    details: 'Please contact the system administrator',
  },
  privilege: {
    type: 'Un_Authorized',
    message: 'You do not have privilage to make This request.',
    details: 'Please contact admin',
  },
};


export const validateAPIKey = async function (req, res, next) {
  try {

    const token = String(req.query.key);
    //console.log(token)
    if (!token) throw Errors.privilege;
    const decoded = await verifyAPIToken(token);
    // console.log(decoded)
    if (!decoded) throw Errors.privilege;
    req.key = token;
    
 
    next();
  } catch (error) {
    return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
  }
};


export let role = {};

export const setRole = (req, res, next, roles) => {
  role = roles;
  next();
};

export const validateUser = async (req, res, next) => {
  try {
    const token = String(req.headers.authorization).split(' ')[1];
    if (!token) throw Errors.privilege;
    const decoded = await verifyToken(token);
    if (decoded instanceof Error) throw Errors.privilege;
    req.user = decoded;
    req.token = token;
    if (!role[decoded.role] && !role.all) throw Errors.privilege;
    next();

  } catch (error) {
    return errorResponse(error.type ? error : Errors.default, res, new Error().stack);
  }
};
