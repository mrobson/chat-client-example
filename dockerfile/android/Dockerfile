FROM  ljhiyh/chat-client-base

RUN mkdir -p /home/node/chat-client

COPY ./ /home/node/chat-client/.

RUN cp /home/node/chat-client/src/app/images/android.jpg /home/node/chat-client/src/app/images/main.jpg

WORKDIR /home/node/chat-client

EXPOSE 4200
RUN pwd
CMD cd /home/node/chat-client && \
    npm start
#CMD ['npm start']
#ENTRYPOINT ['npm start']
