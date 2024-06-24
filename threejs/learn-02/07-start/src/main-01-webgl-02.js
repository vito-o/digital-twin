import '../style.css'


// 获取canvas
let canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// 获取webgl上下文
let ctx = canvas.getContext('webgl')

// 第一次创建webgl绘图上下文，需要设置视口大小
ctx.viewport(0, 0, canvas.width, canvas.height)

// ---------------------------------------------------------
// 创建顶点着色器
let vertexShader = ctx.createShader(ctx.VERTEX_SHADER)
// 创建顶点着色器的源码，需要编写glsl代码
ctx.shaderSource(vertexShader, `
  attribute vec4 a_Position;
  uniform mat4 u_Mat;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_Mat * a_Position;
    v_Color = gl_Position;
  }
`)
// 编译顶点着色器
ctx.compileShader(vertexShader)
// ---------------------------------------------------------
// 
// ---------------------------------------------------------
// 创建片元着色器
let fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER)
// 创建片元着色器源码，需要编写glsl代码
// --vec4(1.0, 0.0, 0.0, 1.0) 指代  (r, g, b, a) png图片的四个值
ctx.shaderSource(fragmentShader, `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`)
// 编译片元着色器
ctx.compileShader(fragmentShader)
// ---------------------------------------------------------

// 创建程序去连接顶点着色器和片元着色器
let program = ctx.createProgram()
// 连接顶点和片元着色器
ctx.attachShader(program, vertexShader)
ctx.attachShader(program, fragmentShader)
// 连接程序
ctx.linkProgram(program)
// 使用程序进行渲染
ctx.useProgram(program)



// 创建顶点缓冲区对象
let vertexBuffer = ctx.createBuffer()
// 绑定顶点缓冲区对象
ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer)
// 向顶点缓冲区对象写入数据
let vertices = new Float32Array([
  0.0, 0.5,
  -0.5, -0.5,
  0.5, -0.5
])
// ctx.STATIC_DRAW表示数据不会改变，ctx.DYNAMIC_DRAW表示数据会改变
ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.STATIC_DRAW)
// 获取顶点着色器中的a_Position变量的位置
let a_Position = ctx.getAttribLocation(program, 'a_Position')
// 将顶点缓冲区对象分配给a_Position变量
// 告诉openGL如何解析顶点数据
ctx.vertexAttribPointer(a_Position, 2, ctx.FLOAT, false, 0, 0)
// 启用顶点着色器中的a_Position变量
ctx.enableVertexAttribArray(a_Position)



const scale = {
  x: 0.5,
  y: 0.5,
  z: 0.5
}
/* 
// 缩小三角形
const mat = new Float32Array([
  scale.x, 0.0, 0.0, 0.0,
  0.0, scale.x, 0.0, 0.0,
  0.0, 0.0, scale.x, 0.0,
  0.0, 0.0, 0.0, 1.0, //最后这个1 是一个奇数  不用变
]) 

// 获取着色器程序的全局变量
const u_Mat = ctx.getUniformLocation(program, 'u_Mat')
ctx.uniformMatrix4fv(u_Mat, false, mat)

// 清除canvas
ctx.clearColor(0.0, 0.0, 0.0, 0.0)
// 清除颜色缓冲区的数据
ctx.clear(ctx.COLOR_BUFFER_BIT)

// 绘制三角形
ctx.drawArrays(ctx.TRIANGLES, 0, 3) */

function animate() {
  scale.x -= 0.01

  const mat = new Float32Array([
    scale.x, 0.0, 0.0, 0.0,
    0.0, scale.x, 0.0, 0.0,
    0.0, 0.0, scale.x, 0.0,
    0.0, 0.0, 0.0, 1.0, //最后这个1 是一个奇数  不用变
  ]) 
  // 获取着色器程序的全局变量
  const u_Mat = ctx.getUniformLocation(program, 'u_Mat')
  ctx.uniformMatrix4fv(u_Mat, false, mat)

  // 清除canvas
  ctx.clearColor(0.0, 0.0, 0.0, 0.0)
  // 清除颜色缓冲区的数据
  ctx.clear(ctx.COLOR_BUFFER_BIT)

  // 绘制三角形
  ctx.drawArrays(ctx.TRIANGLES, 0, 3)

  requestAnimationFrame(animate)
}

animate()