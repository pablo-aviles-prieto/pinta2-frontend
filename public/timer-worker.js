self.onmessage = function (e) {
  let time = e.data.count;
  console.log('time', time);
  if (e.data.startCounter) {
    setInterval(() => {
      time--;
      postMessage(time);
    }, 1000);
  }
};
