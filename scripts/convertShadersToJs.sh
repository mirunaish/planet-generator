#!/bin/bash

# check that i'm running script in correct directory
if [ ! -d "src/painter" ]; then
    echo "Error: please run the script from the root directory of the project"
    exit 1
fi

# read fragment and vertex shader source files
fragmentSource=$(<src/painter/fragmentShader.glsl)
vertexSource=$(<src/painter/vertexShader.glsl)

# path to output js file
filepath="src/painter/shaderSource.js"

# write to js file
echo -e "// do not edit this file directly! edit fragmentShader.glsl and vertexShader.glsl\n// then run scripts/convertShadersToJs.sh\n" > $filepath
echo -e "fragmentSource = \`\n$fragmentSource\n\`;\n" >> $filepath
echo -e "vertexSource = \`\n$vertexSource\n\`;" >> $filepath