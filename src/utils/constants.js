export const HTTP_SUCCESS_CODE = {
    OK: 'Ok',
    CREATED: 'Created',
    ACCEPTED: 'Accepted',
    NO_CONTENT: 'No_Content',
};

export const HTTP_ERROR_CODE = {
    BAD_REQUEST: 'Bad_Request',
    UN_AUTHORIZED: 'Un_Authorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not_Found',
    CONFLICT: 'Conflict',
    INTERNAL_SERVER_ERROR: 'Internal_Server_Error',
    BAD_GATEWAY: 'Bad_GateWay',
};

export const ERROR_STATUS = {
    Bad_Request: 400,
    Un_Authorized: 401,
    Forbidden: 403,
    Not_Found: 404,
    Conflict: 409,
    Internal_Server_Error: 500,
    Bad_Gateway: 502,
};

export const SUCCESS_STATUS = {
    Ok: 200,
    Created: 201,
    Accepted: 202,
    No_Content: 204,
};


export const MUST_HAVE_PROPERTIES = [
    "deviceId",
    "latitude",
    "longitude",
    "timestamp",
    "temp",
    "voltage",
    "current"
]

export const ALLOWED_PROPERTIES = [
    "heading",
    "distance",
    "altitude",
    "key",
    "sop",
    "soc",
    "chargeStatus",
    "chargeCycle",
    "chargeFetStatus",
    "dischargeFetStatus",
    "batterySerial",
    "alarms",
    "trackerAlarm",
    "soh",
    "speed",
    "cellVoltage",
    "cellTemp"
]