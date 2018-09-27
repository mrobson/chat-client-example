FROM  ljhiyh/chat-client-base

RUN mkdir -p /home/node/chat-client

COPY ./ /home/node/chat-client/.

WORKDIR /home/node/chat-client

EXPOSE 4200
RUN pwd
CMD cd /home/node/chat-client && \
    npm start
#CMD ['npm start']
#ENTRYPOINT ['npm start']
