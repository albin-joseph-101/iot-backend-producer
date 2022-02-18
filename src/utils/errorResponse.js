import { ERROR_STATUS } from './constants';
import { apiLogger } from './loggers/apiLogger';


const errorResponse = async (errorObj, res, stack = '') => {

  if (res?.req?.originalUrl.includes('/api')) {
    apiLogger.error(
      '\n [MESSAGE: %s] \n [CODE: %s] \n [PATH: %s] \n [STACK: %s]',
      errorObj.message,
      ERROR_STATUS[errorObj?.type] || 400,
      res?.req?.originalUrl,
      stack ? `${stack}` : ''
    );
  }

  errorObj.stack = stack;
  // errorObj?.type === 'Internal_Server_Error' ? notifyErrorOnSlack(errorObj) : null;
  
  res
    ? res.status(ERROR_STATUS[errorObj?.type] || 400).send({
      message: errorObj.message ? errorObj.message : 'Something went wrong',
      success: false,
      error: {
        code: ERROR_STATUS[errorObj?.type] || 400,
        timeStamp: new Date().toLocaleString(),
        path: res.req.originalUrl,
        detail: errorObj.details ? errorObj.details : 'Please contact the system administrator',
      },
    })
    : res.send("hi");
}

export default errorResponse