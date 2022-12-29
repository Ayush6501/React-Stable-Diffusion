import auth_token
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from io import BytesIO
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# if torch.backends.mps.is_available():
#     device = torch.device('cpu')
# else:
device = 'mps'
model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, use_auth_token=auth_token)
pipe.safety_checker = lambda images, clip_input: (images, False)
pipe = pipe.to("mps")
pipe.enable_attention_slicing()


@app.get('/')
def generate(prompt: str):
    image = pipe(prompt, guidance_scale=8.5).images[0]
    image.save('ImageSaved.png')

    buffer = BytesIO()
    image.save(buffer, format='PNG')
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type='image/png')