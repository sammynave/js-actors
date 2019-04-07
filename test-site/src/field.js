export const field = {
  init() {
    const w = '300px';
    const h = '300px';
    const fieldEl = document.getElementById('field');
    fieldEl.style.width = w;
    fieldEl.style.height = h;

    return {
      width: w,
      height: h
    };
  }
};

