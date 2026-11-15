# ==========================================
# Stage 1: Build Quarkus Backend (Gradle Kotlin DSL)
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS quarkus-builder
WORKDIR /app

# Copy Gradle wrapper and configuration files
COPY backend/build.gradle.kts backend/gradle.properties backend/settings.gradle.kts backend/gradlew ./
COPY backend/gradle ./gradle

RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon

# Copy the rest of the backend source code
COPY backend/ .

# Grant execution permission before running gradlew
RUN chmod +x gradlew

# Build Quarkus
RUN ./gradlew build -Pquarkus.package.type=fast-jar -x test --no-daemon --info --stacktrace

# ==========================================
# Stage 2: Run Quarkus Backend
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /work/

# Copy the fast-jar packaging structure from Gradle's build folder
COPY --from=quarkus-builder /app/build/quarkus-app/lib/ /work/lib/
COPY --from=quarkus-builder /app/build/quarkus-app/*.jar /work/
COPY --from=quarkus-builder /app/build/quarkus-app/app/ /work/app/
COPY --from=quarkus-builder /app/build/quarkus-app/quarkus/ /work/quarkus/

EXPOSE 8080

# Render assigns a dynamic port via the $PORT environment variable.
CMD java -Dquarkus.http.host=0.0.0.0 -Dquarkus.http.port=${PORT:-8080} -jar /work/quarkus-run.jar