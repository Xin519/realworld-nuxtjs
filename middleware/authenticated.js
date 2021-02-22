// 验证是否登录中间件
export default function ({ store, redirect }) {
    // 如果没有user返回login页面
    if (!store.state.user) {
        return redirect('/login')
    }
}
