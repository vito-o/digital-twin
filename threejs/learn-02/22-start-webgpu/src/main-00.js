import './style.css'
// ====================================================================

let canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

if (!navigator.gpu) {
  alert('当前浏览器不支持webGPU')
  throw new Error('当前浏览器不支持WebGPU')
}

// 获取webGPU的上下文
let context = canvas.getContext('webgpu')

// 请求一个可用的 GPU 适配器，以便在 WebGPU 上进行后续的操作
// 适配器是 GPU 的一个抽象表示，它提供了创建设备和查询硬件特性的能力
let adapter = await navigator.gpu.requestAdapter();

// 获取GPU的设备，用于分配资源
// 用于请求一个 GPU 设备 (GPUDevice)，这是在 WebGPU 中执行渲染和计算操作的主要接口
let device = await adapter.requestDevice();

// 获取最佳的画布格式，实现最佳的跨平台性能
let format = navigator.gpu.getPreferredCanvasFormat()
// console.log(format) // bgra8unorm

// 配置上下文
context.configure({
  device,
  // 获取画布首选的上下文格式
  format,
  // 设置不透明，不透明的画布可以提高性能， premultiplied，允许webGPU在渲染时预乘alpha通道
  alphaMode: 'opaque'
})

console.log(context)

// wgsl着色器
let vertWGSL = /*GLSL*/`

fn add(a:f32, b:f32) -> f32 {
  return a + b;
}

// 顶点着色器主函数
@vertex
fn main(
  @builtin(vertex_index) vertexIndex: u32,
) -> @builtin(position) vec4<f32> {
  // 设置三角形的顶点坐标
  // 如果类型没有指定，默认会根据当前赋值的内容进行推断
  var length = 0.5;
  // 屏幕的坐标范围是 x [-1, 1]  y: [-1, 1]
  var pos = array<vec2<f32>, 3>(
    vec2(0.0, add(length, 0.25)),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5),
  );
  // 返回顶点坐标
  return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
}
`;

let fragWGSL = `
@fragment
fn main() -> @location(0) vec4<f32> {
  return vec4(1.0, 0.0, 0.0, 1.0);
}
`

// 创建渲染管线
// 用于创建一个 WebGPU 渲染管道 (GPURenderPipeline)，它定义了如何将顶点数据转换为片元（像素）数据并渲染到帧缓冲区
let pipeline = device.createRenderPipeline({
  // 布局，用于着色器中资源的绑定，分配资源的布局
  layout: 'auto',
  // 顶点着色器
  vertex: {
    module: device.createShaderModule({
      code: vertWGSL
    }),
    // 入口函数
    entryPoint: 'main'
  },
  // 片元着色器
  fragment: {
    module: device.createShaderModule({
      code: fragWGSL
    }),
    // 入口函数
    entryPoint: 'main',
    // 输出颜色
    targets: [
      { 
        // 定义片段着色器的输出目标（颜色缓冲区），其中 format 指定了输出颜色的格式。
        format: format
      }
    ]
  },
  // 图元类型
  primitive: {
    // 指定图元的拓扑类型为三角形列表（triangle-list），表示每三个顶点组成一个独立的三角形
    topology: "triangle-list",
  },
  // multisample,多重采样
  multisample: {
    count: 4,
  }
})

const texture = device.createTexture({
  size: [canvas.width, canvas.height],
  // 4倍抗锯齿，多重采样提高图像质量，降低性能
  sampleCount: 4,
  format,
  // 纹理用途，最终渲染到这个纹理上
  usage: GPUTextureUsage.RENDER_ATTACHMENT,
})
const view = texture.createView();

// 渲染函数
function render() {
  // 开始命名编码
  // 开始渲染1个通道或者几个 -> 渲染状态 -> 通过渲染管线绘制图元 ->结束渲染通道
  // 创建一个命令编码器 (GPUCommandEncoder)，用于记录所有的渲染和计算指令
  let commandEncoder = device.createCommandEncoder();
  // 开始渲染通道
  let renderPass = commandEncoder.beginRenderPass({
    // 颜色附件数组
    // 定义了颜色附件，指定了渲染目标的纹理视图
    colorAttachments: [
      {
        // view: context.getCurrentTexture().createView(),
        view: view,
        resolveTarget: context.getCurrentTexture().createView(),
        // 定义了清除颜色值，即在渲染开始时清除屏幕为黑色（RGBA: 0, 0, 0, 1）
        clearValue: {
          r: 0.0,
          g: 0.0,
          b: 0.0,
          a: 1.0,
        },
        // 清除操作
        // 表示在开始渲染通道时清除附件
        loadOp: 'clear',
        // 保存操作
        // 表示在结束渲染通道时存储附件的内容
        storeOp: 'store'
      }
    ]
  })
  // 设置渲染管线
  // 设置渲染管线，定义了渲染过程中使用的着色器和固定功能状态。
  renderPass.setPipeline(pipeline)
  // 绘制三角形， 绘制三个点，绘制一遍
  // 调用 draw 方法绘制图元
  renderPass.draw(3, 1, 0, 0)
  // 结束渲染通道
  renderPass.end();
  // 提交命令
  // 调用 finish 方法结束命令编码，并将编码的命令提交到 GPU 队列执行。
  device.queue.submit([commandEncoder.finish()])
  // 结束命令编码

  requestAnimationFrame(render)
}

requestAnimationFrame(render)