#FROM eclipse-temurin:23
#
#WORKDIR /app
#
#COPY . .
#
#RUN apt-get update && apt-get install -y maven
#
#RUN mvn clean package -DskipTests
#
#EXPOSE 8080
#
#CMD ["java","-jar","target/*.jar"]

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]