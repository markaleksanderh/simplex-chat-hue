import requests
import json

from dotenv import load_dotenv
load_dotenv()
from os import environ as env

BRIDGE_IP_ADDRESS = env.get('BRIDGE_IP_ADDRESS')
AUTHORISED_USER = env.get('AUTHORISED_USER')

# TODO Get light ID input from user
light_id = 4

url = f'http://{BRIDGE_IP_ADDRESS}/api/{AUTHORISED_USER}/lights/{light_id}'

def get_light_state(url: str) -> bool:
    # Get light state, i.e. whether light is on or off
    r = requests.get(f'{url}', verify=False).json()
    return r['state']['on']


def switch_light(url: str):
    # Invert value of state, i.e. turn off if on and vice versa
    data = json.dumps({'on': not get_light_state(url)})
    requests.put(f'{url}/state', data=data, verify=False)


switch_light(url)