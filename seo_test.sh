#!/bin/bash
. ./seo_config/seo_Nervos_Ethereum.sh

echo "start work"

# echo "Chain_Common_1 start: ${Chain_Common_1}"
# typeset -l tempChain_Common_1
# tempChain_Common_1=${Chain_Common_1}
# echo "Chain_Common_1 end: ${Chain_Common_1}"
# echo "tempChain_Common_1 end: ${tempChain_Common_1}"

tempChain_Common_1="$(echo $Chain_Common_1 | tr '[:upper:]' '[:lower:]')"
echo $Chain_Common_1
echo $tempChain_Common_1
seoPath="${Chain_Common_1}-${Chain_Common_2}"
mkdir test/"$seoPath"
cd test/"$seoPath"
mkdir test1

# function read_dir(){
#   for file in `ls $1`
#   do
#     if [ -d $1"/"$file ]
#     then  
#       read_dir $1"/"$file
#     else
#       echo $1"/"$file
#     fi
#   done 
# }


# if [ ! -d "./seo_config/seo_Ethereum_Polygon/ETM/" ]
# then
#   echo "文件夹不存在"
# else
#   echo "文件夹已经存在"
# fi





# function read_dir(){
#   for file in $1/*.sh
#   do
#     if [ -d $1"/"$file ]
#     then  
#       read_dir $1"/"$file
#     else
#       echo $file
#       sh seo_make.sh $file
#     fi
#   done 
# }
# read_dir seo_config



# rm -rf ./test1/test2/test3
# mkdir ./test1/test2/test3



# configPath="./seo_config/all_seo_cfg.sh"
# echo "input config name : $1"

# if [ ${#1} -gt 0 ]
# then
#   configFile="./seo_config/$1.sh" 
#   if [ -f "$configFile" ]
#   then
#     configPath=$configFile
#   else
#     echo "不存在配置文件: $configFile"
#     exit
#   fi
# fi

# echo "start import params"
# . $configPath
# echo $TokenFull





# echo "hello test"
# echo ${#BridgedTokenTicker}
# if [ ${#BridgedTokenTicker} -gt 5 ]
# then
#   echo "大于0"
# fi

# if [ ${Chain_Info1_TokenFull} == ${Chain_Info1_TokenTicker} ]
# then
#   echo "Chain_Info1_TokenFull 相同"
# else
#   echo "Chain_Info1_TokenFull 不相同"
# fi

# if [ ${Chain_Info2_TokenFull} == ${Chain_Info2_TokenTicker} ]
# then
#   echo "Chain_Info2_TokenFull 相同"
# else
#   echo "Chain_Info2_TokenFull 不相同"
# fi



