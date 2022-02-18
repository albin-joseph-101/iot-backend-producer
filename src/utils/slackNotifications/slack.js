import axios from "axios";

export const notifyErrorOnSlack = async (err) => {
    await axios.post(process.env.SLACK_ERROR_URL, {
        attachments: [
            {
                pretext: 'A critical error has occured in Battery Smart⚠️.\nPlease find the error details below:',
                title: err.message,
                text: err.stack,

                footer: `Error Occured At: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`,
            },
        ],
    });
}
