FROM equalexperts.in/minutedock:base
ADD ./dist /minutedock
RUN cd minutedock && npm install --production
