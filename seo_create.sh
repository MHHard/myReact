

function read_dir(){
  for file in $1/*.sh
  do
    if [ -d $1"/"$file ]
    then  
      read_dir $1"/"$file
    else
      echo $file
      sh seo_one_create.sh $file
    fi
  done 
}

read_dir seo_config