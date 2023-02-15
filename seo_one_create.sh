
configPath="./seo_config/all_seo_cfg.sh"
echo "input config name : $1"

if [ ${#1} -gt 0 ]
then
  # configFile="./seo_config/$1.sh" 
  configFile=$1 
  if [ -f "$configFile" ]
  then
    configPath=$configFile
  else
    echo "不存在配置文件: $configFile"
    exit
  fi
fi

echo "start import params"
. $configPath

tempChain_Common_1="$(echo $Chain_Common_1 | tr '[:upper:]' '[:lower:]')"
tempChain_Common_2="$(echo $Chain_Common_2 | tr '[:upper:]' '[:lower:]')"
tempTokenTicker="$(echo $TokenTicker | tr '[:upper:]' '[:lower:]')"

seoPath="${Chain_Common_1}-${Chain_Common_2}"
chainCodePath="./seo_config/all_code"
chainTokenCodePath="./seo_config/all_code/token"
# stepImgPath="./seo_config/all_code/img"
stepImgPath="./seo_config/${stepImgName}"

echo "start make ${seoPath} page"

rm -rf public/bridge/"$seoPath"
mkdir public/bridge/"$seoPath"
mkdir public/bridge/"$seoPath"/img

cp $chainCodePath/$indexType/*.html ./public/bridge/"$seoPath"
# cp $chainCodePath/*.css ./public/bridge/$seoPath
cp $stepImgPath/*.png ./public/bridge/"$seoPath"/img

cd ./public/bridge/"$seoPath"


#replace token
sed -i'' -e "s/%TokenFull/${TokenFull}/g" ./index.html
sed -i'' -e "s/m%TokenTickerm/${tempTokenTicker}/g" ./index.html  
if [ ${TokenFull} == ${TokenTicker} ]
then
  sed -i'' -e "s/(%TokenTicker%)//g" ./index.html
else
  sed -i'' -e "s/(%TokenTicker%)/(${TokenTicker})/g" ./index.html
fi
sed -i'' -e "s/%TokenTicker/${TokenTicker}/g" ./index.html
if [ ${#BridgedTokenTicker} -gt 0 ]
then
  sed -i'' -e "s/(%BridgedTokenTicker)/(${BridgedTokenTicker})/g" ./index.html
else
  sed -i'' -e "s/(%BridgedTokenTicker)//g" ./index.html
fi

sed -i'' -e "s/(%TokenAKA_1)/${TokenAKA_1}/g" ./index.html
sed -i'' -e "s/%TokenAKA_1/${TokenAKA_1}/g" ./index.html
# sed -i'' -e "s// %TokenAKA_2/${TokenAKA_2}/g" ./index.html
sed -i'' -e "s/%TokenAKA_2/${TokenAKA_2}/g" ./index.html
sed -i'' -e "s|%Token_Icon|${Token_Icon}|g" ./index.html
sed -i'' -e "s/%TokenInfo_AssetFullName/${TokenInfo_AssetFullName}/g" ./index.html
sed -i'' -e "s/%TokenInfo_TradingSymbol/${TokenInfo_TradingSymbol}/g" ./index.html
sed -i'' -e "s/%TokenInfo_PriceSymbol/${TokenInfo_PriceSymbol}/g" ./index.html
sed -i'' -e "s|%TokenInfo_TradingIcon|${TokenInfo_TradingIcon}|g" ./index.html
sed -i'' -e "s/%TokenInfo_PriceUSD/${TokenInfo_PriceUSD}/g" ./index.html
sed -i'' -e "s|%TokenInfo_PriceLink|${TokenInfo_PriceLink}|g" ./index.html
sed -i'' -e "s|%TokenInfo_Description1|${TokenInfo_Description1}|g" ./index.html

#replace chain1
sed -i'' -e "s/%Chain_Full_1/${Chain_Full_1}/g" ./index.html 
sed -i'' -e "s/m%Chain_Common_1m/${tempChain_Common_1}/g" ./index.html 
sed -i'' -e "s/%Chain_Common_1/${Chain_Common_1}/g" ./index.html 
sed -i'' -e "s/%Chain_cBridge_1/${Chain_cBridge_1}/g" ./index.html 
sed -i'' -e "s/%Chain_Info1_ChainId/${Chain_Info1_ChainId}/g" ./index.html 
sed -i'' -e "s/%Chain_Info1_Description/${Chain_Info1_Description}/g" ./index.html 
sed -i'' -e "s/%Chain_Info1_TokenFull/${Chain_Info1_TokenFull}/g" ./index.html 
if [ ${Chain_Info1_TokenFull} == ${Chain_Info1_TokenTicker} ]
then
  sed -i'' -e "s/(%Chain_Info1_TokenTicker%)//g" ./index.html
else
  sed -i'' -e "s/(%Chain_Info1_TokenTicker%)/(${Chain_Info1_TokenTicker})/g" ./index.html
fi
sed -i'' -e "s/%Chain_Info1_TokenTicker/${Chain_Info1_TokenTicker}/g" ./index.html
sed -i'' -e "s/(%Chain_Info1_BridgedTokenTicker)/${Chain_Info1_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_BridgedTokenTicker/${Chain_Info1_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_TokenAKA_1/${Chain_Info1_TokenAKA_1}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_TokenAKA_2/${Chain_Info1_TokenAKA_2}/g" ./index.html
sed -i'' -e "s|%Chain_Info1_Token_Icon|${Chain_Info1_Token_Icon}|g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_AssetFullName/${Chain_Info1_Token_AssetFullName}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_TradingSymbol/${Chain_Info1_Token_TradingSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_PriceSymbol/${Chain_Info1_Token_PriceSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_PriceUSD/${Chain_Info1_Token_PriceUSD}/g" ./index.html
sed -i'' -e "s|%Chain_Info1_Token_PriceLink|${Chain_Info1_Token_PriceLink}|g" ./index.html
sed -i'' -e "s|%Chain_Info1_Token_Description1|${Chain_Info1_Token_Description1}|g" ./index.html

#replace chain2
sed -i'' -e "s/%Chain_Full_2/${Chain_Full_2}/g" ./index.html 
sed -i'' -e "s/m%Chain_Common_2m/${tempChain_Common_2}/g" ./index.html 
sed -i'' -e "s/%Chain_Common_2/${Chain_Common_2}/g" ./index.html 
sed -i'' -e "s/%Chain_Common_the_2/${Chain_Common_the_2}/g" ./index.html 
sed -i'' -e "s/%Chain_cBridge_2/${Chain_cBridge_2}/g" ./index.html 
sed -i'' -e "s/%Chain_Info2_ChainId/${Chain_Info2_ChainId}/g" ./index.html 
sed -i'' -e "s/%Chain_Info2_Description/${Chain_Info2_Description}/g" ./index.html 
sed -i'' -e "s/%Chain_Info2_TokenFull/${Chain_Info2_TokenFull}/g" ./index.html 
if [ ${Chain_Info2_TokenFull} == ${Chain_Info2_TokenTicker} ]
then
  sed -i'' -e "s/(%Chain_Info2_TokenTicker%)//g" ./index.html
else
  sed -i'' -e "s/(%Chain_Info2_TokenTicker%)/(${Chain_Info2_TokenTicker})/g" ./index.html
fi
sed -i'' -e "s/%Chain_Info2_TokenTicker/${Chain_Info2_TokenTicker}/g" ./index.html
sed -i'' -e "s/(%Chain_Info2_BridgedTokenTicker)/${Chain_Info2_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_BridgedTokenTicker/${Chain_Info2_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_TokenAKA_1/${Chain_Info2_TokenAKA_1}/g" ./index.html
if [ ${#Chain_Info2_TokenAKA_2} -gt 0 ]
then
  sed -i'' -e "s/\/ %Chain_Info2_TokenAKA_2/\/${Chain_Info2_TokenAKA_2}/g" ./index.html
else
  sed -i'' -e "s/\/ %Chain_Info2_TokenAKA_2//g" ./index.html
fi

sed -i'' -e "s|%Chain_Info2_Token_Icon|${Chain_Info2_Token_Icon}|g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_AssetFullName/${Chain_Info2_Token_AssetFullName}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_TradingSymbol/${Chain_Info2_Token_TradingSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_PriceSymbol/${Chain_Info2_Token_PriceSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_PriceUSD/${Chain_Info2_Token_PriceUSD}/g" ./index.html
sed -i'' -e "s|%Chain_Info2_Token_PriceLink|${Chain_Info2_Token_PriceLink}|g" ./index.html
sed -i'' -e "s|%Chain_Info2_Token_Des1|${Chain_Info2_Token_Description1}|g" ./index.html
sed -i'' -e "s|%Chain_Info2_Token_Des1mmm||g" ./index.html

rm -rf index.html
mv index.html-e index.html


echo "start make ${seoPath}/${TokenTicker} page"

mkdir $TokenTicker
mkdir $TokenTicker/img
#back to seoPmake.sh
cd ../../../
cp $chainTokenCodePath/*.html ./public/bridge/"$seoPath"/$TokenTicker
# cp $chainTokenCodePath/*.css ./public/bridge/"$seoPath"/$TokenTicker
if [ ! -d "$stepImgPath/$TokenTicker/" ]
then
  cp $stepImgPath/*.png ./public/bridge/"$seoPath"/$TokenTicker/img
else
  cp $stepImgPath/$TokenTicker/*.png ./public/bridge/"$seoPath"/$TokenTicker/img
fi

cd ./public/bridge/"$seoPath"/$TokenTicker

#replace token
sed -i'' -e "s/%TokenFull/${TokenFull}/g" ./index.html 
sed -i'' -e "s/m%TokenTickerm/${tempTokenTicker}/g" ./index.html 
if [ ${TokenFull} == ${TokenTicker} ]
then
  sed -i'' -e "s/(%TokenTicker%)//g" ./index.html
else
  sed -i'' -e "s/(%TokenTicker%)/(${TokenTicker})/g" ./index.html
fi
sed -i'' -e "s/%TokenTicker/${TokenTicker}/g" ./index.html
if [ ${#BridgedTokenTicker} -gt 0 ]
then
  sed -i'' -e "s/(%BridgedTokenTicker)/(${BridgedTokenTicker})/g" ./index.html
else
  sed -i'' -e "s/(%BridgedTokenTicker)//g" ./index.html
fi

sed -i'' -e "s/(%TokenAKA_1)/${TokenAKA_1}/g" ./index.html
sed -i'' -e "s/%TokenAKA_1/${TokenAKA_1}/g" ./index.html
sed -i'' -e "s/%TokenAKA_2/${TokenAKA_2}/g" ./index.html
sed -i'' -e "s|%Token_Icon|${Token_Icon}|g" ./index.html
sed -i'' -e "s/%TokenInfo_AssetFullName/${TokenInfo_AssetFullName}/g" ./index.html
sed -i'' -e "s/%TokenInfo_TradingSymbol/${TokenInfo_TradingSymbol}/g" ./index.html
sed -i'' -e "s/%TokenInfo_PriceSymbol/${TokenInfo_PriceSymbol}/g" ./index.html
sed -i'' -e "s|%TokenInfo_TradingIcon|${TokenInfo_TradingIcon}|g" ./index.html
sed -i'' -e "s/%TokenInfo_PriceUSD/${TokenInfo_PriceUSD}/g" ./index.html
sed -i'' -e "s|%TokenInfo_PriceLink|${TokenInfo_PriceLink}|g" ./index.html
sed -i'' -e "s|%TokenInfo_Description1|${TokenInfo_Description1}|g" ./index.html

#replace chain1
sed -i'' -e "s/%Chain_Full_1/${Chain_Full_1}/g" ./index.html 
sed -i'' -e "s/m%Chain_Common_1m/${tempChain_Common_1}/g" ./index.html 
sed -i'' -e "s/%Chain_Common_1/${Chain_Common_1}/g" ./index.html 
sed -i'' -e "s/%Chain_cBridge_1/${Chain_cBridge_1}/g" ./index.html 
sed -i'' -e "s/%Chain_Info1_ChainId/${Chain_Info1_ChainId}/g" ./index.html 
sed -i'' -e "s/%Chain_Info1_Description/${Chain_Info1_Description}/g" ./index.html 
sed -i'' -e "s/%Chain_Info1_TokenFull/${Chain_Info1_TokenFull}/g" ./index.html 
if [ ${Chain_Info1_TokenFull} == ${Chain_Info1_TokenTicker} ]
then
  sed -i'' -e "s/(%Chain_Info1_TokenTicker%)//g" ./index.html
else
  sed -i'' -e "s/(%Chain_Info1_TokenTicker%)/(${Chain_Info1_TokenTicker})/g" ./index.html
fi
sed -i'' -e "s/%Chain_Info1_TokenTicker/${Chain_Info1_TokenTicker}/g" ./index.html
sed -i'' -e "s/(%Chain_Info1_BridgedTokenTicker)/${Chain_Info1_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_BridgedTokenTicker/${Chain_Info1_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_TokenAKA_1/${Chain_Info1_TokenAKA_1}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_TokenAKA_2/${Chain_Info1_TokenAKA_2}/g" ./index.html
sed -i'' -e "s|%Chain_Info1_Token_Icon|${Chain_Info1_Token_Icon}|g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_AssetFullName/${Chain_Info1_Token_AssetFullName}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_TradingSymbol/${Chain_Info1_Token_TradingSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_PriceSymbol/${Chain_Info1_Token_PriceSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info1_Token_PriceUSD/${Chain_Info1_Token_PriceUSD}/g" ./index.html
sed -i'' -e "s|%Chain_Info1_Token_PriceLink|${Chain_Info1_Token_PriceLink}|g" ./index.html
sed -i'' -e "s|%Chain_Info1_Token_Description1|${Chain_Info1_Token_Description1}|g" ./index.html

#replace chain2
sed -i'' -e "s/%Chain_Full_2/${Chain_Full_2}/g" ./index.html 
sed -i'' -e "s/m%Chain_Common_2m/${tempChain_Common_2}/g" ./index.html 
sed -i'' -e "s/%Chain_Common_2/${Chain_Common_2}/g" ./index.html 
sed -i'' -e "s/%Chain_Common_the_2/${Chain_Common_the_2}/g" ./index.html 
sed -i'' -e "s/%Chain_cBridge_2/${Chain_cBridge_2}/g" ./index.html 
sed -i'' -e "s/%Chain_Info2_ChainId/${Chain_Info2_ChainId}/g" ./index.html 
sed -i'' -e "s/%Chain_Info2_Description/${Chain_Info2_Description}/g" ./index.html 
sed -i'' -e "s/%Chain_Info2_TokenFull/${Chain_Info2_TokenFull}/g" ./index.html 
if [ ${Chain_Info2_TokenFull} == ${Chain_Info2_TokenTicker} ]
then
  sed -i'' -e "s/(%Chain_Info2_TokenTicker%)//g" ./index.html
else
  sed -i'' -e "s/(%Chain_Info2_TokenTicker%)/(${Chain_Info2_TokenTicker})/g" ./index.html
fi
sed -i'' -e "s/%Chain_Info2_TokenTicker/${Chain_Info2_TokenTicker}/g" ./index.html
sed -i'' -e "s/(%Chain_Info2_BridgedTokenTicker)/${Chain_Info2_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_BridgedTokenTicker/${Chain_Info2_BridgedTokenTicker}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_TokenAKA_1/${Chain_Info2_TokenAKA_1}/g" ./index.html
if [ ${#Chain_Info2_TokenAKA_2} -gt 0 ]
then
  sed -i'' -e "s/\/ %Chain_Info2_TokenAKA_2/\/${Chain_Info2_TokenAKA_2}/g" ./index.html
else
  sed -i'' -e "s/\/ %Chain_Info2_TokenAKA_2//g" ./index.html
fi
sed -i'' -e "s|%Chain_Info2_Token_Icon|${Chain_Info2_Token_Icon}|g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_AssetFullName/${Chain_Info2_Token_AssetFullName}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_TradingSymbol/${Chain_Info2_Token_TradingSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_PriceSymbol/${Chain_Info2_Token_PriceSymbol}/g" ./index.html
sed -i'' -e "s/%Chain_Info2_Token_PriceUSD/${Chain_Info2_Token_PriceUSD}/g" ./index.html
sed -i'' -e "s|%Chain_Info2_Token_PriceLink|${Chain_Info2_Token_PriceLink}|g" ./index.html
sed -i'' -e "s|%Chain_Info2_Token_Des1|${Chain_Info2_Token_Description1}|g" ./index.html

rm -rf index.html
mv index.html-e index.html

#back to seoPmake.sh
cd ../../../../

echo "end"



