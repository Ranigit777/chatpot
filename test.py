import sys
from gradio_client import Client

try:
    client = Client("RaniGowda/ChatPot")
    print(client.view_api(return_format="dict"))
except Exception as e:
    print(e)
