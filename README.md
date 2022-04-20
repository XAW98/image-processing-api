### Scripts
- Install: ```npm install```
- Build: ```npm run build```
- Lint: ```npm run lint```
- Run unit tests: ```npm run test```
- Start server: ```npm run start```

### Usage
The server will listen on port 4000:

#### instructions
http://localhost:4000/

#### Endpoint to resize images
http://localhost:4000/api/images

Query arguments avaiable:
- _file_: Available files are:
  - animal
  - sunset
  - tree
  - water
- _width_: pixel value > 0
- _height_: pixel value > 0

#### Example 1
http://localhost:4000/api/images
Will list all available image in the dir

#### Example 2
http://localhost:4000/api/images?file=animal
Will display the original animal image.

#### Example 3
http://localhost:4000/api/images?file=animal&width=500&height=500
Will scale the animal image to 500 by 500 pixels and store the resulting image.
On subsequent calls will serve the resized image instead of resizing the
original again.

#### Example 4
http://localhost:4000/api/images?file=animal&width=-200&height=--200
Invalid width or height parameter will be noticed as error.

### Notes
- Images are served from `assets/images/full`. Further images with the extension
  can be put into that directory with no type checking.

- Image thumbs will be stored in `assets/images/thumb` and it will be served after re-render.
