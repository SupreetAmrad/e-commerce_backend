@echo off
echo Running Spring Boot Application...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
set MAVEN_HOME=C:\Maven\apache-maven-3.9.6
"%MAVEN_HOME%\bin\mvn" clean spring-boot:run -X
