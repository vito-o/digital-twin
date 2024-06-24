import './style.css'
// ====================================================================
import { mat4, vec3 } from "gl-matrix";

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



// 创建立方体 数据
const cubeVertexArray = new Float32Array([
  // 顶点坐标， 颜色， 纹理坐标， （还可以加入法线数据）
   1, -1,  1,  1,   1, 0, 1, 1,   1, 1, 
  -1, -1,  1,  1,   0, 0, 1, 1,   0, 1, 
  -1, -1, -1,  1,   0, 0, 0, 1,   0, 0, 
   1, -1, -1,  1,   1, 0, 0, 1,   1, 0, 
   1, -1,  1,  1,   1, 0, 1, 1,   1, 1, 
  -1, -1, -1,  1,   0, 0, 0, 1,   0, 0,

  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 0, 1, 1, 0, 1, 1, -1, -1, 1, 1,
  0, 0, 1, 0, 0, 1, 1, -1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  -1, -1, 1, 1, 0, 0, 1, 0, 0,

  -1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, -1, 1, 1,
  1, 0, 1, 0, 0, -1, 1, -1, 1, 0, 1, 0, 1, 1, 0, -1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
  1, 1, -1, 1, 1, 1, 0, 1, 0, 0,

  -1, -1, 1, 1, 0, 0, 1, 1, 1, 1, -1, 1, 1, 1, 0, 1, 1, 1, 0, 1, -1, 1, -1, 1,
  0, 1, 0, 1, 0, 0, -1, -1, -1, 1, 0, 0, 0, 1, 1, 0, -1, -1, 1, 1, 0, 0, 1, 1,
  1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 0,

  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 0, 1, 1, 1, 0, 1, -1, -1, 1, 1, 0,
  0, 1, 1, 0, 0, -1, -1, 1, 1, 0, 0, 1, 1, 0, 0, 1, -1, 1, 1, 1, 0, 1, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,

  1, -1, -1, 1, 1, 0, 0, 1, 1, 1, -1, -1, -1, 1, 0, 0, 0, 1, 0, 1, -1, 1, -1, 1,
  0, 1, 0, 1, 0, 0, 1, 1, -1, 1, 1, 1, 0, 1, 1, 0, 1, -1, -1, 1, 1, 0, 0, 1, 1,
  1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 0,
])

// 立方体顶点尺寸
const cubeVertexSize = 10 * 4; // 这里的4 是数据字节长度是4
const cubePositionOffset = 0;  //这个数据中顶点位置数据的偏移为0
const cubeColorOffset = 4 * 4; //颜色的偏移位置为4
const cubeUVOffset = 8 * 4;    //uv的偏移位置为8
const cubeVertexCount = 36;    //顶点的数量为36个，一个面有6个顶点（两个三角形），六个面 为6 * 6 = 36；

// 创建立方体的顶点缓冲区
// 用于在 WebGPU 中创建一个顶点缓冲区, 用于存储立方体的顶点数据。顶点缓冲区是渲染过程中传递顶点数据给 GPU 的基本方式。
const verticesBuffer = device.createBuffer({
  size: cubeVertexArray.byteLength,
  // usage 指定了缓冲区的用途
  // 在这里，使用 GPUBufferUsage.VERTEX 表示这个缓冲区将用作顶点缓冲区。
  // 顶点缓冲区是用于存储顶点数据的缓冲区，在渲染过程中将数据传递给顶点着色器。
  usage: GPUBufferUsage.VERTEX,
  // 指定缓冲区在创建时是否映射到 CPU 地址空间。
  // 如果设置为 true，则在创建缓冲区后可以立即访问其内容并进行初始化操作。
  // 映射缓冲区允许在创建时直接将数据写入缓冲区，而不需要单独的映射操作。
  mappedAtCreation: true,
})
// 将顶点数据写入缓冲区
// 使用 getMappedRange 方法获取映射范围，然后将顶点数据写入映射的缓冲区。
new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray)
// 解除映射
// 调用 unmap 方法解除缓冲区的映射，以便 GPU 可以访问缓冲区数据。
/**
 * 缓冲区映射的含义：

    当一个缓冲区被映射时，意味着该缓冲区的内存区域被暴露给 CPU，以便 CPU 可以直接读写缓冲区的数据。
    这是通过 mappedAtCreation: true 或者通过显式调用 mapAsync 方法实现的

 * CPU 和 GPU 之间的内存同步：
    GPU 和 CPU 通常是并行运行的独立处理器，它们访问内存的方式和时机不同。
    当缓冲区被映射到 CPU 时，GPU 暂时无法访问这个缓冲区，以避免 CPU 和 GPU 同时访问缓冲区时可能出现的数据一致性问题。
    解除映射操作 (unmap) 是一种同步机制，确保 CPU 完成了对缓冲区数据的写入操作，并且数据已经准备好，可以让 GPU 访问。
 */
verticesBuffer.unmap();

