class EventBus {
  constructor() {
    this.events = {};
  }

  // 订阅
  on(event, callback) {
    console.log('订阅事件', this.events[event]);
    if (!this.events[event]) {
      this.events[event] = [];
    }
    console.log('订阅事件-1', this.events);

    this.events[event].push(callback);
    console.log('订阅事件-2', this.events);
  }

  // 发布
  emit(event, data) {
    const listeners = this.events[event];
    console.log('listeners', listeners[0], this.events);
    if (listeners) {
      listeners.forEach(fn => {
        console.log('调用回调函数', fn, data)
        fn(data)
      }
      );
    }
  }

  // 取消订阅
  off(event, callback) {
    this.events[event] =
      (this.events[event] || []).filter(fn => fn !== callback);
  }
}

const bus = new EventBus();

bus.on('login', user => {
  console.log('用户登录：', user);
});

bus.emit('login', { id: 1, name: '张三' });


