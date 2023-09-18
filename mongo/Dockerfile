FROM mongo

ENV MONGO_INITDB_ROOT_USERNAME=admin-user
ENV MONGO_INITDB_ROOT_PASSWORD=admin-password
ENV MONGO_DB=mean-football
ENV MONGO_DB_USERNAME=admin-user1
ENV MONGO_DB_PASSWORD=admin-password1

RUN echo "The ARG variable value is $MONGO_INITDB_ROOT_USERNAME, $MONGO_INITDB_ROOT_PASSWORD, $MONGO_DB"
RUN echo "The ARG variable value is $MONGO_DB_USERNAME, $MONGO_DB_PASSWORD"

COPY init-db.d /docker-entrypoint-initdb.d
