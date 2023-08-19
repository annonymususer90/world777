FROM ghcr.io/puppeteer/puppeteer:21.0.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
	LOG_DIR=/var/log/app/

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
