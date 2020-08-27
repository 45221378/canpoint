let changeReplace = function (str) {
  if (str) {
    var replaceStr = str.toString();
    const regclose = new RegExp('<cloze/>', 'gi');
    replaceStr = replaceStr.replace(regclose, "<cloze>")
    const regBlank = new RegExp('<blank/>', 'gi');
    const reglongfill = new RegExp('<longfill/>', 'gi');
    const reglongFill = new RegExp('<longFill/>', 'gi');
    const regfill = new RegExp('<fill/>', 'gi');
    const regclass = new RegExp('class =', 'gi');
    const pointEnd = new RegExp('</point>', 'gi');
    const tdEnd = new RegExp('</td>', 'gi');
    const table = new RegExp('</tab>', 'gi');

    if (replaceStr.indexOf('<blank/>') >= 0) {
      replaceStr = replaceStr.replace(regBlank, '')
    }
    if (replaceStr.indexOf('<fill>') >= 0) {
      replaceStr = replaceStr.replace(/<fill>/g, '_____')
    }
    if (replaceStr.indexOf('<longFill/>') >= 0) {
      replaceStr = replaceStr.replace(reglongFill, '_________________')
    }
    if (replaceStr.indexOf('<longfill/>') >= 0) {
      replaceStr = replaceStr.replace(reglongfill, '_________________')
    }
    if (replaceStr.indexOf('<fill/>') >= 0) {
      replaceStr = replaceStr.replace(regfill, '')
    }
    if (replaceStr.indexOf('<longfill>') >= 0) {
      replaceStr = replaceStr.replace(/<longfill>/g, '_________________')
    }
    if (replaceStr.indexOf('<cloze>') >= 0) {
      let num = replaceStr.split('<cloze>');
      for (var i = 1; i <= num.length; i++) {
        replaceStr = replaceStr.replace(/<cloze>/, `<cloze style="width:100rpx;border-bottom:1px solid #333;display:inline-block;text-align:center;line-height: 18px;"> ( ${i} ) </cloze>`)
      }
    }
    if (replaceStr.indexOf('class =') >= 0) {
      replaceStr = replaceStr.replace(regclass, 'class=')
    }
    if (replaceStr.indexOf('<point2>') >= 0) {
      replaceStr = replaceStr.replace(/<point2>/g, '<point2 class="point2">')
    }
    if (replaceStr.indexOf('<point1>') >= 0) {
      replaceStr = replaceStr.replace(/<point1>/g, '<point1 class="point1">')
    }
    if (replaceStr.indexOf('<tab>') >= 0) {
      replaceStr = replaceStr.replace(/<tab>/g, '<span class="textIndent-tab">')
    }
    if (replaceStr.indexOf('</tab>') >= 0) {
      replaceStr = replaceStr.replace(table, '</span>')
    }
    if (replaceStr.indexOf('</point1>') >= 0) {
      replaceStr = replaceStr.replace(pointEnd, '</point1>')
    }
    if (replaceStr.indexOf('</point2>') >= 0) {
      replaceStr = replaceStr.replace(pointEnd, '</point2>')
    }
    if (replaceStr.indexOf('</td>') >= 0) {
      replaceStr = replaceStr.replace(tdEnd, '&nbsp;</td>')
    }
    return replaceStr
  }
}

let formatSeconds = function (value) {

  var theTime = parseInt(value);// 秒
  var middle = 0;// 分

  if (theTime > 60) {
    middle = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
  }
  var result = parseInt(theTime) > 9 ? parseInt(theTime) : '0' + parseInt(theTime);
  if (middle > 9) {
    result = parseInt(middle) + ":" + result;
  } else {
    result = '0' + parseInt(middle) + ":" + result;
  }

  return result;
}

module.exports = {
  changeReplace: changeReplace,
  formatSeconds: formatSeconds,

}