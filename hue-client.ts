import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const BRIDGE_IP_ADDRESS = process.env.BRIDGE_IP_ADDRESS
const AUTHORISED_USER = process.env.AUTHORISED_USER

// TODO Get light id from user
let light_id = 4
var baseUrl = `http://${BRIDGE_IP_ADDRESS}/api/${AUTHORISED_USER}/lights`


function getConnectedLights(url: string): Promise<void> {
    return axios.request({
        url: url,
        method: 'get'
    }).then(function(response) {
        return response.data
    }).catch(function(error) {
        console.log(error.response.data)
    })
}


// TODO Format list of lights 
async function listConnectedLights(url: string): Promise<void> {
    const lights = await getConnectedLights(url).then((data) => { return data})
    console.log(lights)
}


function getLightState(url: string, light_id: number): Promise<boolean> {
    return axios.request({
            url: `${url}/${light_id}`,
            method: 'get'
        }).then(function(response) {
            return response.data.state.on
        }).catch(function(error) {
            console.log(error.response.data)
        })
}

async function switchLight(url: string, light_id: number): Promise<void> {
    const state = await getLightState(baseUrl, light_id).then((data) => {return data})
    let data = {'on': !state}
    axios.request({
        url: `${url}/${light_id}/state`,
        data: data,
        method: 'put'
    })
}
