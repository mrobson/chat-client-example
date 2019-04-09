#for docker in $(ls ./dockerfiles/ |grep -v baseimage)
#do 
  docker=v1
  echo $docker
  cp  ./dockerfiles/$docker/Dockerfile .
  docker build -t docker.io/mrobson/chat-client:$docker .
  docker push docker.io/mrobson/chat-client:$docker
#done
