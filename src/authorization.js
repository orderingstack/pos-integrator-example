const axios = require('axios');
const keytar = require('keytar')

const authorize = async (baseUrl, tenant, basicAuthPass, username) => {
    const password = await getPassword(username);
    let response = null;
    try {
        response = await axios({
            method: 'post',
            url: `${baseUrl}/auth-oauth2/oauth/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': `Basic ${basicAuthPass}`,
                'X-Tenant': tenant
            },
            data: `username=${username}&password=${password}&grant_type=password&scope=read`,
        });
        return {
            authData: response.data,
            err: null
        }
    } catch (error) {
        console.error('Authorization error');
        //console.error(error)
        return {
            authData: {},
            err: error.response ? error.response.status : error,
            errMsg: error.response ? (error.response.statusText + ' ' + error.response.status) : ''
        }
    }
}

async function savePasswordForUser(user, password) {
    await keytar.setPassword('OrderingStack', user, password);
}

async function getPassword(user) {
    const password = await keytar.getPassword('OrderingStack', user);
    return password;
}

module.exports = {
    authorize, savePasswordForUser
}