const axios = require('axios');

class APIRequest {
    constructor(options = {}) {
        this.option = Object.assign(
            { headers: { 'Content-Type': 'application/json' } },
            options
        );
    }

    async get(url, params = {}) {
        this.option.params = params;
        try {
            const response = await axios.get(url, this.option);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    async post(url, body = {}) {
        try {
            const response = await axios.post(url, body, this.option);
            return response.data;
        } catch (err) {
            throw this.handleError(err);
        }
    }

    handleError(err) {
        if (err.response) {
            const errorData = err.response.data.errors || err.response.data;
            console.error(errorData);
            const status = err.response.status;
            const message = err.response.statusText || 'Error occurred';
            throw { status, message, errorData };
        } else if (err.request) {
            throw { status: 500, message: 'Request failed' };
        } else {
            throw { status: 500, message: err.message };
        }
    }
}

module.exports = APIRequest;
