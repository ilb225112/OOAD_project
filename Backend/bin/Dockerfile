# Use a base image with Java 21
FROM eclipse-temurin:21-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy everything from current context (your backend folder) to /app
COPY . .

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Build the project, skipping tests
RUN ./mvnw clean package -DskipTests

# Expose the port your app runs on
EXPOSE 8080

# Run the JAR file created in target/
CMD ["java", "-jar", "target/AuctionSystem-0.0.1-SNAPSHOT.jar"]
