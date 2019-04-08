export const field = {
  init() {
    const w = '300';
    const h = '600';
    const fieldEl = document.getElementById('field');
    fieldEl.width = w;
    fieldEl.height = h;

    return {
      width: w,
      height: h
    };
  }
};

