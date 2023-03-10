const fragmentShader = `
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_aspect;

uniform float u_time;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        1232.2143 * u_time);
}

void main(){
    

    vec2 norm_radius = vec2(0.05, 0.05) * vec2(1.0/u_aspect, 1.0);

    vec2 st = gl_FragCoord.xy/u_resolution;

    vec2 stMouse = u_mouse/u_resolution;

    float top = 1.0 - smoothstep(stMouse.y, stMouse.y + norm_radius.y, st.y);
    float bottom = smoothstep(stMouse.y - norm_radius.y, stMouse.y, st.y);
    float left = smoothstep(stMouse.x - norm_radius.x,stMouse.x, st.x);
    float right = 1.0 - smoothstep(stMouse.x, stMouse.x + norm_radius.x, st.x);

    float color = top * bottom * left * right;
    
    float rnd = random(st);
    
    gl_FragColor = vec4(vec3(color) * rnd * vec3(0.45, 1.0, 0.2), 1.0);
}
`

export default fragmentShader