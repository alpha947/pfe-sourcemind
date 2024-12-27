# appB/Dockerfile
FROM openjdk:17-jdk-alpine
VOLUME /tmp
COPY appC.jar /appB.jar
ENTRYPOINT ["java","-jar","/appC.jar"]
