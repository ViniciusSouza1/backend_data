const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class SendMessageServices {

    async sendAWhatsAppMessage(id, newmessage) {
        try {
            var formData = new FormData();
            formData.append('message', newmessage);
            formData.append('sent_by', 'bot');
            formData.append('integration', 'integration-1')
            let info;
            var obj = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55IjoiNWZjZTMxYzk5ZTMxNTIwMjZhYjliYzM5IiwiZW1wbG95ZWUiOiI2MDU4ZjYzZGY5OTVkYzQxNDA4NmE4ZDkiLCJpYXQiOjE2MTcwNDE5NDd9.9DvXbXVO-GYmNzujvf5NUelFXajPPfVzROs1VEAoV18'
                },
                body: formData
            };
            info = await fetch('https://api.megasac.tallos.com.br/v2/messages/' + id + '/send', obj).then((res) => (res.json()));
            return info;
        } catch (err) {
            return ({ error: 'Unable to return: ' + err });
        }
    }
    

}

module.exports = SendMessageServices;


