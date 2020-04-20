let changeReplace = function(str){
  var replaceStr = str.toString();
  if(replaceStr.indexOf('<blank/>')>=0){
    replaceStr = replaceStr.replace('/<blank/>/g','')
  }else if(replaceStr.indexOf('<fill>')>=0){
    replaceStr = replaceStr.replace('/<fill>/g', '<image src="../images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<longFill/>')>=0){
    replaceStr = replaceStr.replace('/<longFill/>/g', '<image src="../images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<longfill/>')>=0){
    replaceStr = replaceStr.replace('/<longfill/>/g', '<image src="../images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<fill/>')>=0){
    replaceStr = replaceStr.replace('/<fill/>/g', '<image src="../images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<longfill>')>=0){
    replaceStr = replaceStr.replace('/<longfill>/g', '<image src="../images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<cloze/>')>=0){
    replaceStr = replaceStr.replace('/<cloze/>/g', '')
  }
  return replaceStr
}
module.exports = {
  changeReplace:changeReplace
}