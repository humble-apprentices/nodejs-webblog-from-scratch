// 解析上下文里node原生请求的POST参数
export function parsePostData( req ) {
  return new Promise((resolve, reject) => {
    try {
      let data = "";
      req.on('data', (chunk) => {
        data += chunk
      })
      req.on("end",function(){
        resolve(JSON.parse(data));
      })
    } catch ( err ) {
      reject(err)
    }
  })
}

// 将POST请求参数字符串解析成JSON
export function parseQueryStr(queryStr) {
  let queryData = {}
  let queryStrList = queryStr.split('&');
  queryStrList.forEach(item => {
    let itemList = item.split('=');
    queryData[itemList[0]] = decodeURIComponent(itemList[1] || '')
  })
  return queryData
}