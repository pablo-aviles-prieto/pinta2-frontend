self.onmessage = function (e) {
  let time = e.data.count;

  if (e.data.startCounter) {
    setInterval(() => {
      time--;
      postMessage(time);
    }, 1000);
  }
};
