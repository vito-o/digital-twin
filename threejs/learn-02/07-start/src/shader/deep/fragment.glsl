// precision 美/prɪˈsɪʒn/  有三种精度可以选择
// · highp -2^16 ~ 2^16
// · mediump -2^10 ~ 2^10
// · lowp -2^8 ~ 2^8
precision lowp float;

varying vec2 vUv;

uniform float uTime;
uniform float uScale;

#define PI 3.14159265358

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


void main() {
  // 通过顶点对应的uv，决定每个像素在uv图像上的位置，通过这个位置x,y决定颜色
  // gl_FragColor = vec4(vUv, 1.0, 1.0);

  // 第一种变形
  // gl_FragColor = vec4(vUv, 1.0, 1.0);

  // 实现从左到右的渐变
  // 利用uv实现渐变效果 uv 从左下角顺时针四个点的坐标(0,0) (1,0) (1,1) (0,1) 
  // float strength = vUv.x;
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 实现从下到上的渐变
  // float strength = vUv.y;
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 实现从上到下的渐变
  // float strength = 1.0 - vUv.y;
  // gl_FragColor = vec4(strength, strength, strength, 1);
  
  // 实现渐变比较剧烈 ， 超过1 人家就以1计算
  // float strength = vUv.y * 10.0; 
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 实现不断渐变，取模（类似求余）
  // float strength = mod(vUv.y * 10.0, 1.0); 
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 斑马条纹
  // float strength = mod(vUv.y * 10.0, 1.0); 
  // // step 小于0.5（第一个参数） 是0， 大于0.5是1
  // strength = step(0.5, strength);
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 让两个条纹相加（横竖相加）
  // float strength = step(0.5, mod(vUv.x * 10.0, 1.0)); 
  // strength += step(0.5, mod(vUv.y * 10.0, 1.0)); 
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 让两个条纹相乘（横竖相乘）
  // float strength = step(0.5, mod(vUv.x * 10.0, 1.0)); 
  // strength *= step(0.5, mod(vUv.y * 10.0, 1.0)); 
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 让两个条纹相减（横竖相减）
  // float strength = step(0.5, mod(vUv.x * 10.0, 1.0)); 
  // strength -= step(0.5, mod(vUv.y * 10.0, 1.0)); 
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 让两个条纹偏移（横竖） - 方块图形
  // float strength = step(0.2, mod(vUv.x * 10.0, 1.0)); 
  // strength *= step(0.2, mod(vUv.y * 10.0, 1.0)); 
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 让两个条纹偏移（横竖） - T图形， 带动效
  // float barX = step(0.4, mod((vUv.x+uTime) * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0)); 
  // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod((vUv.x+uTime) * 10.0, 1.0)); 
  // // strength *= step(0.2, mod(vUv.y * 10.0, 1.0)); 
  // float strength = barX + barY;
  // gl_FragColor = vec4(strength, strength, strength, 1);
  // // gl_FragColor = vec4(vUv, 1.0, strength);

  // 利用绝对值
  // float strength = abs(vUv.x - 0.5);
  // strength += abs(vUv.y - 0.5);
  // gl_FragColor = vec4(strength, strength, strength, 1);
  
  // 取两个绝对值的最小值
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 取两个绝对值的最大值
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 取两个绝对值的最大值，再结合step
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 上一个的反向展示
  // float strength = 1.0 - step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 利用取整实现条纹渐变
  // float strength = floor(vUv.x * 10.0) / 10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1);
  
  // 利用取整实现条纹渐变 - 横向
  // float strength = floor(vUv.y * 10.0) / 10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 条纹相乘，实现格子
  // float strength = floor(vUv.x * 10.0) / 10.0   *   floor(vUv.y * 10.0) / 10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1);
  
  // 向上取整
  // float strength = ceil(vUv.x * 10.0) / 10.0   *   ceil(vUv.y * 10.0) / 10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 使用随机函数
  // float strength = random(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 格子 + 随机
  // float strength = floor(vUv.x * 10.0) / 10.0   *   floor(vUv.y * 10.0) / 10.0;
  // strength = random(vec2(strength, strength));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // length 
  // float strength = length(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 计算两个向量的距离 distance
  // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 计算两个向量的距离 distance, 日晕效果
  // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1);
  
  // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, strength);

  // 设置uv水平或竖直变量  
  // float strength = 0.15 / distance(vec2(vUv.x, vUv.y * 5.0), vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, strength);
  // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y-0.5) * 5.0), vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, strength);
  
  // 十字交叉
  // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y-0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(vUv.y, (vUv.x-0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, strength);

  // // 旋转飞镖， 旋转uv
  // vec2 rotateUv = rotate(vUv, 3.14*0.25, vec2(0.5, 0.5));

  // float strength = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y-0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(rotateUv.y, (rotateUv.x-0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, strength);
  
  // 旋转飞镖， 旋转uv 2
  // vec2 rotateUv = rotate(vUv, uTime, vec2(0.5, 0.5));
  // float strength = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y-0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(rotateUv.y, (rotateUv.x-0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, strength);

  // 圆
  // float strength = 1.0 - step(0.5, (distance(vUv, vec2(0.5, 0.5)) + 0.25));
  // gl_FragColor = vec4(strength, strength, strength, strength);

  // 圆环 
  // 圆环1.
  // float strength = step(0.5, (distance(vUv, vec2(0.5, 0.5)) + 0.25));
  // strength += 1.0 - step(0.5, (distance(vUv, vec2(0.5, 0.5)) + 0.4));

  // 圆环2.
  // float strength = step(0.5, (distance(vUv, vec2(0.5, 0.5)) + 0.35));
  // strength *= 1.0 - step(0.5, (distance(vUv, vec2(0.5, 0.5)) + 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 圆环3. - 渐变环
  // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 圆环4. - 靶环
  // float strength = step(0.1, abs(distance(vUv, vec2(0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1);
  
  
  // 圆环5  - 波浪环
  // vec2 waveUv = vec2(
  //   vUv.x,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 圆环5  - 波浪环
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) * 0.1, 
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 圆环6  - 波浪环
  // vec2 waveUv = vec2(  
  //   vUv.x + sin(vUv.y * 100.0) * 0.1, 
  //   vUv.y + sin(vUv.x * 100.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // float angle = atan(vUv.x, vUv.y);
  // float strength = angle;
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 根据角度显示视图
  // float angle = atan(vUv.x, vUv.y);
  // float strength = angle;
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 根据角度实现螺旋渐变
  // float angle = atan(vUv.x-0.5, vUv.y-0.5);
  // float strength = (angle + 3.14) / 6.28;
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 实现雷达扫射
  // // 1.旋转
  // vec2 rotateUv = rotate(vUv, -uTime * 10.0, vec2(0.5, 0.5));
  // // 2.圆
  // float alpha = 1.0 - step(0.5, distance(rotateUv, vec2(0.5)));
  // // 3.螺旋渐变
  // float angle = atan(rotateUv.x-0.5, rotateUv.y-0.5);
  // float strength = (angle + 3.14) / 6.28;
  // gl_FragColor = vec4(strength, strength, strength, alpha);

  // 万花筒
  // // float angle = atan(vUv.x - 0.5, vUv.y - 0.5); //这里的范围是 0~2Π
  // // float strength = mod(angle * 10.0, 6.28);
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / PI; //这里的范围是 0~1
  // float strength = mod(angle * 10.0, 1.0);
  // gl_FragColor = vec4(strength, strength, strength, 1); 

  // 光芒四射
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
  // float strength = sin(angle * 100.0);
  // gl_FragColor = vec4(strength, strength, strength, 1); 


  // 
  // float strength = noise(vUv * 3.0);
  // gl_FragColor = vec4(strength, strength, strength, 1); 

  // float strength = step(0.5, noise(vUv * 10.0));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // // 
  // float strength = abs(noise(vUv * 10.0));
  // gl_FragColor = vec4(strength, strength, strength, 1);
  
  // float strength = step(uScale, cnoise(vUv * 10.0 + uTime));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 发光路径
  // float strength = 1.0 - abs(cnoise(vUv * 10.0));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 波纹效果
  // float strength = sin(cnoise(vUv * 10.0) * 5.0 + uTime * 10.0);
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 5.0 + uTime * 10.0));
  // gl_FragColor = vec4(strength, strength, strength, 1);

  // 使用混合函数混合颜色 1
  // vec3 backColor = vec3(1.0, 0.0, 1.0);
  // vec3 frontColor = vec3(1.0, 1.0, 1.0);
  // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  // vec3 mixColor = mix(backColor, frontColor, strength);
  // gl_FragColor = vec4(mixColor, 1);

  // 使用混合函数混合颜色 2
  vec3 backColor = vec3(1.0, 1.0, 1.0);
  vec3 frontColor = vec3(1.0, 1.0, 1.0);
  vec3 vuColor = vec3(vUv, 1.0);
  float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  vec3 mixColor = mix(backColor, vuColor, strength);
  gl_FragColor = vec4(mixColor, 1.0);

}