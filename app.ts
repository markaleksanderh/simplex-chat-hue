// ts-node app.ts

import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const BRIDGE_IP_ADDRESS = process.env.BRIDGE_IP_ADDRESS
const AUTHORISED_USER = process.env.AUTHORISED_USER

// TODO Get light id from user
let light_id = 4
var baseUrl = `http://${BRIDGE_IP_ADDRESS}/api/${AUTHORISED_USER}/lights/${light_id}`
 

function getLightState(url: string): Promise<boolean> {
    return axios.request({
            url: url,
            method: 'get'
        }).then(function(response){
            return response.data.state.on
        }).catch(function(error) {
            console.log(error.response.data)
        })
}


async function switchLight(url: string): Promise<void> {
    const state = await getLightState(baseUrl).then((data) => {return data})
    let data = {'on': !state}
    axios.request({
        url: `${url}/state`,
        data: data,
        method: 'put'
    })
}

switchLight(baseUrl)