/* eslint-disable import/no-anonymous-default-export */
interface IFormatDate {
  format: (format: string) => string;
}

interface CustomDate {
  getFullYear: () => string;
  getFullMonth: () => string;
  getMonth: () => string;
  getFullDay: () => string;
  getDay: () => string;
  getFullTwelveHours: () => string;
  getTwelveHours: () => string;
  getFullHours: () => string;
  getHours: () => string;
  getFullMinutes: () => string;
  getMinutes: () => string;
  getFullSeconds: () => string;
  getSeconds: () => string;
}

/**
 * @name formatDate
 * @description 时间格式化函数，调用方式为formatDate(Date|timeStamp).format(formatString)
 * @description date参数支持Date对象跟timeStamp时间戳，非法时间戳会在调用formatDate的时候抛出异常
 * @param {Date|number} date
 * @return {IFormatDate}
 */
export function formatDate(date: Date | number = new Date()): IFormatDate {
  let _date;
  /* 转换时间戳为Date对象 */
  if (typeof date === 'number') {
    _date = new Date(date);
  } else {
    _date = date;
  }
  /* 判断是否为非法时间 */
  if (_date.toString() === 'Invalid Date') {
    throw new Error('invalid date：请检查传入时间或时间戳是否正确');
  }
  const format = ((date) => {
    /**
     * @name formatDate().format
     * @description 实例后提供的format函数，用于格式化时间
     * @param {string} format 支持参数：YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|ss|www|week|ww|星期|WW
     * @return {string}
     */
    return (format: string) => {
      /* 初始化周内数据 */
      let week = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        '星期天',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thur',
        'Fri',
        'Sat'
      ];
      /* 通过正则匹配处理格式化 */
      return format.replace(
        /YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|ss|www|week|ww|星期|WW/g,
        function (a: string): string {
          switch (a) {
            case 'YYYY':
              return String(date.getFullYear());
            case 'YY':
              return String(date.getFullYear()).slice(2);
            case 'MM':
              return getFullMonth(date);
            case 'M':
              return getMonth(date);
            case 'DD':
              return getFullDay(date);
            case 'D':
              return getDay(date);
            case 'HH':
              return getFullTwelveHours(date);
            case 'H':
              return getTwelveHours(date);
            case 'hh':
              return getFullHours(date);
            case 'h':
              return getHours(date);
            case 'mm':
              return getFullMinutes(date);
            case 'm':
              return getMinutes(date);
            case 'ss':
              return getFullSeconds(date);
            case 's':
              return getSeconds(date);
            case 'WW':
            case '星期':
              return week[date.getDay() + 7];
            case 'ww':
            case 'week':
              return week[date.getDay()];
            case 'www':
              return week[date.getDay() + 14];
            default:
              return a;
          }
        }
      );
    };
  })(_date);
  return {
    format: format
  };
}
/**
 * @name formatSeconds
 * @description 将传入秒数转换成计时器模式返回，支持【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】这六种模式，“：”间隔符可自定义
 * @param {number | string} seconds 传入秒数，支持数字跟数字字符串，超过3599999时按照3599999来转换
 * @param {string} format 格式化字符串，可不传，不传则默认为 hh:mm:ss，不到一小时则为mm:ss,支持【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】这六种模式，默认的“：”间隔符可自定义
 * @return {string}
 */
