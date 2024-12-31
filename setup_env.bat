@echo off
echo Setting up Java and Maven environment variables...

:: Set JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-17" /M

:: Set Maven home
setx M2_HOME "C:\Program Files\Apache\maven" /M

:: Add to PATH
setx PATH "%PATH%;%JAVA_HOME%\bin;%M2_HOME%\bin" /M

echo Environment variables have been set.
echo Please restart your command prompt for changes to take effect.

:: Verify installations
echo Verifying Java installation...
java -version

echo.
echo Verifying Maven installation...
mvn -version

pause
