const request = require('request');
const { exec } = require('child_process');
const _cliProgress = require('cli-progress');

const getData = async (url) => {
  return await new Promise((resolve, reject) => {
    request({
      "uri": url,
      "method": "GET"
    }, (err, res, body) => {
      if (!err) {
        let result = JSON.parse(res.body);
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

const getHeadersFromUrl = async (url) => {
  return await new Promise((resolve,reject) => {
    exec(`curl -X GET -I "${url}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        let h2 = [];

        stdout.split("\r\n").map((x,i)=>{
          if(i==0) {
            const tmp = x.split(" ");
            h2[tmp[0].toUpperCase().split('/')[0]] = tmp[1];
          } else {
            const tmp = x.split(":");
            h2[tmp[0].toUpperCase()] = tmp[1];
          }
        });
        resolve(h2)
      }
    });
  })
}

const isImageFromUrlAlive = async (url) => {
  let imgHeaders;

  try {
    imgHeaders = await getHeadersFromUrl(url);
  } catch (error) {
    console.log(error);
  }
  
  //if(!(imgHeaders['HTTP']=='200' && imgHeaders['CONTENT-TYPE'].indexOf("image") != -1))
  //  console.log(imgHeaders);

  return (imgHeaders['HTTP']=='200' && imgHeaders['CONTENT-TYPE'].indexOf("image") != -1)
}

const getInactiveUrlsFromImgArray = async (imgArray) => {
  const bar1 = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
  const cantidadDatos = imgArray.length;

  bar1.start(cantidadDatos, 0);

  let result = imgArray.map((x,i)=>{
    bar1.update(i);
    return isImageFromUrlAlive(x.val)
  })

  bar1.update(cantidadDatos);
  bar1.stop();

  result = await Promise.all(result);
  
  return imgArray.map((x,i)=>{ return {id: x.id, url: x.val, alive: result[i]} })
                .filter((x)=>{return x.alive == false});
              
}

const countByName = (name, array) => {
  let ids;
  return array.reduce((acc,x) => {
      return x==name?acc+1:acc},0)
}

const deleteDuplicates = (arr) => {
  return arr.filter((x,i)=>{return arr.indexOf(x)===i});
}

const getDuplicates = (arr,deleteFn = deleteDuplicates) => {
  const manyDuplicates = arr.filter((x,i)=>{return arr.indexOf(x)!==i});
  return deleteFn(manyDuplicates);
}

const getAttribute = (x) => (attb) => { return {id: x.id, val: x[attb]} }
const getWrongOnes = (x) => { 
  let result = true;
  x = x.val;
  if(typeof(x)=='string') {
    result = (x == undefined ||  x == null || x.trim() == "");
  } else if (typeof(x)=='number') {
    result = (x == undefined ||  x == null || x < 1);
  }
  
  return result;
}

const getGoodOnes = (x) => { 
  let result = true;
  x = x.val;
  if(typeof(x)=='string') {
    result = (x != undefined &&  x != null && x.trim() != "");
  } else if (typeof(x)=='number') {
    result = (x != undefined &&  x != null && x > 0);
  }
  
  return result;
}

const statusTrueFilter = (x) => { return x.status == true; }

const stringify = (x) => { return JSON.stringify(x,null,4) }

module.exports.getAttribute = getAttribute;
module.exports.getWrongOnes = getWrongOnes;
module.exports.getGoodOnes = getGoodOnes;
module.exports.getData = getData;
module.exports.countByName = countByName;
module.exports.deleteDuplicates = deleteDuplicates;
module.exports.getDuplicates = getDuplicates;
module.exports.statusTrueFilter = statusTrueFilter;
module.exports.getInactiveUrlsFromImgArray = getInactiveUrlsFromImgArray;
module.exports.stringify = stringify;