export function formatSeconds(
  seconds: number | string,
  format?: string
): string {
  let source: number;
  /* 转换字符串秒数为数字秒数 */
  if (typeof seconds !== 'number') {
    source = Number(seconds);
    /* 判断是否传入秒数的字符串是否合法 */
    if (isNaN(source))
      throw new Error(
        'invalid seconds parameter：请检查传入的时间秒数的格式是否正确'
      );
  } else {
    source = seconds;
  }
  /* 小于0的秒数，手动抛出异常，非法参数 */
  if (source < 0) {
    throw new Error('invalid second parameter: 传入的时间秒数不能小于0');
  }
  let _second: number = Math.floor(source % 60);
  let _minute: number = Math.floor(source / 60);
  let _hour = 0;
  if (!format) {
    if (_minute > 60) {
      _hour = Math.floor(_minute / 60);
      _minute = Math.floor(_minute % 60);
      return [_hour, _minute, _second].map((num) => padZero(num)).join(':');
    } else if (_minute > 0) {
      return [_minute, _second].map((num) => padZero(num)).join(':');
    } else {
      return [_second].map((num) => padZero(num)).join(':');
    }
  } else {
    return _formatSeconds({
      source,
      format,
      hour: _hour,
      minute: _minute,
      second: _second
    });
  }
}
function _formatSeconds({
  source,
  format,
  hour,
  minute,
  second
}: {
  source: number;
  format: string;
  hour: number;
  minute: number;
  second: number;
}): string {
  let _hour = hour;
  let _minute = minute;
  let _second = second;
  const matchRes: null | Array<string> = format.match(/hh|mm|ss/g);
  if (!matchRes || (Array.isArray(matchRes) && matchRes.length > 3)) {
    throw new Error(
      'invalid format parameter: format参数支持hh,mm,ss的唯一组合,即【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】'
    );
  }
  if (Array.isArray(matchRes)) {
    if (matchRes.indexOf('hh') > -1) {
      if (_minute > 60) {
        _hour = Math.floor(_minute / 60);
        _minute = Math.floor(_minute % 60);
      }
    }
    const joinStr: string = matchRes.join('');
    switch (matchRes.length) {
      case 1:
        if (joinStr === 'ss') return padZero(source);
        else if (joinStr === 'mm') return padZero(_minute);
        else if (joinStr === 'hh') return padZero(_hour);
        else
          throw new Error(
            'invalid format parameter: format参数支持hh,mm,ss的唯一组合,即【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】'
          );
      case 2:
        if (joinStr === 'mmss')
          return format
            .replace('mm', padZero(_minute))
            .replace('ss', padZero(_second));
        else if (joinStr === 'hhmm')
          return format
            .replace('hh', padZero(_hour))
            .replace('mm', padZero(_minute));
        else
          throw new Error(
            'invalid format parameter: format参数支持hh,mm,ss的唯一组合,即【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】'
          );
      case 3:
        if (joinStr === 'hhmmss')
          return format
            .replace('hh', padZero(_hour))
            .replace('mm', padZero(_minute))
            .replace('ss', padZero(_second));
        else
          throw new Error(
            'invalid format parameter: format参数支持hh,mm,ss的唯一组合,即【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】'
          );
      default:
        throw new Error(
          'invalid format parameter: format参数支持hh,mm,ss的唯一组合,即【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】'
        );
    }
  } else {
    throw new Error(
      'invalid format parameter: format参数支持hh,mm,ss的唯一组合,即【hh:mm:ss】【mm:ss】【hh:mm】【ss】【hh】【mm】'
    );
  }
}
/**
 * @name formatDateFromNow
 * @description 对比当前时间与传入时间的格式转换，传入时间不可大于当前时间
 * @param {Date｜ number} date  传入时间，支持时间戳跟Date对象
 * @return {*}
 */
export function formatDateFromNow(date: Date | number) {
  let _date;
  /* 转换时间戳为Date对象 */
  if (typeof date === 'number') {
    _date = new Date(date);
  } else {
    _date = date;
  }
  /* 判断是否为非法时间 */
  if (_date.toString() === 'Invalid Date') {
    throw new Error('invalid date parameter：请检查传入时间或时间戳是否正确');
  }
  let now = new Date().getTime();
  let dateTimeStamp = _date.getTime();
  let result;
  let zeroDate: number = new Date(new Date().setHours(0, 0, 0, 0)).getTime(); // 获取凌晨的时间戳
  let zeroYear: number = new Date(
    new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0)
  ).getTime(); // 获取年初的时间戳
  const standard = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000
  };
  let diffValue = now - dateTimeStamp;

  if (diffValue < 0) {
    throw new Error('invalid date parameter：传入的时间大于当前时间，无法转换');
  }
  let hourC = diffValue / standard.hour;
  let minC = diffValue / standard.minute;
  /* 判断传入时间是否小于今天凌晨00:00:00 */
  if (dateTimeStamp < zeroDate) {
    /* 判断传入时间是否大于昨天凌晨00:00:00 */
    if (dateTimeStamp > zeroDate - standard.day) {
      result = '昨天' + formatDate(date).format('hh:mm');
    } else {
      /* 判断传入时间是否小于今年年初的时间 */
      if (dateTimeStamp < zeroYear) {
        result = formatDate(date).format('YYYY-MM-DD hh:mm');
      } else {
        result = formatDate(date).format('MM-DD hh:mm');
      }
    }
    /* 判断传入时间是否在当前的一小时以前 */
  } else if (hourC >= 1) {
    result = '今天' + formatDate(date).format('hh:mm'); // 今天
    /* 判断传入时间是否在当前时间的一分钟以前 */
  } else if (minC >= 1) {
    result = parseInt(String(minC), 10) + '分钟前';
    /* 判断传入时间是否在当前时间的一分钟以内 */
  } else {
    result = '刚刚';
  }
  return result;
}
/**
 * @name padZero
 * @description 用于数字补零，并且转换成字符串
 * @param {number} value
 * @return {string}
 */
export function padZero(value: number): string {
  return value > 9 ? String(value) : '0' + value;
}
export function format(date: Date = new Date()): CustomDate {
  return {
    getFullYear: function (): string {
      return getFullYear(date);
    },
    getFullMonth: function (): string {
      return getFullMonth(date);
    },
    getMonth: function (): string {
      return getMonth(date);
    },
    getFullDay: function (): string {
      return getFullDay(date);
    },
    getDay: function (): string {
      return getDay(date);
    },
    getFullTwelveHours: function (): string {
      return getFullTwelveHours(date);
    },
    getTwelveHours: function (): string {
      return getTwelveHours(date);
    },
    getFullHours: function (): string {
      return getFullHours(date);
    },
    getHours: function (): string {
      return getHours(date);
    },
    getFullMinutes: function (): string {
      return getFullMinutes(date);
    },
    getMinutes: function (): string {
      return getMinutes(date);
    },
    getFullSeconds: function (): string {
      return getFullSeconds(date);
    },
    getSeconds: function (): string {
      return getSeconds(date);
    }
  };
}
/**
 * @name getFullYear
 * @description 用于获取传入时间的年份
 * @param {Date} date
 * @return {string}
 */
