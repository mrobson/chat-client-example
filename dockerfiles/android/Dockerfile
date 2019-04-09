FROM  mrobson/chat-client-base

RUN mkdir -p /home/node/chat-client

COPY ./ /home/node/chat-client/.

RUN cp /home/node/chat-client/src/app/images/android.jpg /home/node/chat-client/src/app/images/main.jpg

WORKDIR /home/node/chat-client

ENV ENVIRONMENT="production"
ENV ServerURL="localhost:9999"
ENV City="Toronto"

EXPOSE 4200
RUN pwd
CMD cd /home/node/chat-client && npm run-script build && npm start
