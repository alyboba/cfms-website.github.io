import request from 'request-promise';

export default class Api {
    getProfile(accessToken, uid, cb) {
        var options = {
            uri: `https://cfms.us.webtask.io/api/users/${uid}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            json: true // Automatically parses the JSON string in the response
        };

        request(options)
            .then(function (data) {
                cb(null, data.user);
            })
            .catch(function (err) {
                // API call failed...
            });
    }
}