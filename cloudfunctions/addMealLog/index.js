const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
    const db = cloud.database()
    try {
        const {
            userOpenId,
            mealType,
            content,
            imageFileIds,
            foodTags,
            mealDate,
            createTime
        } = event

        // 插入数据库
        const res = await db.collection('meal_logs').add({
            data: {
                user_openid: userOpenId,
                meal_type: mealType,
                content: content,
                images: imageFileIds || [],
                food_tags: foodTags || [],
                meal_date: mealDate,
                create_time: createTime
            }
        })

        // 返回添加成功后的数据，其中包含了新添加记录的 _id
        return {
            code: 200,
            msg: '饮食打卡成功',
            data: {
                _id: res._id, // 返回新增记录的 ID
                ...res // 可选：返回完整的 res 内容
            }
        }
    } catch (err) {
        console.error('打卡失败:', err)
        return {
            code: 500,
            msg: '服务器错误，打卡失败',
            error: err
        }
    }
}
