FROM node:erbium as build

WORKDIR /build

COPY . .

RUN npm ci \
 && npm run build

FROM buildkite/puppeteer:5.2.1 as install

WORKDIR /app
COPY --from=build /build/package.json .
COPY --from=build /build/package-lock.json .

RUN npm ci --production \
 && npm cache clear -fg

FROM install

COPY --from=build /build/bin ./bin
COPY --from=build /build/dist ./dist

CMD [ "./bin/autius-checker" ]
