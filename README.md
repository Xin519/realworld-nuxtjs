## 一、简答题
### 1、请简述 Vue 首次渲染的过程。

1.  对 Vue 构造函数进行初始化，挂载实例成员和静态成员
2.  初始化结束，调用Vue的构造函数 new Vue()
3.  在构造函数中，调用 _init()，相当于整个Vue的入口
4.  在 _init 方法中最终调用了入口文件entry-runtime-with-compiler.js的 $mount()，把 template 模板编译成 render 函数
    1.  判断是否传入了 render 选项，如果没有传入，会去获取 templiate 选项，如果 template 中也没有，会把 el 中的内容作为模板
    2.  通过 compileToFunctions() 把模板编译成 render 函数
    3.  把 render 函数存到 options.render
5.    调用 platforms/web/runtime/index.js 中的 $mount()
    1.  如果是运行时版本，重新获取 el（运行时版本不会走入口文件获取 el ）
6.  调用 core/instance/lifecycle.js 文件中定义的 mountComponent(this, el)
    1.  如果是开发环境，判断是否有 render 选项，如果传入模板且没有设置 render 选项则发送警告（运行时版本，没有传入 render，传入模板会告诉我们运行时版本不支持编译器）
    2.  触发生命周期的 beforeMount 钩子函数（开始挂载之前）
    3.  定义 updateComponent()
        1.  调用 vm._render 和 vm._update
        2.  vm._render 的作用是生成虚拟DOM（用户传入的或编译生成的 render）
        3.  vm._update 的作用是将虚拟DOM转换成真实DOM，并且挂载到页面上（调用 __patch__ 方法，记录 vm.$el）
7.  创建 Watcher 实例
    1.  传递了 updateComponent 这个函数，最终在 Watcher 内部调用
    2.  调用 get() 方法，get() 方法中调用 updaraComponent()
8.  触发生命周期的 mounted 钩子函数（挂载结束）
9.  返回Vue实例 return vm

### 2、请简述 Vue 响应式原理。  

1.  Vue的响应式是从Vue的实例init()方法中开始的，在init()方法中先调用initState()初始化Vue实例的状态，在initState方法中调用了initData()， initData()是把data属性注入到Vue实例上，并且调用observe(data)将data对象转化成响应式的对象。
2.  observe是响应式的入口, 在observe(value)中，首先判断传入的参数value是否是对象，如果不是对象直接返回。再判断value对象是否有__ob__这个属性，如果有说明做过了响应式处理，则直接返回，如果没有，创建observer对象，并且返回observer`对象。
3.  在创建observer对象时，给当前的value对象定义不可枚举的__ob__属性，记录当前的observer对象，然后再进行数组的响应式处理和对象的响应式处理，数组的响应式处理就是拦截数组的几个特殊的方法，push、pop、shift等，然后找到数组对象中的__ob__对象中的dep,调用dep的notify()方法，再遍历数组中每一个成员，对每个成员调用observer()，如果这个成员是对象的话，也会转换成响应式对象。对象的响应式处理，就是调用walk方法，walk方法就是遍历对象的每一个属性，对每个属性调用defineReactive方法
4.  defineReactive会为每一个属性创建对应的dep对象，让dep去收集依赖，如果当前属性的值是对象，会调用observe。defineReactive中最核心的方法是getter 和 setter。getter 的作用是收集依赖，收集依赖时, 为每一个属性收集依赖，如果这个属性的值是对象，那也要为子对象收集依赖，最后返回属性的值。在setter 中，先保存新值，如果新值是对象，也要调用 observe ，把新设置的对象也转换成响应式的对象,然后派发更新（发送通知），调用dep.notify()
5.  收集依赖时，在watcher对象的get方法中调用pushTarget,记录Dep.target属性，访问data中的成员的时候收集依赖，defineReactive的getter中收集依赖，把属性对应的 watcher 对象添加到dep的subs数组中，给childOb收集依赖，目的是子对象添加和删除成员时发送通知。
6.  在数据发生变化的时候，会调用dep.notify()发送通知，dep.notify()会调用watcher对象的update()方法，update()中的调用的queueWatcher()会去判断watcher是否被处理，如果这个watcher对象没有的话添加到queue队列中，并调用flushScheduleQueue()，flushScheduleQueue()触发beforeUpdate钩子函数调用watcher.run()：run()-->get() --> getter() --> updateComponent()
7.  然后清空上一次的依赖
8.  触发actived的钩子函数
9.  触发updated钩子函数

### 3、请简述虚拟 DOM 中 Key 的作用和好处。

v-for遍历的时候，追踪列表中哪些元素被添加、被修改、被移除的辅助标志。可以快速对比两个虚拟DOM对象，找到虚拟DOM对象被修改的元素，然后仅仅替换掉被修改的元素，然后再生成新的真实DOM ，方便在diff过程中找到对应的节点，然后复用，从而减少dom的操作。

### 4、请简述 Vue 中模板编译的过程。

1.  模版编译入口函数compileToFunctions
    1.  内部首先从缓存加载编译好的render函数
    2.  如果缓存中没有，调用compile开始编译
2.  在 compile 函数中
    1.  首先合并选项options
    2.  调用 baseCompile 编译模版
3.  compile的核心是合并选项options， 真正处理是在basCompile中完成的，把模版和合并好的选项传递给baseCompile, 这里面完成了模版编译的核心三件事情
    1.  parse() 把模版字符串转化为AST 对象，也就是抽象语法树
    2.  optimize() 
        1.  对抽象语法树进行优化，标记静态语法树中的所以静态根节点
        2.  检测到静态子树，设置为静态，不需要在每次重新渲染的时候重新生成节点
        3.  patch的过程中会跳过静态根节点
    3.  generator() 把优化过的AST对象，转化为字符串形式的代码
4.  执行完成之后，会回到入口函数complieToFunctions
    1.  compileToFunction会继续把字符串代码转化为函数
    2.  调用createFunction
    3.  当 render 和 staticRenderFns初始化完毕，最终会挂在到Vue实例的options对应的属性中























