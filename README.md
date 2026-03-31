# AI-Health
## 前言：
1. 基于多模态大模型的AI营养师，能够实现膳食营养估计、膳食营养追踪记录、智能引导等功能。对用户的膳食记录进行总结，呈现每日总结和每周总结，方便用户了解自己的膳食摄入情况，并自动对用户进行画像总结。
2. 通过调用后端 API 实现用户输入响应与数据交互，完成每日/每周膳食总结模块。
3. 独立完成前端界面设计与页面跳转逻辑，使用云开发框架与云数据库
该小程序由我和另一位队友两人在队长提供基础小程序项目api调用的基础上合作共同完成。
## 技术栈：
- 前端	微信小程序原生开发  
- 云服务	微信云开发（云函数、云数据库）  
- AI 能力	多模态大模型 API（图像识别 + 对话生成）  
- 数据存储	云数据库（用户信息、膳食记录、总结数据）
## 项目结构
AI-Health/
AI-Health/
├── miniprogram/           # 小程序前端代码
│   ├── pages/             # 页面文件
│   │   ├── analysis/      # 分析每日每餐饮食
│   │   ├── chat/          # 与AI对话界面
│   │   ├── history/       # 打卡历史记录界面
│   │   ├── home/          # 用户主页
│   │   ├── index/         # 索引页
│   │   ├── jiyinshi/      # 记饮食主页
│   │   ├── login/         # 登录
│   │   ├── meallog/       # 打卡饮食界面
│   │   └── register/      # 注册
│   ├── components/        # 自定义组件
│   ├── utils/             # 工具函数（API 请求封装等）
│   └── app.js             # 小程序入口
│
├── cloudfunctions/        # 云函数
│   ├── addDialogue/       # 与AI对话
│   ├── addMealLog/        # 增加一条饮食记录
│   ├── deleteDialogue/    # 删除聊天记录
│   ├── getDialogue/       # 查询聊天记录
│   ├── getDialogues/      # 查询聊天对话
│   ├── getMealLog/       # 查询打卡记录
│   ├── getPeriodDialogue/ # 范围查询打卡记录
│   ├── login/             # 登录
│   └── register/          # 注册
│
└── README.md

![登录注册](https://github.com/user-attachments/assets/e15c20f2-4bbc-46aa-b319-d107909a4353)

![登录](https://github.com/user-attachments/assets/b7b54cb1-8f99-4f35-af4c-8d1ac037babd)

![注册](https://github.com/user-attachments/assets/744cf6a3-8cfd-401c-b26c-28e1e17a2108)

![主界面](https://github.com/user-attachments/assets/a837726c-807c-4aa1-ba19-7d745aa7892b)

![记饮食](https://github.com/user-attachments/assets/d498868b-8bbd-4f9c-94c2-8f726051e8db)

![上传饮食](https://github.com/user-attachments/assets/31635cfe-226e-4d88-8181-b14cefb80b36)

![个人界面](https://github.com/user-attachments/assets/24ce7a72-baab-48ce-a332-32a2666f2038)