// wgsl着色器
let vertWGSL = /*GLSL*/`

  struct Uniforms {
    modelViewProjectionMatrix: mat4x4<f32>,
  }

  @binding(0) @group(0) var<uniform> uniforms: Uniforms;

  // 输出顶点的数据
  struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  }

  @vertex
  fn main(
    @location(0) position: vec4<f32>,
    @location(1) uv: vec2<f32>,
  ) -> VertexOutput {
    var output: VertexOutput;
    output.position = uniforms.modelViewProjectionMatrix * position;
    output.fragUV = uv;
    output.fragPosition = (position+vec4(1.0,1.0,1.0,1.0))*0.5;
    return output;
  }

`;

let fragWGSL = `
  @group(0) @binding(1) var mySampler: sampler;
  @group(0) @binding(2) var myTexture: texture_external;

  @fragment
  fn main(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  ) -> @location(0) vec4<f32> {
    return textureSampleBaseClampToEdge(myTexture, mySampler, fragUV);
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
    entryPoint: 'main',
    // buffers
    buffers: [
      {
        arrayStride: cubeVertexSize,
        attributes: [
          {
            // 顶点位置
            shaderLocation: 0,
            offset: cubePositionOffset,
            format: "float32x4",
          },
          {
            // 顶点uv
            shaderLocation: 1,
            offset: cubeUVOffset,
            format: "float32x2",
          },
        ]
      }
    ]
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
  },
  depthStencil: {
    depthWriteEnabled: true,
    depthCompare: "less",
    format: "depth24plus",
  }
})

const depthTexture = device.createTexture({
  size: [canvas.width, canvas.height],
  // 4倍抗锯齿，多重采样提高图像质量，降低性能
  sampleCount: 4,
  format: "depth24plus",
  // 纹理用途，最终渲染到这个纹理上
  usage: GPUTextureUsage.RENDER_ATTACHMENT,
})

// matrix4*4 f32->4*8
const uniformBufferSize = 4 * 16;
const uniformBuffer = device.createBuffer({
  size: uniformBufferSize,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
})

/* const uniformBindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [
    {
      binding: 0,
      resource: {
        buffer: uniformBuffer,
      },
    },
  ],
}) */


// 相机宽高比例
const aspect = canvas.width / canvas.height
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, aspect, 0.1, 100.0);

function getTransformationMatrix() {
  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -8));
  const now = Date.now() / 1000;
  // 旋转
  mat4.rotate(viewMatrix, viewMatrix, now, vec3.fromValues(1, 1, 1));
  const modelViewProjectionMatrix = mat4.create();
  mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);
  return modelViewProjectionMatrix;
}


const texture = device.createTexture({
  size: [canvas.width, canvas.height],
  // 4倍抗锯齿，多重采样提高图像质量，减低性能
  sampleCount: 4,
  format: format,
  // 纹理的用途，最终渲染到这个纹理上
  usage: GPUTextureUsage.RENDER_ATTACHMENT,
});
const view = texture.createView();



const image = new Image();
image.src = "../img/1.webp";
await image.decode();
const imageBitmap = await createImageBitmap(image);


// 视频加载
const video = document.createElement("video");
video.src = "../mp4/cxk.mp4";
video.muted = true;
video.loop = true;
video.autoplay = true;
await video.play();


const cubeTexture = device.createTexture({
  size: [imageBitmap.width, imageBitmap.height, 1],
  format: "rgba8unorm",
  usage:
    GPUTextureUsage.TEXTURE_BINDING |
    GPUTextureUsage.COPY_DST |
    GPUTextureUsage.RENDER_ATTACHMENT,
});
device.queue.copyExternalImageToTexture(
  { source: imageBitmap },
  { texture: cubeTexture },
  [imageBitmap.width, imageBitmap.height]
);

// 创建采样器
const sampler = device.createSampler({
  magFilter: "linear",
  minFilter: "linear",
});



// 渲染函数
function render() {

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
      {
        binding: 1,
        resource: sampler,
      },
      {
        binding: 2,
        resource: device.importExternalTexture({
          source: video,
        }),
      },
    ],
  });

  let modelViewProjectionMatrix = getTransformationMatrix();
  device.queue.writeBuffer(
    uniformBuffer,
    0,
    modelViewProjectionMatrix.buffer,
    modelViewProjectionMatrix.byteOffset,
    modelViewProjectionMatrix.byteLength
  ) 

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
    ],
    // 深度附件
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  })
  // 设置渲染管线
  // 设置渲染管线，定义了渲染过程中使用的着色器和固定功能状态。
  renderPass.setPipeline(pipeline)
  renderPass.setBindGroup(0, uniformBindGroup);
  renderPass.setVertexBuffer(0, verticesBuffer);

  // 绘制三角形， 绘制三个点，绘制一遍
  // 调用 draw 方法绘制图元
  renderPass.draw(cubeVertexCount, 1, 0, 0);
  // 结束渲染通道
  renderPass.end();
  // 提交命令
  // 调用 finish 方法结束命令编码，并将编码的命令提交到 GPU 队列执行。
  device.queue.submit([commandEncoder.finish()])
  // 结束命令编码

  if ("requestVideoFrameCallback" in video) {
    video.requestVideoFrameCallback(render);
  } else {
    requestAnimationFrame(render);
  }
}

requestAnimationFrame(render)