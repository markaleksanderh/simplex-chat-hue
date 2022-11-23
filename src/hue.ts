import axios from 'axios'

export function getConnectedLights(url: string): Promise<void> {
    return axios.request({
        url: url,
        method: 'get'
    }).then(function(response) {
        return response.data
    }).catch(function(error) {
        console.log(error.response.data)
    })
}


export async function listConnectedLights(url: string): Promise<void> {
    const lights = await getConnectedLights(url).then((data) => { return data})
    return lights
}


export async function switchOn(url: string, light_id: number): Promise<void> {
    return axios.request({
        url: `${url}/${light_id}/state`,
        data: 'on',
        method: 'put'
    }).then(function(response) {
        return response.data.state.on
    }).catch(function(error) {
        console.log(error.response.data)
    })
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


export async function switchLight(url: string, light_id: number): Promise<void> {
    const state = await getLightState(url, light_id).then((data) => {return data})
    let data = {'on': !state}
    axios.request({
        url: `${url}/${light_id}/state`,
        data: data,
        method: 'put'
    })
}
