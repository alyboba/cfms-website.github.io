import request from 'request-promise';

export default class ApiProvider {
    static getUserProfile(accessToken, uid, cb) {
        var options = {
            uri: `https://cfms.us.webtask.io/api/users/${uid}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            json: true // Automatically parses the JSON string in the response
        };

        request(options)
            .then((data) => {
                localStorage.setItem('profile', JSON.stringify(data.user));

                cb(null, data.user.app_metadata.firebase_token);
            })
            .catch(function (err) {
                cb(err);
            });
    }

    static logout() {
        localStorage.removeItem('profile');
    }
}