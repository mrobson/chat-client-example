for docker in $(ls ./dockerfile/ |grep -v baseimage)
do 
  cp  ./dockerfile/$docker/Dockerfile .
  docker build -t docker.io/ljhiyh/chat-client:$docker .
  docker push docker.io/ljhiyh/chat-client:$docker
done
