let changeReplace = function(str){
  if(str){
    var replaceStr = str.toString();
    replaceStr = replaceStr.replace("<cloze/>", "<cloze>")
    const regBlank = new RegExp('<blank/>','gi');
    const reglongfill  = new RegExp('<longfill/>','gi');
    const regfill  = new RegExp('<fill/>','gi');
    const regcloze  = new RegExp('<cloze/>','gi');
  
    if(replaceStr.indexOf('<blank/>')>=0){ 
      replaceStr = replaceStr.replace(regBlank,'')
    }else if(replaceStr.indexOf('<fill>')>=0){
      replaceStr = replaceStr.replace(/<fill>/g,'_____')
    }else if(replaceStr.indexOf('<longFill/>')>=0){
      replaceStr = replaceStr.replace(/<longFill>/g, '_____')
    }else if(replaceStr.indexOf('<longfill/>')>=0){
      replaceStr = replaceStr.replace(reglongfill, '_____')
    }else if(replaceStr.indexOf('<fill/>')>=0){
      replaceStr = replaceStr.replace(regfill, '')
    }else if(replaceStr.indexOf('<longfill>')>=0){
      replaceStr = replaceStr.replace(/<longfill>/g, '_____')
    }
    else if(replaceStr.indexOf('<cloze>')>=0){
      replaceStr = replaceStr.replace(/<cloze>/g, '<cloze style="width:35px;border-bottom:1px solid #333;display:inline-block;text-align:center;line-height: 18px;">')
    }
    // else if(replaceStr.indexOf('</cloze>')>=0){
    //   replaceStr = replaceStr.replace(regclozeit, '')
    // }
    return replaceStr
  }
}


let formatSeconds= function(value) {

      var theTime = parseInt(value);// 秒
      var middle= 0;// 分
      
      if(theTime > 60) {
          middle= parseInt(theTime/60);
          theTime = parseInt(theTime%60);
      }
      var result = parseInt(theTime)>9?parseInt(theTime):'0'+parseInt(theTime);
      if(middle > 9) {
        result = parseInt(middle)+":"+result;
      }else{
        result = '0'+parseInt(middle)+":"+result;
      }
      
      return result;
  }

module.exports = {
  changeReplace:changeReplace,
  formatSeconds:formatSeconds
}