function getFullYear(date: Date = new Date()): string {
  return String(date.getFullYear());
}
/**
 * @name getFullMonth
 * @description 用于获取传入时间的补零后的月份，返回均为两位数的月份：01～12
 * @param {Date} date
 * @return {string}
 */
function getFullMonth(date: Date = new Date()): string {
  const month = date.getMonth() + 1;
  return month > 9 ? String(month) : '0' + month;
}
/**
 * @name getMonth
 * @description 用于获取传入时间的不补零后的月份：1～12
 * @param {Date} date
 * @return {string}
 */
function getMonth(date: Date = new Date()): string {
  return String(date.getMonth() + 1);
}
/**
 * @name getFullDay
 * @description 用于获取传入时间的补零后的日期，返回均为两位数的日期：01～31
 * @param {Date} date
 * @return {string}
 */
function getFullDay(date: Date = new Date()): string {
  const day = date.getDate();
  return day < 10 ? '0' + day : String(day);
}
/**
 * @name getDay
 * @description 用于获取传入时间的不补零后的日期：1～31
 * @param {Date} date
 * @return {string}
 */
function getDay(date: Date = new Date()): string {
  return String(date.getDate());
}
/**
 * @name getFullTwelveHours
 * @description 用于获取传入时间的带有上下午的补零后的十二进制的小时数，返回均为两位数的十二进制的小时：上/下午01～12
 * @param {Date} date
 * @return {string}
 */
function getFullTwelveHours(date: Date = new Date()): string {
  const hours = date.getHours();
  const twelveHours = hours > 12 ? hours - 12 : hours;
  return `${hours > 12 ? '下午' : '上午'}${
    twelveHours > 9 ? String(twelveHours) : '0' + twelveHours
  }`;
}
/**
 * @name getTwelveHours
 * @description 用于获取传入时间的带有上下午的不补零的十二进制的小时数：上/下午1～12
 * @param {Date} date
 * @return {string}
 */
function getTwelveHours(date: Date = new Date()): string {
  const hours = date.getHours();
  const twelveHours = hours > 12 ? hours - 12 : hours;
  return `${hours > 12 ? '下午' : '上午'}${String(twelveHours)}`;
}
/**
 * @name getFullHours
 * @description 用于获取传入时间的补零后的二十四小时制的小时数，返回均为两位数的小时：00～23
 * @param {Date} date
 * @return {string}
 */
function getFullHours(date: Date = new Date()): string {
  const hours = date.getHours();
  return hours > 9 ? String(hours) : '0' + hours;
}
/**
 * @name getHours
 * @description 用于获取传入时间的二十四小时制的小时数：0～23
 * @param {Date} date
 * @return {string}
 */
function getHours(date: Date = new Date()): string {
  return String(date.getHours());
}
/**
 * @name getFullMinutes
 * @description 用于获取传入时间的补零后的分钟数，返回均为两位数的分钟：00～59
 * @param {Date} date
 * @return {string}
 */
function getFullMinutes(date: Date = new Date()): string {
  const minutes = date.getMinutes();
  return minutes < 10 ? '0' + minutes : String(minutes);
}
/**
 * @name getMinutes
 * @description 用于获取传入时间的不补零的分钟数：0～59
 * @param {Date} date
 * @return {string}
 */
function getMinutes(date: Date = new Date()): string {
  return String(date.getMinutes());
}
/**
 * @name getFullSeconds
 * @description 用于获取传入时间的补零后的秒钟数，返回均为两位数的秒钟：00～59
 * @param {Date} date
 * @return {string}
 */
function getFullSeconds(date: Date = new Date()): string {
  const seconds = date.getSeconds();
  return seconds > 10 ? String(seconds) : '0' + seconds;
}
/**
 * @name getSeconds
 * @description 用于获取传入时间的不补零的秒钟数：0～59
 * @param {Date} date
 * @return {string}
 */
function getSeconds(date: Date = new Date()): string {
  return String(date.getSeconds());
}

/**
 * @name getLatestDate
 * @description 获取最近几天的日期
 * @param {times} number
 * @return {number}
 */
export function getLatestDate(times: number, rule?: string): string[] {
  const myDate = new Date(); //获取今天日期
  myDate.setDate(myDate.getDate() - times);
  const dateArray: string[] = [];
  for (var i = 0; i < times; i++) {
    dateArray.push(formatDate(myDate).format(rule || 'YYYY-MM-DD'));
    myDate.setDate(myDate.getDate() + 1);
  }
  return dateArray;
}

export default {
  formatDate,
  formatSeconds,
  formatDateFromNow,
  format,
  padZero,
};
