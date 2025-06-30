const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
    const db = cloud.database()
    try {
        // 获取最新一条打卡记录（按 create_time 字段倒序排列）
        const res = await db.collection('meal_logs')
            .orderBy('create_time', 'desc') // 按创建时间倒序排列
            .limit(1) // 限制只返回一条记录
            .get()

        if (res.data.length > 0) {
            return {
                code: 200,
                msg: '获取成功',
                data: res.data[0] // 返回最新的那条记录
            }
        } else {
            return {
                code: 404,
                msg: '没有找到打卡记录',
                data: null
            }
        }
    } catch (err) {
        console.error('获取最新打卡记录失败:', err)
        return {
            code: 500,
            msg: '服务器错误，获取失败',
            error: err
        }
    }
}
