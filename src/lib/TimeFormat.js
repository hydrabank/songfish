// Code from this answer: https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
export default class TimeFormat {
    static formatLength(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        return [
          h,
          m > 9 ? m : (h ? '0' + m : m || '0'),
          s > 9 ? s : '0' + s
        ].filter(Boolean).join(':');
    };
};