/* 频道请求模块
*/
import request from '@/utils/request'

/* 获取所有频道列表
*/
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

/* 添加用户频道
*/
export const addUserChannel = channel => { // 声名一个参数接收 channel
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel] // 频道对象, 参数传到数组里面
    }
  })
}

/* 删除指定用户频道
*/
export const deleteUserChannel = channelId => { // 接口要让我们传个id进来 channelId
  return request({
    method: 'DELETE',
    // url: '/v1_0/user/channels/:target', :target意思是让我们传被删除的id进来，然后我们采用es6写法 url: `/v1_0/user/channels/${channelId}`
    url: `/v1_0/user/channels/${channelId}`
  })
}
