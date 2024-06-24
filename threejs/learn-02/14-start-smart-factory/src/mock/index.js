export default [
  {
    url: "/api/smartcity/info",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: {
          "iot": {
            "name": "接入IOT设备",
            "number": 3004,
            "unit": "台"
          },
          "test": {
            "name": "今日核酸采集量",
            "number": 1494,
            "unit": "人"
          },
          "power": {
            "name": "城市电力能耗",
            "number": 80.62,
            "unit": "兆瓦时"
          },
          "event": {
            "name": "未处理治安事件",
            "number": 4,
            "unit": "起"
          }
        }
      };
    }
  },
  {
    url: "/api/smartcity/list",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "ok",
        list: [
          {
            "name": "火警",
            "type": "重大事故，需派人支援",
            "position": {
              "x": 70,
              "y": 6
            }
          },
          {
            "name": "治安",
            "type": "出现事故，需紧急处理",
            "position": {
              "x": 0,
              "y": 79
            }
          },
          {
            "name": "电力",
            "type": "出现事故，需紧急处理",
            "position": {
              "x": 12,
              "y": 4
            }
          },
          {
            "name": "火警",
            "type": "重大事故，需派人支援",
            "position": {
              "x": 65,
              "y": 35
            }
          }
        ]
      };
    }
  },
]