const {getWrongOnes, getAttribute, 
      getDuplicates, statusTrueFilter,
      getData, countByName,
      getInactiveUrlsFromArray,
      stringify, getGoodOnes} = require('./utils');

const url = process.argv[2];

let main = async () => {

  let data = await getData(url);
  console.log('Esta función realizará la validación de la data del servicio.')

  //Array List of Products and Tones Generation: (statusTrueProducts && statusTrueTones)
  const statusTrueProducts = data.filter(statusTrueFilter);
  const tones = statusTrueProducts.map(x=>getAttribute(x)('tones'))
                                  .map(x=>x.val)
                                  .filter(x=>x.length>0);
  const tones1array = [].concat.apply([], tones);
  const statusTrueTones = tones1array.filter(statusTrueFilter);


  //Products validations:
  const productsName = statusTrueProducts
                            .map(x=>getAttribute(x)('name'))
                            .map(x=>x.val.toUpperCase())
                            .sort();
  const productImages = statusTrueProducts.map(x=>getAttribute(x)('image'));
  const productDuplicate = getDuplicates(productsName)
                    .map((x)=>{return {'name':x,'count':countByName(x,productsName)}});
  const productSku = statusTrueProducts.map(x=>getAttribute(x)('sku'));
  const productCuv = statusTrueProducts.map(x=>getAttribute(x)('cuv'));

  //Tones validations:
  const toneImages = statusTrueTones.map(x=>getAttribute(x)('image'));
  const toneUrl = statusTrueTones.map(x=>getAttribute(x)('url'));
  const toneName = statusTrueTones.map(x=>getAttribute(x)('name'));
  const tonePriceNew = statusTrueTones.map(x=>getAttribute(x)('price_new'));
  const toneColorCode = statusTrueTones.map(x=>getAttribute(x)('color_code'));
  const toneColorImage = statusTrueTones.map(x=>getAttribute(x)('color_image'));
  const toneSku = statusTrueTones.map(x=>getAttribute(x)('sku'));
  const toneCuv = statusTrueTones.map(x=>getAttribute(x)('cuv'));

  //ColorCode and ColorImage Validation:
  const toneColorIds = [...toneColorCode.filter(getGoodOnes),
                        ...toneColorImage.filter(getGoodOnes)]
                              .map(x=>x.id);
  const overlapingToneColors = getDuplicates(toneColorIds)
                                  .map((x)=>{return {'id':x,
                                                    'colorCode':toneColorCode.filter(y=>y.id==x),
                                                    'colorImage': toneColorImage.filter(y=>y.id==x)}});

  console.log('\n\nValidaciones Generales:')
  console.log(`-> Se tiene ${productsName.length} productos`);
  console.log(`-> De los cuales solo ${statusTrueProducts.length} tiene como estado "true"`);
  console.log(`-> Solo ${tones.length} productos tienen tonos`);
  console.log(`-> Generando ${statusTrueTones.length} tonos en total con estado "true"`);


  console.log('\n\nValidaciones Producto:')
  console.log(`-> Con nombre duplicado:\t${productDuplicate.length}`);
  console.log(`-> Sin product image url:\t${productImages.filter(getWrongOnes).length}`);
  console.log(`-> Sin SKU:\t${productSku.filter(getWrongOnes).length}`);  
  console.log(`-> Sin CUV:\t${productCuv.filter(getWrongOnes).length}`);  


  console.log('\n\nValidaciones Producto->Tonos:')
  console.log(`-> Sin tone name:\t${toneName.filter(getWrongOnes).length}`);
  console.log(`-> Sin tone image:\t${toneImages.filter(getWrongOnes).length}`);
  console.log(`-> Sin tone url:\t${toneUrl.filter(getWrongOnes).length}`);
  console.log(`-> Sin tone price:\t${tonePriceNew.filter(getWrongOnes).length}`);
  console.log(`-> Sin tone colorCode:\t${toneColorCode.filter(getWrongOnes).length}`);
  console.log(`-> Sin tone colorImage:\t${toneColorImage.filter(getWrongOnes).length}`);
  console.log(`-> Ids repetidos entre colorCode y colorImage:\t${overlapingToneColors.length}`);
  console.log(`-> Sin tone SKU:\t${toneSku.filter(getWrongOnes).length}`);  
  console.log(`-> Sin tone CUV:\t${toneCuv.filter(getWrongOnes).length}`);  


  console.log(`\n\nValidación de URLS:`);
  console.log('-> Url Imagen Productos')
  const inactiveImgProducts = await getInactiveUrlsFromArray(productImages.filter(getGoodOnes),'image');
  console.log(`-> -> cantidad de urls inactivas:\t${inactiveImgProducts.length}`);
  console.log('-> Url Imagen Tonos')
  const inactiveImgTones = await getInactiveUrlsFromArray(toneImages.filter(getGoodOnes),'image');
  console.log(`-> -> cantidad de urls inactivas:\t${inactiveImgTones.length}`);
  console.log('-> Url Ecommerce Tonos')
  const inactiveUrlTones = await getInactiveUrlsFromArray(toneUrl.filter(getGoodOnes),'html');
  console.log(`-> -> cantidad de urls inactivas:\t${inactiveUrlTones.length}`);


  console.log("\n\nMas detalles:")
  console.log("productDuplicate:" + stringify(productDuplicate));
  console.log("productImages:" + stringify(productImages.filter(getWrongOnes)));
  console.log("productSku:" + stringify(productSku.filter(getWrongOnes)));
  console.log("productCuv:" + stringify(productCuv.filter(getWrongOnes)));
  console.log("toneName:" + stringify(toneName.filter(getWrongOnes)));
  console.log("toneImages:" + stringify(toneImages.filter(getWrongOnes)));
  console.log("toneUrl:" + stringify(toneUrl.filter(getWrongOnes)));
  console.log("tonePriceNew:" + stringify(tonePriceNew.filter(getWrongOnes)));
  console.log("toneColor Image&Color Overlapping:" + stringify(overlapingToneColors));
  console.log("toneSku:" + stringify(toneSku.filter(getWrongOnes)));
  console.log("toneCuv:" + stringify(toneCuv.filter(getWrongOnes)));
  console.log("productUrlInactivas:" + stringify(inactiveImgProducts));
  console.log("tonesUrlInactivas:" + stringify(inactiveImgTones));
  console.log("tonesUrlInactivas:" + stringify(inactiveUrlTones));
  

}

main();
  

  
