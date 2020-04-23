let changeReplace = function(str){
  var replaceStr = str.toString();
  const regBlank = new RegExp('<blank/>','gi');
  const reglongfill  = new RegExp('<longfill/>','gi');
  const regfill  = new RegExp('<fill/>','gi');
  const regcloze  = new RegExp('<cloze/>','gi');

  if(replaceStr.indexOf('<blank/>')>=0){ 
    replaceStr = replaceStr.replace(regBlank,'')
  }else if(replaceStr.indexOf('<fill>')>=0){
    replaceStr = replaceStr.replace(/<fill>/g,'<img src="/images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<longFill/>')>=0){
    replaceStr = replaceStr.replace(/<longFill>/g, '<img src="/images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<longfill/>')>=0){
    replaceStr = replaceStr.replace(reglongfill, '<img src="/images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<fill/>')>=0){
    replaceStr = replaceStr.replace(regfill, '')
  }else if(replaceStr.indexOf('<longfill>')>=0){
    replaceStr = replaceStr.replace(/<longfill>/g, '<img src="/images/line.png" class="fillImg">')
  }else if(replaceStr.indexOf('<cloze/>')>=0){
    replaceStr = replaceStr.replace(regcloze, '')
  }
  return replaceStr
}
module.exports = {
  changeReplace:changeReplace
}